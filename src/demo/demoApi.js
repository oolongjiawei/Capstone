// Demo mode for the Vercel deployment.
// The original app talks to an Express + MySQL API on localhost:8080. Here those
// requests are answered in the browser (accounts, saved cookies, saved charts live in
// localStorage), while the Bazi calculation runs on the real engine in /api/bazi.
import fortuneCookies from "./fortune_cookies.json";

const KEY = "fortune-house-demo";
const COOKIES = fortuneCookies.map((c, i) => ({ id: i + 1, message: c.message }));
export const DEMO_USER = { email: "demo@fortunehouse.app", password: "fortune", username: "Guest" };

const hash = async (s) => {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
};

async function loadDb() {
  let db = null;
  try { db = JSON.parse(localStorage.getItem(KEY)); } catch { /* ignore */ }
  if (!db) {
    db = { nextId: 2, users: [{ id: 1, email: DEMO_USER.email, username: DEMO_USER.username, password: await hash(DEMO_USER.password) }], bazi: {}, cookies: [] };
    saveDb(db);
  }
  return db;
}
const saveDb = (db) => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { /* ignore */ } };

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

async function route(method, path, body) {
  const db = await loadDb();
  let m;

  if (method === "post" && path === "/api/auth/register") {
    const { email, username, password } = body;
    if (!email || !username || !password || db.users.some((u) => u.email === email)) throw new HttpError(400, "Error registering user");
    const user = { id: db.nextId++, email, username, password: await hash(password) };
    db.users.push(user);
    saveDb(db);
    return { token: "demo-token", userId: user.id, username };
  }
  if (method === "post" && path === "/api/auth/login") {
    const user = db.users.find((u) => u.email === body.email);
    if (!user || user.password !== (await hash(body.password || ""))) throw new HttpError(401, "Authentication is invalid");
    return { token: "demo-token", userId: user.id, username: user.username };
  }
  if (method === "post" && path === "/api/fortune/cookie") {
    const { save, userId, cookieId } = body;
    if (!userId) throw new HttpError(400, "User ID is required.");
    const fortune = cookieId ? COOKIES.find((c) => c.id === +cookieId) : COOKIES[Math.floor(Math.random() * COOKIES.length)];
    if (!fortune) throw new HttpError(404, "Fortune cookie not found.");
    if (save) {
      db.cookies.push({ user_id: +userId, cookie_id: fortune.id, cookie_message: fortune.message, created_at: new Date().toISOString() });
      saveDb(db);
    }
    return { id: fortune.id, fortune: fortune.message };
  }
  if (method === "get" && path === "/api/fortune/cookies") return COOKIES;
  if (method === "post" && path === "/api/fortune/bazi") {
    const { userId, birthYear, birthMonth, birthDay, birthTime, save } = body;
    if (!userId) throw new HttpError(400, "Invalid input parameters.");
    const res = await fetch("/api/bazi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ birthYear, birthMonth, birthDay, birthTime }),
    });
    const json = await res.json();
    if (!res.ok) throw new HttpError(res.status, json.message);
    const r = json.bazi;
    const bazi = {
      user_id: +userId, birth_year: +birthYear, birth_month: +birthMonth, birth_day: +birthDay, birth_time: +birthTime,
      bazi_year: r.year, bazi_month: r.month, bazi_day: r.day, bazi_time: r.time,
      element: r.element, element_color: r.element_color, brief: r.brief,
      symbol_year: r.symbol_year, symbol_month: r.symbol_month, symbol_day: r.symbol_day, symbol_time: r.symbol_time,
    };
    if (!save) return { message: "Bazi data generated.", bazi };
    const existed = !!db.bazi[userId];
    db.bazi[userId] = bazi;
    saveDb(db);
    return { message: existed ? "Bazi data updated." : "Bazi data saved.", bazi };
  }
  if (method === "get" && (m = path.match(/^\/api\/fortune\/user\/(\d+)\/bazi$/))) {
    const bazi = db.bazi[m[1]];
    if (!bazi) throw new HttpError(404, "No fortune data found for this user.");
    return bazi;
  }
  if (method === "get" && (m = path.match(/^\/api\/fortune\/user\/(\d+)\/saved-cookies$/))) {
    return db.cookies.filter((c) => c.user_id === +m[1]).map(({ cookie_id, cookie_message, created_at }) => ({ cookie_id, cookie_message, created_at }));
  }
  if (method === "get" && (m = path.match(/^\/api\/fortune\/user\/(\d+)\/daily-cookie$/))) {
    const today = new Date().toISOString().split("T")[0];
    const c = db.cookies.find((x) => x.user_id === +m[1] && x.created_at.startsWith(today));
    if (!c) throw new HttpError(404, "No fortune cookie found for today.");
    return { id: c.cookie_id, fortune: c.cookie_message };
  }
  if (method === "delete" && (m = path.match(/^\/api\/fortune\/user\/(\d+)\/cookies\/(\d+)$/))) {
    const before = db.cookies.length;
    db.cookies = db.cookies.filter((c) => !(c.user_id === +m[1] && c.cookie_id === +m[2]));
    if (db.cookies.length === before) throw new HttpError(404, "Fortune cookie not found or already deleted.");
    saveDb(db);
    return { message: "Fortune cookie deleted successfully." };
  }
  throw new HttpError(404, "Not found");
}

export function installDemoApi(axios) {
  const passthrough = axios.getAdapter(axios.defaults.adapter);
  axios.defaults.adapter = async (config) => {
    const url = new URL(config.url, window.location.origin);
    if (url.host !== "localhost:8080") return passthrough(config);

    const body = typeof config.data === "string" ? JSON.parse(config.data || "{}") : config.data || {};
    const reply = (status, data) => ({ data, status, statusText: String(status), headers: {}, config, request: {} });
    try {
      return reply(200, await route((config.method || "get").toLowerCase(), url.pathname, body));
    } catch (e) {
      const status = e.status || 500;
      throw new axios.AxiosError(e.message, status < 500 ? "ERR_BAD_REQUEST" : "ERR_BAD_RESPONSE", config, {}, reply(status, { message: e.message }));
    }
  };
}
