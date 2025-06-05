import { useState } from "react";

interface ValidationErrors {
	title: boolean;
	maxScore: boolean;
	maxAttempts: boolean;
	deadline: boolean;
	classId: boolean;
}

export function useProblemEditor() {
	const [title, setTitle] = useState("");
	const [deadline, setDeadline] = useState<Date>();
	const [deadlineTime, setDeadlineTime] = useState("23:59");
	const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
		title: false,
		maxScore: false,
		maxAttempts: false,
		deadline: false,
		classId: false,
	});

	const validateForm = (
		maxScore: number,
		maxAttempts: number,
		classId: string | undefined,
		deadline: string | undefined,
	): boolean => {
		const errors: ValidationErrors = {
			title: !title.trim(),
			maxScore: maxScore <= 0,
			maxAttempts: maxAttempts <= 0,
			deadline: !deadline || !deadlineTime.trim(),
			classId: !classId,
		};
		setValidationErrors(errors);
		return !Object.values(errors).some((error) => error);
	};

	const resetForm = () => {
		setTitle("");
		setDeadline(undefined);
		setDeadlineTime("23:59");
		setValidationErrors({
			title: false,
			maxScore: false,
			maxAttempts: false,
			deadline: false,
			classId: false,
		});
	};

	return {
		title,
		setTitle,
		deadline,
		setDeadline,
		deadlineTime,
		setDeadlineTime,
		validationErrors,
		setValidationErrors,
		validateForm,
		resetForm,
	};
}
