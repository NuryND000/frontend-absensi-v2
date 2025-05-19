import api from "./Api.js";

const setAuthHeader = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

export const getDetailMany = async (token) => {
    try {
        const response = await api.get("/detail/many", setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error fetching multiple absensi:", error);
        throw error;
    }
};

export const getDetailAttendances = async (token) => {
    try {
        const response = await api.get("/detailabsensis", setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error fetching all absensi:", error);
        throw error;
    }
};

export const getDetailAttendanceById = async (token, id) => {
    try {
        const response = await api.get(`/detailabsensis/${id}`, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error fetching absensi by ID:", error);
        throw error;
    }
};

export const getDetailAttendanceByAbsensiId = async (token, id) => {
    try {
        const response = await api.get(`/detailabsensis/absensi/${id}`, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error fetching absensi by ID:", error);
        throw error;
    }
};

export const createDetailAttendance = async (token, data) => {
    try {
        const response = await api.post("/detailabsensis", data, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error creating absensi:", error);
        throw error;
    }
};

export const createManyDetailAttendance = async (token, data) => {
    try {
        const response = await api.post("/detailabsensis/many", data, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error creating multiple absensi:", error);
        throw error;
    }
};

export const updateAttendanceById = async (token, id, data) => {
    try {
        const response = await api.patch(`/detailabsensis/${id}`, data, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error updating absensi by ID:", error);
        throw error;
    }
};

export const updateManyAttendance = async (token, data) => {
    try {
        const response = await api.patch("/detailabsensis/update", data, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error updating multiple absensi:", error);
        throw error;
    }
};

export const deleteDetailAttendanceById = async (token, id) => {
    try {
        const response = await api.delete(`/detailabsensis/${id}`, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error deleting absensi by ID:", error);
        throw error;
    }
};

export const deleteManyDetailAttendance = async (token, id) => {
    try {
        const response = await api.delete(`/detailabsensis/many/${id}`, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error deleting multiple absensi:", error);
        throw error;
    }
};
