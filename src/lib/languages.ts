export const languages = ["c", "cpp", "py", "java", "js", "ts", "php"] as const;

export type Language = (typeof languages)[number];

export const languageLabels = {
	c: "C",
	cpp: "C++",
	php: "PHP",
	py: "Python",
	java: "Java",
	js: "Javascript",
	ts: "Typescript",
} satisfies Record<Language, string>;

export const languageTemplates = {
	c: '#include <stdio.h>\n\nint main() {\n    printf("Hello World!");\n    return 0;\n}\n',
	cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World!" << endl;\n    return 0;\n}\n',
	java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}\n',
	js: "const readline = require('readline')\n\nlet input = ''\n\nfunction main() {\n    console.log(\"Hello World!\")\n}\n\n\n\n// Helper to read from STDIN\n\nconst rl = readline.createInterface({\n    input: process.stdin,\n    output: process.stdout,\n    terminal: false,\n})\n\nrl.on('line', (line) => {\n    input += line + '\\n'\n})\n\nrl.on('close', main)",
	php: '<?php\n    // Helper to read from STDIN\n    $input = stream_get_contents(STDIN);\n    $lines = explode("\\n", trim($input));\n\n    echo "Hello World!";\n?>',
	py: 'def main():\n    print("Hello World!")\n\nif __name__ == "__main__":\n    main()\n',
	ts: "import readline from 'readline'\n\nlet input = ''\n\nfunction main() {\n    console.log(\"Hello World!\")\n}\n\n\n\n// Helper to read from STDIN\n\nconst rl = readline.createInterface({\n    input: process.stdin,\n    output: process.stdout,\n    terminal: false,\n})\n\nrl.on('line', (line) => {\n    input += line + '\\n'\n})\n\nrl.on('close', main)",
} satisfies Record<Language, string>;
