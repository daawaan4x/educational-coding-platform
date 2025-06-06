// AI Generated Script

import fs from "fs";
import path from "path";

const directoryPath = path.join(__dirname, "../../static/templates"); // Change if needed

// Read the directory
fs.readdir(directoryPath, (err, files) => {
	if (err) {
		return console.error("Error reading directory:", err);
	}

	const result: Record<string, string> = {};

	files.forEach((file) => {
		const match = /^default\.(\w+)$/.exec(file); // Match files like sample.js, sample.py
		if (match) {
			const ext = match[1]; // Get the extension
			const filePath = path.join(directoryPath, file);
			const content = fs.readFileSync(filePath, "utf8");
			result[ext] = content;
		}
	});

	console.log(JSON.stringify(result));
});
