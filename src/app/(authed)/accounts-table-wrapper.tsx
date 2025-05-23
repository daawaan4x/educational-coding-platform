"use client";

// We need to use thi wrapper because the width of the content must vary
// depending on the sidebar state. We need a client component to use React Context.
import { DataTable } from "@/components/data-table";
import { useSidebar } from "@/components/ui/sidebar";
import { Account } from "@/lib/types";
import { cn } from "@/lib/utils";
import { columns } from "./accounts-columns";

export default function AccountsTableWrapper({ accounts }: { accounts: Account[] }) {
	const { state, isMobile } = useSidebar();

	return (
		<div
			className={cn("align-items mt-3 flex w-full flex-col justify-center overflow-hidden px-8 pb-8", {
				"w-[calc(100vw-16rem)]": state == "expanded" && !isMobile,
			})}>
			<h2>Manage Accounts</h2>
			<DataTable columns={columns} data={accounts} />
		</div>
	);
}
