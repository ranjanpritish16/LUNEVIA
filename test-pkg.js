fetch("http://localhost:3001/api/ai/package", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    answers: {
      weddingDate: "2026-12-01",
      budgetRange: "15000-30000",
      services: ["bridal-makeup"],
      aesthetic: "glamorous-bold",
      skinTone: "medium"
    }
  })
}).then(r => r.json()).then(data => console.log(JSON.stringify(data, null, 2))).catch(console.error);
