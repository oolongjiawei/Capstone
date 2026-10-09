// Demo mode for the Vercel deployment.
// The original app talks to an Express + MySQL API on localhost:8080. Here those
// requests are answered in the browser (accounts, saved cookies, Bazi profiles live in
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
    db = { nextId: 2, users: [{ id: 1, email: DEMO_USER.email, username: DEMO_USER.username, password: await hash(DEMO_USER.password) }], profiles: [], nextProfileId: 1, cookies: [] };
    saveDb(db);
  }
  // Older demo data kept one chart per user (db.bazi); turn each into a named profile
  if (db.bazi) {
    db.profiles = db.profiles || [];
    db.nextProfileId = db.nextProfileId || 1;
    for (const [userId, bazi] of Object.entries(db.bazi)) {
      const user = db.users.find((u) => u.id === +userId);
      db.profiles.push({ id: db.nextProfileId++, name: user?.username || "Me", created_at: new Date().toISOString(), ...bazi });
    }
    delete db.bazi;
    saveDb(db);
  }
  return db;
}
const saveDb = (db) => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { /* ignore */ } };

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

// Runs the real Bazi engine (/api/bazi) and shapes the result like a stored profile row
async function calculateBazi(userId, { name, birthYear, birthMonth, birthDay, birthTime }) {
  const trimmedName = (name || "").trim();
  if (!userId || !trimmedName) throw new HttpError(400, "Invalid input parameters.");
  const res = await fetch("/api/bazi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ birthYear, birthMonth, birthDay, birthTime }),
  });
  const json = await res.json();
  if (!res.ok) throw new HttpError(res.status, json.message);
  const r = json.bazi;
  return {
    user_id: userId, name: trimmedName, birth_year: +birthYear, birth_month: +birthMonth, birth_day: +birthDay, birth_time: +birthTime,
    bazi_year: r.year, bazi_month: r.month, bazi_day: r.day, bazi_time: r.time,
    element: r.element, element_color: r.element_color, brief: r.brief,
    symbol_year: r.symbol_year, symbol_month: r.symbol_month, symbol_day: r.symbol_day, symbol_time: r.symbol_time,
  };
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
    const { userId, save } = body;
    const bazi = await calculateBazi(+userId, body);
    if (!save) return { message: "Bazi data generated.", bazi };
    // every save is a new profile, so one account can keep charts for several people
    const profile = { id: db.nextProfileId++, created_at: new Date().toISOString(), ...bazi };
    db.profiles.push(profile);
    saveDb(db);
    return { message: "Bazi profile saved.", bazi: profile };
  }
  if (method === "get" && (m = path.match(/^\/api\/fortune\/user\/(\d+)\/profiles$/))) {
    return db.profiles
      .filter((p) => p.user_id === +m[1])
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  if (method === "put" && (m = path.match(/^\/api\/fortune\/user\/(\d+)\/profiles\/(\d+)$/))) {
    const profile = db.profiles.find((p) => p.user_id === +m[1] && p.id === +m[2]);
    if (!profile) throw new HttpError(404, "Bazi profile not found.");
    Object.assign(profile, await calculateBazi(+m[1], body), { updated_at: new Date().toISOString() });
    saveDb(db);
    return { message: "Bazi profile updated.", bazi: profile };
  }
  if (method === "delete" && (m = path.match(/^\/api\/fortune\/user\/(\d+)\/profiles\/(\d+)$/))) {
    const before = db.profiles.length;
    db.profiles = db.profiles.filter((p) => !(p.user_id === +m[1] && p.id === +m[2]));
    if (db.profiles.length === before) throw new HttpError(404, "Bazi profile not found.");
    saveDb(db);
    return { message: "Bazi profile deleted." };
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
