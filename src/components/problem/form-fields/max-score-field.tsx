import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface MaxScoreFieldProps {
	value: number;
	onChange: (value: number) => void;
	error: boolean;
	touched?: boolean;
	readonly?: boolean;
}

export function MaxScoreField({ value, onChange, error, touched = false, readonly = false }: MaxScoreFieldProps) {
	if (readonly) {
		return (
			<div className="flex items-center justify-between py-2">
				<span className="text-muted-foreground text-sm font-medium">Max Score</span>
				<span className="text-sm font-semibold">{value || "100"}</span>
			</div>
		);
	}

	const shouldShowError = error && touched;

	return (
		<div className="space-y-2">
			<Label htmlFor="maxScore">Max Score *</Label>
			<Input
				id="maxScore"
				type="number"
				min="1"
				placeholder="e.g. 100"
				value={value || ""}
				onChange={(e) => onChange(Number(e.target.value) || 0)}
				className={cn({ "border-red-500": shouldShowError })}
				required
			/>
			{shouldShowError && <p className="text-sm text-red-500">Max score is required</p>}
		</div>
	);
}
