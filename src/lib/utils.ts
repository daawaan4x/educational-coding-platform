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
		.replace(/^./, (str: string) => str.toUpperCase()) // capitalize the first letter
		.replace(/ (\w)/g, (_: string, c: string) => " " + c.toUpperCase()); // capitalize letters after spaces
}

export function capitalizeWords(text: string): string {
	return text
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
}

/**
 * Pick fields from an object (type-safe)
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
	const result = {} as Pick<T, K>;
	for (const key of keys) {
		if (key in obj) {
			result[key] = obj[key];
		}
	}
	return result;
}

/**
 * Return keys of an object (type-safe)
 */
export function keysof<T extends object>(obj: T): (keyof T)[] {
	return Object.keys(obj) as (keyof T)[];
}
