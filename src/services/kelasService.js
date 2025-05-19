import api from "./Api.js";

const setAuthHeader = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

export const getKelas = async (token) => {
    try {
        const response = await api.get("/kelass", setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error fetching Kelas:", error);
        throw error;
    }
};

export const getKelasById = async (token, id) => {
    try {
        const response = await api.get(`/kelass/${id}`, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error fetching Kelas:", error);
        throw error;
    }
};

export const createKelas = async (token, data) => {
    try {
        const response = await api.post("/kelass", data, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error creating Kelas:", error);
        throw error;
    }
};

export const createManyKelas = async (token, data) => {
    try {
        const response = await api.post("/import-kelas", data, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error creating multiple Kelas:", error);
        throw error;
    }
};

export const updateKelasById = async (token, id, data) => {
    try {
        const response = await api.patch(`/kelass/${id}`, data, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error updating Kelas:", error);
        throw error;
    }
};

export const deleteKelasById = async (token, id) => {
    try {
        const response = await api.delete(`/kelass/${id}`, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error deleting Kelas:", error);
        throw error;
    }
};
