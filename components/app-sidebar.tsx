"use client";

import * as React from "react";
import {
	AudioWaveform,
	BookOpen,
	Bot,
	Command,
	Frame,
	GalleryVerticalEnd,
	Map,
	PieChart,
	Settings2,
	SquareTerminal,
	File,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
	user: {
		name: "Yash Sharma",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	team: {
		name: "OCR Generative AI",
		logo: GalleryVerticalEnd,
		plan: "Scan all your receipts.",
	},

	navMain: [
		{
			title: "Receipts & Transactions",
			url: "/",
			icon: BookOpen,
			isActive: true,
			items: [
				{
					title: "Dashboard",
					url: "/",
				},
				{
					title: "Upload New Receipt",
					url: "/upload-receipt",
				},
				{
					title: "Receipt OCR Requests",
					url: "/receipt-request-history",
				},
				{
					title: "Transactions History",
					url: "/transaction-history",
				},
			],
		},
		{
			title: "Standard Documents",
			url: "/upload-standard-document",
			icon: File,
			items: [
				{
					title: "Upload Standard Document",
					url: "/upload-standard-document",
				},
			],
		},
		// {
		// 	title: "Documentation",
		// 	url: "#",
		// 	icon: BookOpen,
		// 	items: [
		// 		{
		// 			title: "Introduction",
		// 			url: "#",
		// 		},
		// 		{
		// 			title: "Get Started",
		// 			url: "#",
		// 		},
		// 		{
		// 			title: "Tutorials",
		// 			url: "#",
		// 		},
		// 		{
		// 			title: "Changelog",
		// 			url: "#",
		// 		},
		// 	],
		// },
		// {
		// 	title: "Settings",
		// 	url: "#",
		// 	icon: Settings2,
		// 	items: [
		// 		{
		// 			title: "General",
		// 			url: "#",
		// 		},
		// 		{
		// 			title: "Team",
		// 			url: "#",
		// 		},
		// 		{
		// 			title: "Billing",
		// 			url: "#",
		// 		},
		// 		{
		// 			title: "Limits",
		// 			url: "#",
		// 		},
		// 	],
		// },
	],
	projects: [
		// {
		// 	name: "Design Engineering",
		// 	url: "#",
		// 	icon: Frame,
		// },
		// {
		// 	name: "Sales & Marketing",
		// 	url: "#",
		// 	icon: PieChart,
		// },
		// {
		// 	name: "Travel",
		// 	url: "#",
		// 	icon: Map,
		// },
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar
			collapsible="icon"
			{...props}>
			<SidebarHeader>
				<TeamSwitcher team={data.team} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				{/* <NavProjects projects={data.projects} /> */}
			</SidebarContent>
			<SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
