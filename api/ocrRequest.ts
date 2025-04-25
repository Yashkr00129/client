import axios from "axios";

const ocrRequestApi = {
	getAllOcrRequests: async () => await axios.get("/requests"),
};

export default ocrRequestApi;
