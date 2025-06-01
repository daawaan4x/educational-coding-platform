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
} from "@/components/ui/sidebar";
import { Braces, Command, SquareTerminal, Waypoints } from "lucide-react";
import Image from "next/image";
import * as React from "react";

const data = {
	user: {
		name: "luke",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "Playground",
			url: "#",
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
				<NavClasses classes={data.classes} />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
