const fs = require("fs");
const path = require("path");

const dirs = [".next", path.join("node_modules", ".cache")];

for (const dir of dirs) {
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`Removed ${dir}`);
}

console.log("Cache cleared. Run npm run dev to start fresh.");
