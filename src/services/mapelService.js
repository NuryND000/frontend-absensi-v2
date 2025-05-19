import api from "./Api.js";

const setAuthHeader = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

export const getMapel = async () => {
    try {
        const response = await api.get("/mapels");
        return response.data;
    } catch (error) {
        console.error("Error fetching Mapel:", error);
        throw error;
    }
};

export const getMapelById = async (token, id) => {
    try {
        const response = await api.get(`/mapels/${id}`, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error fetching Mapel:", error);
        throw error;
    }
};


export const createMapel = async (token, data) => {
    try {
        const response = await api.post("/mapels", data, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error creating Mapel:", error);
        throw error;
    }
};

export const createManyMapel = async (token, data) => {
    try {
        const response = await api.post("/import-mapel", data, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error creating Mapel:", error);
        throw error;
    }
};

export const updateMapelById = async (token, id, data) => {
    try {
        const response = await api.patch(`/mapels/${id}`, data, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error update Mapel:", error);
        throw error;
    }
};

export const deleteMapelById = async (token, id) => {
    try {
        const response = await api.delete(`/mapels/${id}`, setAuthHeader(token));
        return response.data;
    } catch (error) {
        console.error("Error delete Mapel:", error);
        throw error;
    }
};
