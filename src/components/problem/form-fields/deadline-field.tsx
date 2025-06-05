import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface DeadlineFieldProps {
	deadline?: Date;
	setDeadline: (date?: Date) => void;
	deadlineTime: string;
	setDeadlineTime: (time: string) => void;
	error: boolean;
	readonly?: boolean;
}

export function DeadlineField({
	deadline,
	setDeadline,
	deadlineTime,
	setDeadlineTime,
	error,
	readonly,
}: DeadlineFieldProps) {
	if (readonly) {
		return (
			<div className="flex items-center justify-between py-2">
				<span className="text-muted-foreground text-sm font-medium">Deadline</span>
				<span className="text-sm font-semibold">
					{deadline && deadlineTime ? `${format(deadline, "PPP")} at ${deadlineTime}` : "Dec 25, 2024 at 11:59 PM"}
				</span>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<Label>Deadline *</Label>
			<div className="flex gap-2">
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className={cn("w-auto justify-start text-left font-normal", !deadline && "text-muted-foreground", {
								"border-red-500": error,
							})}>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{deadline ? format(deadline, "PPP") : "Pick a date"}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus />
					</PopoverContent>
				</Popover>
				<input
					type="time"
					value={deadlineTime}
					onChange={(e) => setDeadlineTime(e.target.value)}
					className="placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-fit w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
					required
				/>
			</div>
			{error && <p className="text-sm text-red-500">Date and time are required</p>}
		</div>
	);
}
