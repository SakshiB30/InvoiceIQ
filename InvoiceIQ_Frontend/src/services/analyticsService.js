import api from "../api/axiosClient";

const analyticsService = {
  getAnalytics: async (fromDate = null, toDate = null) => {
    const params = {};

    if (fromDate) {
      params.fromDate = fromDate;
    }

    if (toDate) {
      params.toDate = toDate;
    }

    const response = await api.get("/api/analytics", {
      params,
    });

    return response.data;
  },
};

export default analyticsService;