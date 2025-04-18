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
import { FileText } from "lucide-react";

interface Transaction {
	transaction_id: string;
	created_at: string;
	total_amount: string;
	purchased_items: Array<{ name: string; price?: string }>;
	transaction_date: string;
	status: string;
}

const TransactionsPage = () => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchTransactions();
	}, []);

	const fetchTransactions = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("http://localhost:8000/transactions/");
			if (!res.ok) {
				throw new Error(`Error fetching transactions: ${res.statusText}`);
			}
			const data = await res.json();
			setTransactions(data.items);
		} catch (err: any) {
			setError(err.message || "Unknown error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					<div className="lg:col-span-4 space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
						</div>

						<Card>
							<CardHeader>
								<CardTitle>Recent Transactions</CardTitle>
								<CardDescription>Your processed transactions</CardDescription>
							</CardHeader>
							<CardContent>
								{loading ? (
									<p>Loading transactions...</p>
								) : error ? (
									<p className="text-red-600">Error: {error}</p>
								) : transactions.length === 0 ? (
									<p>No transactions found.</p>
								) : (
									<div className="rounded-md border">
										<table className="min-w-full divide-y divide-gray-200">
											<thead className="bg-gray-50">
												<tr>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Transaction Date
													</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Total Amount
													</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Purchased Items
													</th>

													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Actions
													</th>
												</tr>
											</thead>
											<tbody className="bg-white divide-y divide-gray-200">
												{transactions.map((tx, index) => (
													<tr key={index}>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
															{new Date(
																tx.transaction_date
															).toLocaleDateString()}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
															{tx.total_amount}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
															{tx.purchased_items
																.map((item) =>
																	item.price
																		? `${item.name} (${item.price})`
																		: item.name
																)
																.join(", ")}
														</td>

														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
															<Button
																variant="ghost"
																size="sm">
																<FileText className="h-4 w-4" />
															</Button>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
};

export default TransactionsPage;
