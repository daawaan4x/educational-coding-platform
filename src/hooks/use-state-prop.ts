import { useEffect, useRef, useState } from "react";

/**
 * Two-way bind internal state and prop
 */
export function useStateProp<T>(prop: T, setProp?: (value: T) => void) {
	const [value, setValue] = useState(prop);
	const internalRef = useRef(false);

	useEffect(() => {
		if (value != prop) {
			internalRef.current = false;
			setValue(prop);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [prop]);

	useEffect(() => {
		if (value != prop && internalRef.current) setProp?.(value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	return [
		value,
		(value: T) => {
			internalRef.current = true;
			setValue(value);
		},
	] as const;
}
