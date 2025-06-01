/* eslint-disable @typescript-eslint/require-await */
import { AccountItem } from "@/lib/types";
import { accounts } from "./accounts-columns";
import AdminDashboardWrapper from "./admin-dashboard-wrapper";

async function getAccounts(): Promise<AccountItem[]> {
	// Fetch data from your API here.
	return accounts;
}

export default async function Page() {
	const accounts = await getAccounts();

	return <AdminDashboardWrapper accounts={accounts} />;
}
