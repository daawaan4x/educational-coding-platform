import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ClassSelectorDialog } from "./class-selector-dialog";
import { DeadlineField } from "./deadline-field";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MaxAttemptsField } from "./max-attempts-field";
import { MaxScoreField } from "./max-score-field";

interface ValidationErrors {
	title: boolean;
	// maxAttempts: boolean;
	maxScore: boolean;
	deadline: boolean;
	classId: boolean;
}

interface ProblemFormFieldsProps {
	// maxAttempts: number;
	// setMaxAttempts: (attempts: number) => void;
	maxScore: number;
	setMaxScore: (score: number) => void;
	deadline?: Date;
	setDeadline: (date?: Date) => void;
	deadlineTime: string;
	setDeadlineTime: (time: string) => void;
	selectedClassId?: string;
	selectedClassName?: string;
	onClassSelect: (classId: string, className: string) => void;
	validationErrors: ValidationErrors;
	readonly?: boolean;
}

export function ProblemFormFields({
	// maxAttempts,
	// setMaxAttempts,
	maxScore,
	setMaxScore,
	deadline,
	setDeadline,
	deadlineTime,
	setDeadlineTime,
	selectedClassId,
	selectedClassName,
	onClassSelect,
	validationErrors,
	readonly = false,
}: ProblemFormFieldsProps) {
	if (readonly) {
		return (
			<>
				<Separator className="mt-4 mb-1" />
				<div className="mt-auto space-y-1">
					{/* <MaxAttemptsField value={maxAttempts} onChange={setMaxAttempts} error={false} readonly /> */}
					<Separator />
					<MaxScoreField value={maxScore} onChange={setMaxScore} error={false} readonly />
					<Separator />
					{selectedClassName && (
						<>
							<div className="flex items-center justify-between py-2">
								<span className="text-sm font-medium">Class:</span>
								<span className="text-muted-foreground text-sm">{selectedClassName}</span>
							</div>
							<Separator />
						</>
					)}
					<DeadlineField
						deadline={deadline}
						setDeadline={setDeadline}
						deadlineTime={deadlineTime}
						setDeadlineTime={setDeadlineTime}
						error={false}
						readonly
					/>
				</div>
			</>
		);
	}

	return (
		<>
			<Separator className="my-4" />
			<div className="bg-muted/30 mt-auto space-y-4 rounded-lg border p-4">
				<div className="grid gap-4 md:grid-cols-2">
					{/* <MaxAttemptsField
						value={maxAttempts}
						onChange={setMaxAttempts}
						error={validationErrors.maxAttempts}
					/> */}
					<MaxScoreField value={maxScore} onChange={setMaxScore} error={validationErrors.maxScore} />
					<div className="space-y-2">
						<label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							Class
						</label>
						<ClassSelectorDialog selectedClassId={selectedClassId} onClassSelect={onClassSelect}>
							<Button
								variant="outline"
								className={`w-full justify-start ${validationErrors.classId ? "border-red-500" : ""}`}>
								{selectedClassName ?? "Select Class"}
							</Button>
						</ClassSelectorDialog>
						{validationErrors.classId && <p className="text-sm text-red-500">Please select a class</p>}
					</div>
				</div>
				<DeadlineField
					deadline={deadline}
					setDeadline={setDeadline}
					deadlineTime={deadlineTime}
					setDeadlineTime={setDeadlineTime}
					error={validationErrors.deadline}
				/>
			</div>
		</>
	);
}
