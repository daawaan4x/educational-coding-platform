/* eslint-disable @typescript-eslint/require-await */
import ClassPageWrapper from "./class-page-wrapper";

// async function getProblems(): Promise<ProblemItemWithProgress[]> {
// 	// Fetch data from the API here.
// 	return problems;
// }

export default async function Page() {
	// const problems = await getProblems();

	return <ClassPageWrapper />;
}
