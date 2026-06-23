fetch("http://localhost:3001/api/ai/timeline", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ weddingDate: "2026-12-01" })
}).then(async r => {
  console.log("Status:", r.status);
  console.log("Body:", await r.text());
}).catch(console.error);
