"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { AppSidebar } from "@/app/(authed)/app-sidebar";
import BanterLoad from "@/components/banter-load";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthedLayout } from "@/lib/auth";
import TRPCProvider from "@/lib/trpc/provider";
import { Separator } from "@radix-ui/react-separator";
import Loading from "./loading";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

// export const metadata: Metadata = {
// 	title: "[Role] Dashboard",
// };

// Placeholder `user` object
// Implementation of role/permissions attributes may be different,
// but the logic should be the same.
// const user = {
// 	role: "teacher",
// };

// User must already be authenticated here.
// We should have a `user` object here now.
// Sidebar content depends on the user role.

// Only the roles `teacher` and `student` have the list of classes
// shown on the sidebar.

// [Role: Teacher | Student]
// Once class is selected, its name will be used for the breadcrumb.

export default function Page({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<TRPCProvider>
					<AuthedLayout
						Loading={
							<div className="flex h-full w-full items-center justify-center">
								<BanterLoad />
							</div>
						}>
						<SidebarProvider>
							<AppSidebar />
							<SidebarInset>
								<header className="flex h-16 shrink-0 items-center gap-2">
									<div className="flex items-center gap-2 px-4">
										<SidebarTrigger className="-ml-1" />
										<Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
										<Breadcrumb>
											<BreadcrumbList>
												<BreadcrumbItem className="hidden md:block">
													<BreadcrumbLink href="#">Data Structures & Algorithms</BreadcrumbLink>
												</BreadcrumbItem>
												{/* <BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>Data Fetching</BreadcrumbPage>
								</BreadcrumbItem> */}
											</BreadcrumbList>
										</Breadcrumb>
									</div>
								</header>
								{children}
							</SidebarInset>
						</SidebarProvider>
					</AuthedLayout>
				</TRPCProvider>
			</body>
		</html>
	);
}
