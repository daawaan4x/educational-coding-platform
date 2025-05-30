import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
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
