// clean-all-imports.js
const fs = require("fs");
const path = require("path");

const rootDir = "./app/components/ui";

function cleanImports(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            cleanImports(fullPath);
        } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
            let content = fs.readFileSync(fullPath, "utf-8");

            // Supprime toute version du style "@xxx@1.2.3"
            const newContent = content.replace(
                /(["'])((?:@?[\w-]+\/?[\w-]+))@\d+\.\d+\.\d+(["'])/g,
                '"$2"'
            );

            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent);
                console.log(`✅ Cleaned: ${fullPath}`);
            }
        }
    }
}

console.log("🚀 Cleaning ALL imports with versions...");
cleanImports(rootDir);
console.log("✨ Done!");
