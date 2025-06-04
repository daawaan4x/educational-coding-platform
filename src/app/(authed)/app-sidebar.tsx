/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { NavClasses } from "@/components/nav-classes";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth";
import { Braces, LayoutDashboard, SquareTerminal, Waypoints } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import * as React from "react";

const data = {
	navMain: [
		{
			title: "Playground",
			url: "playground/",
			icon: SquareTerminal,
			isActive: true,
			// items: [
			//   {
			//     title: "History",
			//     url: "#",
			//   },
			//   {
			//     title: "Starred",
			//     url: "#",
			//   },
			//   {
			//     title: "Settings",
			//     url: "#",
			//   },
			// ],
		},
		{
			title: "Dashboard",
			url: "/",
			icon: LayoutDashboard,
			isActive: true,
		},
	],
	navSecondary: [
		// {
		//   title: "Support",
		//   url: "#",
		//   icon: LifeBuoy,
		// },
		// {
		//   title: "Feedback",
		//   url: "#",
		//   icon: Send,
		// },
	],
	classes: [
		{
			name: "Data Structures & Algorithms",
			url: "#",
			icon: Waypoints,
		},
		{
			name: "JS Basics",
			url: "#",
			icon: Braces,
		},
		// {
		//   name: "Sales & Marketing",
		//   url: "#",
		//   icon: PieChart,
		// },
		// {
		//   name: "Travel",
		//   url: "#",
		//   icon: Map,
		// },
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar> & {}) {
	const user = useAuth();

	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="#">
								<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
									<Image
										alt="CodeMight"
										src="/codemight-logo.png"
										width={32}
										height={32}
										style={{ borderRadius: "0.5rem" }}
									/>
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">CodeMight</span>
									<span className="truncate text-xs">Learn. Solve. Excel.</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				{/* {user.role === "teacher" || user.role === "student" ? (
					<NavClasses classes={data.classes} />
				) : null} */}
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser
					user={{
						name: `${user.data.first_name} ${user.data.last_name}`,
						email: user.data.email,
						avatar: `https://ui-avatars.com/api/?name=${user.data.first_name}+${user.data.last_name}`,
					}}
				/>
			</SidebarFooter>
		</Sidebar>
	);
}
