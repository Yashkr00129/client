import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
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
