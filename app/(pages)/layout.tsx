"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import axios from "axios";

export default function Layout({ children }: { children: React.ReactNode }) {
	axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
	return (
		<>
			<SidebarProvider>
				<AppSidebar />
				<main className="bg-gray-50 flex-1">
					<SidebarTrigger />
					{children}
				</main>
			</SidebarProvider>
		</>
	);
}
