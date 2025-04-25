export type OcrResultForReceipt = {
	request_id: string;
	created_at: string;
	receipt_data: Transaction;
};

export type OcrResultForMedicalRecord = {
	request_id: string;
	created_at: string;
	document_ocr_data: DocumentOcrData;
};

// Abstract types.

type Transaction = {
	transaction_id: string;
	created_at: string;
	total_amount: string;
	purchased_items: Array<{ name: string; price?: string }>;
	transaction_date: string;
	status: string;
};

type AnimalInfo = {
	species: string;
	weight: string;
};

type LabResults = {
	BUN: string;
	CA: string;
	CRE: string;
	GPT: string;
	USG: string;
	WBC: string;
};

type PhysicalExam = {
	abdomen: string;
	heart: string;
	temperature: string;
};

type Imaging = {
	"ECG": string;
	"Echo": string;
	"X-ray": string;
};

type Findings = {
	imaging: Imaging;
	lab_results: LabResults;
	physical_exam: PhysicalExam;
};

type Prescription = {
	dosage: string;
	frequency: string;
	name: string;
	route: string;
};

type DocumentOcrData = {
	animal_info: AnimalInfo;
	chief_complaint: string;
	consultation_date: string;
	diagnosis: string[];
	findings: Findings;
	follow_up: string;
	history: string;
	prescriptions: Prescription[];
	treatment: string[];
};
