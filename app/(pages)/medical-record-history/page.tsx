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
import { baseURL } from "@/config";
import ocrResultApi from "@/api/ocrResult";
import { OcrResultForMedicalRecord } from "@/lib/types";
import { useRouter } from "next/navigation";

const MedicalRecordsPage = () => {
	const router = useRouter();
	const [medicalRecords, setMedicalRecords] = useState<
		OcrResultForMedicalRecord[]
	>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchMedicalRecords();
	}, []);

	const fetchMedicalRecords = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await ocrResultApi.getAllOcrRequests();
			setMedicalRecords(
				res.data.items.filter(
					(item: any) => item.document_ocr_data !== undefined
				)
			);
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
							<h2 className="text-2xl font-bold text-gray-900">
								Medical Records
							</h2>
						</div>

						<Card>
							<CardHeader>
								<CardTitle>Processed Medical Records</CardTitle>
								<CardDescription>
									Your processed medical records
								</CardDescription>
							</CardHeader>
							<CardContent>
								{loading ? (
									<p>Loading medical records...</p>
								) : error ? (
									<p className="text-red-600">Error: {error}</p>
								) : medicalRecords.length === 0 ? (
									<p>No medical records found.</p>
								) : (
									<div className="rounded-md border">
										<table className="min-w-full divide-y divide-gray-200">
											<thead className="bg-gray-50">
												<tr>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Consultation Date
													</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Species
													</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Weight
													</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Chief Complaint
													</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Diagnosis
													</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Actions
													</th>
												</tr>
											</thead>
											<tbody className="bg-white divide-y divide-gray-200">
												{medicalRecords.map((record, index) => (
													<tr key={index}>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
															{record.document_ocr_data?.consultation_date
																? new Date(
																		record.document_ocr_data.consultation_date
																  ).toLocaleDateString()
																: "N/A"}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
															{record.document_ocr_data?.animal_info?.species ||
																"N/A"}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
															{record.document_ocr_data?.animal_info?.weight ||
																"N/A"}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
															{record.document_ocr_data?.chief_complaint ||
																"N/A"}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
															{record.document_ocr_data?.diagnosis?.join(
																", "
															) || "N/A"}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
															<Button
																variant="ghost"
																size="sm"
																onClick={() =>
																	router.push(
																		"/medical-record-history/" +
																			record.request_id
																	)
																}>
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

export default MedicalRecordsPage;
