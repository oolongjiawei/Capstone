// Vercel serverless function: the Bazi engine from Capstone-API, stateless.
// POST { birthYear, birthMonth, birthDay, birthTime } -> { bazi }
import BaziConverter from "./_lib/functions/BaziConverter.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const year = parseInt(body.birthYear);
  const month = parseInt(body.birthMonth);
  const day = parseInt(body.birthDay);
  const time = parseInt(body.birthTime);

  if (!year || !month || !day || Number.isNaN(time)) {
    return res.status(400).json({ message: "Invalid input parameters." });
  }
  try {
    const bazi = new BaziConverter(year, month, day, time).getBaziJson();
    return res.status(200).json({ bazi });
  } catch {
    return res.status(400).json({ message: "Unable to generate Bazi for this date (supported years: 1901–2033)." });
  }
}
