import { Account } from "@/lib/types";
import { accounts } from "./accounts-columns";
import AccountsTableWrapper from "./accounts-table-wrapper";

async function getAccounts(): Promise<Account[]> {
	// Fetch data from your API here.
	return accounts;
}

export default async function Page() {
	const accounts = await getAccounts();

	return <AccountsTableWrapper accounts={accounts} />;
}
