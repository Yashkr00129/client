import axios from "axios";

const ocrResultApi = {
	getAllOcrRequests: async () => await axios.get("/ocr-result"),
	getOcrResultById: async (id: string) => await axios.get(`/ocr-result/${id}`),
};

export default ocrResultApi;
