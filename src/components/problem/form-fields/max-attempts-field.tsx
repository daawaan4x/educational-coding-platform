import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface MaxAttemptsFieldProps {
	value: number;
	onChange: (value: number) => void;
	error: boolean;
	readonly?: boolean;
}

export function MaxAttemptsField({ value, onChange, error, readonly }: MaxAttemptsFieldProps) {
	if (readonly) {
		return (
			<div className="flex items-center justify-between py-2">
				<span className="text-muted-foreground text-sm font-medium">Max Attempts</span>
				<span className="text-sm font-semibold">{value || "5"}</span>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<Label htmlFor="maxAttempts">Max Attempts *</Label>
			<Input
				id="maxAttempts"
				type="number"
				min="1"
				placeholder="e.g. 5"
				value={value || ""}
				onChange={(e) => onChange(Number(e.target.value) || 0)}
				className={cn({ "border-red-500": error })}
				required
			/>
			{error && <p className="text-sm text-red-500">Max attempts is required</p>}
		</div>
	);
}
