import Problem from "@/app/(authed)/problem";

// Remove static import of Quill to avoid SSR issues

export default function Page() {
	return <Problem showSubmissions={true} descriptionReadonly={true} />;
}
