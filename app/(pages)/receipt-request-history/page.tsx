"use client";
import React, { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import Link from "next/link";
import { baseURL } from "@/config";

interface Receipt {
	request_id: string;
	created_at: string;
	ocr_result: string;
	s3_file_path: string;
	status: string;
	updated_at: string;
}

const ReceiptManagementPage = () => {
	const [activeTab, setActiveTab] = useState("upload");
	const [receipts, setReceipts] = useState<Receipt[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (activeTab === "upload") {
			fetchReceipts();
		}
	}, [activeTab]);

	const fetchReceipts = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(baseURL + "/requests/");
			if (!res.ok) {
				throw new Error(`Error fetching receipts: ${res.statusText}`);
			}
			const data = await res.json();
			// Assuming data.items is the array of receipts
			setReceipts(data.items);
		} catch (err: any) {
			setError(err.message || "Unknown error");
		} finally {
			setLoading(false);
		}
	};

	// Helper to extract vendor and amount from ocr_result (which is a string)
	// You can improve this with your own parsing logic or use standardized fields if available
	const parseOcrResult = (ocrResult: string) => {
		// Simple example: extract first line as vendor, last line with "円" as amount (Japanese Yen)
		const lines = ocrResult
			.split("\n")
			.map((l) => l.trim())
			.filter(Boolean);
		let vendor = lines[1] || "Unknown Vendor";
		let amount = "N/A";

		// Find line containing "円" (Yen symbol)
		const amountLine = lines.find((line) => line.includes("円"));
		if (amountLine) {
			amount = amountLine;
		}

		return { vendor, amount };
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Main Content */}
			<main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Main Content Area */}
					<div className="lg:col-span-4 space-y-6">
						{activeTab === "upload" && (
							<>
								<div className="flex items-center justify-between">
									<h2 className="text-2xl font-bold text-gray-900">
										Upload Receipt
									</h2>
									<Link href={"/upload-receipt"}>
										<Button size="sm">
											<Plus className="h-4 w-4 mr-2" />
											New Upload
										</Button>
									</Link>
								</div>

								<Card>
									<CardHeader>
										<CardTitle>Recent Uploads</CardTitle>
										<CardDescription>
											Your recently processed receipts
										</CardDescription>
									</CardHeader>
									<CardContent>
										{loading ? (
											<p>Loading receipts...</p>
										) : error ? (
											<p className="text-red-600">Error: {error}</p>
										) : receipts.length === 0 ? (
											<p>No receipts found.</p>
										) : (
											<div className="rounded-md border">
												<table className="min-w-full divide-y divide-gray-200">
													<thead className="bg-gray-50">
														<tr>
															<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
																Date
															</th>
															<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
																Vendor
															</th>
															<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
																Amount
															</th>
															<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
																Status
															</th>
															<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
																Actions
															</th>
														</tr>
													</thead>
													<tbody className="bg-white divide-y divide-gray-200">
														{receipts.map((receipt) => {
															const { vendor, amount } = parseOcrResult(
																receipt.ocr_result
															);
															return (
																<tr key={receipt.request_id}>
																	<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
																		{new Date(
																			receipt.created_at
																		).toLocaleDateString()}
																	</td>
																	<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
																		{vendor}
																	</td>
																	<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
																		{amount}
																	</td>
																	<td className="px-6 py-4 whitespace-nowrap">
																		<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
																			{receipt.status}
																		</span>
																	</td>
																	<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
																		<Button
																			variant="ghost"
																			size="sm">
																			<FileText className="h-4 w-4" />
																		</Button>
																	</td>
																</tr>
															);
														})}
													</tbody>
												</table>
											</div>
										)}
									</CardContent>
								</Card>
							</>
						)}
					</div>
				</div>
			</main>
		</div>
	);
};

export default ReceiptManagementPage;
