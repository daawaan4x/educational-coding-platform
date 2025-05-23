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
