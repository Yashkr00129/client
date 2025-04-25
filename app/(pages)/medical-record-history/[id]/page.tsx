"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { baseURL } from "@/config";
import ocrResultApi from "@/api/ocrResult";
import { OcrResultForMedicalRecord } from "@/lib/types"; // Assuming your types are in lib/types.ts
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const MedicalRecordDetailPage = () => {
	const { id } = useParams<{ id: string }>();
	const [medicalRecord, setMedicalRecord] =
		useState<OcrResultForMedicalRecord | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (id) {
			fetchMedicalRecord(id);
		}
	}, [id]);

	const fetchMedicalRecord = async (recordId: string) => {
		setLoading(true);
		setError(null);
		try {
			// Assuming your API has an endpoint to fetch a single record by ID
			const res = await ocrResultApi.getOcrResultById(recordId);
			if (res.data && res.data.document_ocr_data) {
				setMedicalRecord(res.data);
			} else {
				setError("Medical record not found.");
			}
		} catch (err: any) {
			setError(err.message || "Unknown error");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="bg-gray-50 flex py-8 mx-auto px-4 container">
				<p>Loading medical record...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-gray-50 flex py-8 mx-auto px-4 container">
				<Alert variant="destructive">
					<Terminal className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			</div>
		);
	}

	if (!medicalRecord) {
		return (
			<div className="bg-gray-50 flex py-8 mx-auto px-4 container">
				<Alert>
					<Terminal className="h-4 w-4" />
					<AlertTitle>Not Found</AlertTitle>
					<AlertDescription>Medical record not found.</AlertDescription>
				</Alert>
			</div>
		);
	}

	const data = medicalRecord.document_ocr_data;

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<main className="container mx-auto px-4">
				<Card>
					<CardHeader>
						<CardTitle>Medical Record Details</CardTitle>
						<CardDescription>
							Detailed information about the record
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div>
							<h3 className="text-lg font-semibold mb-2">
								General Information
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<p>
									<strong>Consultation Date:</strong>{" "}
									{new Date(data.consultation_date).toLocaleDateString()}
								</p>
								<p>
									<strong>Chief Complaint:</strong> {data.chief_complaint}
								</p>
								<p className="md:col-span-2">
									<strong>Diagnosis:</strong> {data.diagnosis.join(", ")}
								</p>
								<p className="md:col-span-2">
									<strong>History:</strong> {data.history}
								</p>
							</div>
						</div>

						<Separator />

						<div>
							<h3 className="text-lg font-semibold mb-2">Animal Information</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<p>
									<strong>Species:</strong> {data.animal_info.species}
								</p>
								<p>
									<strong>Weight:</strong> {data.animal_info.weight}
								</p>
							</div>
						</div>

						<Separator />

						<div>
							<h3 className="text-lg font-semibold mb-2">Findings</h3>
							<h4 className="font-medium mt-2 mb-1">Physical Exam:</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
								<p>
									<strong>Abdomen:</strong>{" "}
									{data.findings?.physical_exam?.abdomen}
								</p>
								<p>
									<strong>Heart:</strong> {data.findings.physical_exam.heart}
								</p>
								<p>
									<strong>Temperature:</strong>{" "}
									{data.findings.physical_exam.temperature}
								</p>
							</div>

							<h4 className="font-medium mt-4 mb-1">Lab Results:</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
								{Object.entries(data.findings.lab_results).map(
									([key, value]) => (
										<p key={key}>
											<strong>{key}:</strong> {value}
										</p>
									)
								)}
							</div>

							<h4 className="font-medium mt-4 mb-1">Imaging:</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
								{Object.entries(data.findings.imaging).map(([key, value]) => (
									<p key={key}>
										<strong>{key}:</strong> {value}
									</p>
								))}
							</div>
						</div>

						<Separator />

						<div>
							<h3 className="text-lg font-semibold mb-2">Prescriptions</h3>
							{data.prescriptions.length === 0 ? (
								<p className="ml-4 text-gray-500">No prescriptions listed.</p>
							) : (
								<div className="space-y-4 ml-4">
									{data.prescriptions.map((prescription, index) => (
										<div
											key={index}
											className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<p>
												<strong>Name:</strong> {prescription.name}
											</p>
											<p>
												<strong>Dosage:</strong> {prescription.dosage}
											</p>
											<p>
												<strong>Frequency:</strong> {prescription.frequency}
											</p>
											<p>
												<strong>Route:</strong> {prescription.route}
											</p>
										</div>
									))}
								</div>
							)}
						</div>

						<Separator />

						<div>
							<h3 className="text-lg font-semibold mb-2">Treatment</h3>
							{data.treatment.length === 0 ? (
								<p className="ml-4 text-gray-500">No treatment listed.</p>
							) : (
								<ul className="list-disc space-y-2 ml-4">
									{data.treatment.map((item, index) => (
										<li key={index}>{item}</li>
									))}
								</ul>
							)}
						</div>

						<Separator />

						<div>
							<h3 className="text-lg font-semibold mb-2">Follow Up</h3>
							<p className="ml-4">{data.follow_up}</p>
						</div>
					</CardContent>
				</Card>
			</main>
		</div>
	);
};

export default MedicalRecordDetailPage;
