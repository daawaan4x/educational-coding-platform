import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function firstTwoCapitalized(str: string) {
	if (typeof str !== "string" || str.length === 0) return "";
	const firstTwo = str.slice(0, 2).toUpperCase();
	return firstTwo;
}

export function capitalizeFirstLetter(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function camelToWords(input: string): string {
	return input
		.replace(/([a-z])([A-Z])/g, "$1 $2") // insert space between lowercase and uppercase
		.toLowerCase(); // convert the whole string to lowercase
}

export function listToFalseObject(keys: string[]): Record<string, boolean> {
	return Object.fromEntries(keys.map((key) => [key, false]));
}

export function camelToCapitalizedWords(input: string): string {
	return input
		.replace(/([a-z])([A-Z])/g, "$1 $2") // insert space between lowercase and uppercase
		.replace(/^./, (str: string) => (str as string).toUpperCase()) // capitalize the first letter
		.replace(/ (\w)/g, (_: string, c: string) => " " + (c as string).toUpperCase()); // capitalize letters after spaces
}

export function capitalizeWords(text: string): string {
	return text
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
}
