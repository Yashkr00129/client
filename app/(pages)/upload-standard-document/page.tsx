"use client";
import React, { useState, ChangeEvent } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Search,
	Upload,
	FileUp,
	Check,
	AlertCircle,
	Loader2,
	ReceiptText,
	History,
	Settings,
	Plus,
	FileText,
	BarChart3,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { baseURL } from "@/config";

// Define TypeScript interfaces for our data structures
interface UploadResponse {
	request_id: string;
	status: string;
	s3_file_path: string;
	message: string;
}

interface StatusResponse {
	request_id: string;
	status: "pending" | "processing" | "completed" | "failed";
	message: string;
}

type FileStatus =
	| "idle"
	| "selected"
	| "uploading"
	| "processing"
	| "completed"
	| "error";

// Receipt Uploader Component
const ReceiptUploader: React.FC = () => {
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [uploadProgress, setUploadProgress] = useState<number>(0);
	const [requestId, setRequestId] = useState<string | null>(null);
	const [status, setStatus] = useState<StatusResponse["status"] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [fileStatus, setFileStatus] = useState<FileStatus>("idle");

	// Handle file selection
	const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
		const selectedFile = e.target.files?.[0] || null;
		setError(null);

		if (!selectedFile) return;

		// Validate file type
		const validTypes: string[] = [
			"image/jpeg",
			"image/png",
			"image/gif",
			"application/pdf",
		];
		if (!validTypes.includes(selectedFile.type)) {
			setError("Please select a valid image or PDF file");
			return;
		}

		// Validate file size (max 5MB)
		if (selectedFile.size > 5 * 1024 * 1024) {
			setError("File size must be less than 5MB");
			return;
		}

		setFile(selectedFile);
		setFileStatus("selected");

		// Create preview for images
		if (selectedFile.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onload = () => {
				setPreview(reader.result as string);
			};
			reader.readAsDataURL(selectedFile);
		} else {
			// For PDFs, just show an icon
			setPreview(null);
		}
	};

	// Handle file upload
	const handleUpload = async (): Promise<void> => {
		if (!file) return;

		setUploading(true);
		setUploadProgress(0);
		setFileStatus("uploading");

		try {
			// Create form data for upload
			const formData = new FormData();
			formData.append("file", file);

			// Simulate upload progress
			const progressInterval = setInterval(() => {
				setUploadProgress((prev) => {
					if (prev >= 95) {
						clearInterval(progressInterval);
						return 95;
					}
					return prev + 5;
				});
			}, 200);

			// Upload to FastAPI backend
			const response = await fetch(baseURL + "/upload-document/", {
				method: "POST",
				body: formData,
			});

			clearInterval(progressInterval);
			setUploadProgress(100);

			if (!response.ok) {
				throw new Error(`Upload failed: ${response.statusText}`);
			}

			const data: UploadResponse = await response.json();
			setRequestId(data.request_id);
			setStatus(data.status as StatusResponse["status"]);
			setFileStatus("processing");

			// Begin polling for status if request was successful
			if (data.request_id) {
				pollForStatus(data.request_id);
			}
		} catch (err) {
			setError((err as Error).message || "Upload failed. Please try again.");
			setFileStatus("error");
		} finally {
			setTimeout(() => {
				setUploading(false);
			}, 500); // Give time for progress animation to complete
		}
	};

	// Poll for receipt processing status
	const pollForStatus = async (id: string): Promise<void> => {
		try {
			const response = await fetch(`${baseURL}/request-status/${id}`);

			if (!response.ok) {
				throw new Error(`Status check failed: ${response.statusText}`);
			}

			const data: StatusResponse = await response.json();
			setStatus(data.status);

			// Update file status based on response
			if (data.status === "completed") {
				setFileStatus("completed");
			} else if (data.status === "failed") {
				setFileStatus("error");
				setError("Processing failed. Please try again.");
			}

			// Continue polling if processing is not complete
			if (data.status === "pending" || data.status === "processing") {
				setTimeout(() => pollForStatus(id), 3000);
			}
		} catch (err) {
			setError("Error checking status. Please try again later.");
			setFileStatus("error");
		}
	};

	// Reset the component
	const handleReset = (): void => {
		setFile(null);
		setPreview(null);
		setUploading(false);
		setUploadProgress(0);
		setRequestId(null);
		setStatus(null);
		setError(null);
		setFileStatus("idle");
	};

	return (
		<Card className="w-full  mx-auto">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Upload className="h-5 w-5" />
					Document Upload
				</CardTitle>
				<CardDescription>
					Upload a document image to extract transaction data
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4">
				{error && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{/* Upload area */}
				{fileStatus === "idle" && (
					<div
						className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-gray-50 transition-colors"
						onClick={() => document.getElementById("file-upload")?.click()}>
						<FileUp className="h-10 w-10 mx-auto mb-4 text-gray-400" />
						<p className="text-sm text-gray-500">
							Click to upload or drag and drop
							<br />
							JPG, PNG or PDF (max 5MB)
						</p>
						<input
							id="file-upload"
							type="file"
							className="hidden"
							onChange={handleFileChange}
							accept="image/jpeg,image/png,image/gif,application/pdf"
						/>
					</div>
				)}

				{/* Selected file preview */}
				{(fileStatus === "selected" || fileStatus === "uploading") && file && (
					<div className="space-y-4">
						{preview ? (
							<img
								src={preview}
								alt="Document preview"
								className="max-h-64 mx-auto rounded-md object-contain"
							/>
						) : (
							<div className="h-32 bg-gray-100 rounded-md flex items-center justify-center">
								<p className="text-gray-500">
									{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
								</p>
							</div>
						)}

						{fileStatus === "uploading" && (
							<div className="space-y-2">
								<Progress
									value={uploadProgress}
									className="h-2 w-full"
								/>
								<p className="text-xs text-gray-500 text-center">
									Uploading... {uploadProgress}%
								</p>
							</div>
						)}
					</div>
				)}

				{/* Processing status */}
				{(fileStatus === "processing" || fileStatus === "completed") &&
					requestId && (
						<div className="space-y-4">
							<Alert
								variant={
									fileStatus === "completed" ? "default" : "destructive"
								}>
								{fileStatus === "completed" ? (
									<Check className="h-4 w-4" />
								) : (
									<Loader2 className="h-4 w-4 animate-spin" />
								)}
								<AlertTitle>
									{fileStatus === "completed"
										? "Processing Complete"
										: "Processing Document"}
								</AlertTitle>
								<AlertDescription>
									{fileStatus === "completed"
										? "Your document has been processed successfully."
										: "Your document is being analyzed. This may take a moment."}
								</AlertDescription>
							</Alert>

							<p className="text-xs text-gray-500">Request ID: {requestId}</p>
						</div>
					)}
			</CardContent>

			<CardFooter className="flex justify-between">
				<Button
					variant="outline"
					onClick={handleReset}>
					{fileStatus === "processing" || fileStatus === "completed"
						? "Upload Another"
						: "Cancel"}
				</Button>

				{fileStatus === "selected" && (
					<Button
						onClick={handleUpload}
						disabled={uploading}>
						{uploading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Uploading
							</>
						) : (
							"Upload document"
						)}
					</Button>
				)}
			</CardFooter>
		</Card>
	);
};

// Main Page Component
const ReceiptManagementPage = () => {
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Main Content */}
			<main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Sidebar */}
					{/* Main Content Area */}
					<div className="lg:col-span-4 space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="text-2xl font-bold text-gray-900">
								Upload Receipt
							</h2>
							<Button size="sm">
								<Plus className="h-4 w-4 mr-2" />
								New Upload
							</Button>
						</div>

						<ReceiptUploader />
					</div>
				</div>
			</main>
		</div>
	);
};

export default ReceiptManagementPage;
