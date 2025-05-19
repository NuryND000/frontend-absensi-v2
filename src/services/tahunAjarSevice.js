import api from "./Api.js";

const setAuthHeader = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

export const getTahun = async (token) => {
    try {
        const response = await api.get("/tahun", setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error fetching Tahun Ajar:", error);
        throw error;
    }
};

export const getTahunByTanggal = async (token, date) => {
    try {
        const response = await api.get(`/tahun/date/${date}`, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error fetching Tahun Ajar:", error);
        throw error;
    }
};

export const getTahunById = async (token, id) => {
    try {
        const response = await api.get(`/tahun/${id}`, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error fetching Tahun Ajar:", error);
        throw error;
    }
};

export const createTahun = async (token, data) => {
    try {
        const response = await api.post("/tahun", data, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error creating Tahun Ajar:", error);
        throw error;
    }
};

export const createManyTahun = async (token, data) => {
    try {
        const response = await api.post("/import-tahun", data, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error creating multiple Tahun Ajar:", error);
        throw error;
    }
};

export const updateTahunById = async (token, id, data) => {
    try {
        const response = await api.patch(`/tahun/${id}`, data, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error updating Tahun Ajar:", error);
        throw error;
    }
};

export const deleteTahunById = async (token, id) => {
    try {
        const response = await api.delete(`/tahun/${id}`, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error deleting Tahun Ajar:", error);
        throw error;
    }
};
