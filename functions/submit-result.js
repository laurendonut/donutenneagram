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

  let body;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Invalid request body" });
  }

  const { name, percentages, counts, dominantTypes } = body || {};

  if (
    !name ||
    typeof name !== "string" ||
    !percentages ||
    !counts ||
    !Array.isArray(dominantTypes) ||
    dominantTypes.length === 0
  ) {
    return json(400, { error: "Missing or invalid fields in submission" });
  }

  try {
    const store = getStore("quiz-results");
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const record = {
      id,
      name: name.slice(0, 200),
      percentages,
      counts,
      dominantTypes,
      submittedAt: new Date().toISOString(),
    };

    await store.setJSON(id, record);

    return json(200, { ok: true, id });
  } catch (err) {
    return json(500, { error: "Could not save the result. Please try again." });
  }
};
