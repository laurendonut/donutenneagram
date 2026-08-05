import { getStore } from "@netlify/blobs";

const json = (status, data) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export default async (req) => {
  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  let body;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Invalid request body" });
  }

  if (!adminPassword || body?.password !== adminPassword) {
    return json(401, { error: "Incorrect password" });
  }

  if (!body?.id) {
    return json(400, { error: "Missing result id" });
  }

  try {
    const store = getStore("quiz-results");
    await store.delete(body.id);
    return json(200, { ok: true });
  } catch (err) {
    return json(500, { error: "Could not delete the result. Please try again." });
  }
};
