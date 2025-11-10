import fs from "fs";
import path from "path";

const uiDir = path.join(process.cwd(), "app/components/ui");

function cleanFile(filePath) {
    let content = fs.readFileSync(filePath, "utf8");
    const updated = content.replace(/(@radix-ui\/react-[a-zA-Z-]+)@\d+\.\d+\.\d+/g, "$1");

    if (content !== updated) {
        fs.writeFileSync(filePath, updated, "utf8");
        console.log("✅ Cleaned:", filePath);
    }
}

function walk(dir) {
    for (const file of fs.readdirSync(dir)) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            walk(filePath);
        } else if (filePath.endsWith(".tsx") || filePath.endsWith(".ts")) {
            cleanFile(filePath);
        }
    }
}

console.log("🚀 Cleaning Radix UI imports...");
walk(uiDir);
console.log("✨ Done! All @radix-ui imports cleaned.");
