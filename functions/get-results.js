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
  if (!adminPassword) {
    return json(500, {
      error:
        "No ADMIN_PASSWORD is set on this site yet. Add one in Netlify under Site configuration \u2192 Environment variables, then redeploy.",
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Invalid request body" });
  }

  if (body?.password !== adminPassword) {
    return json(401, { error: "Incorrect password" });
  }

  try {
    const store = getStore("quiz-results");
    const { blobs } = await store.list();

    const results = await Promise.all(
      blobs.map(({ key }) => store.get(key, { type: "json" }))
    );

    results.sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    return json(200, { ok: true, results });
  } catch (err) {
    return json(500, { error: "Could not load results. Please try again." });
  }
};
