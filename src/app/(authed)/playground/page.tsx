import CodeRunner from "../code-runner";

export const metadata = {
	title: "Playground",
};

export default function Page() {
	return (
		<div className="flex h-screen w-full items-center justify-center">
			<CodeRunner />
		</div>
	);
}
