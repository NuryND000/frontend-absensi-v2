import api from "./Api.js";

const setAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getGuru = async (token) => {
  try {
    const response = await api.get("/users", setAuthHeader(token));
    const guruList = response.data.filter((user) => user.role === "guru"); // Filter hanya yang memiliki role "siswa"
    return guruList;
  } catch (error) {
    console.error("Error fetching guru:", error);
    throw error;
  }
};

export const getGuruById = async (token, id) => {
  try {
    const response = await api.get(`/users/${id}`, setAuthHeader(token));
    return response.data;
  } catch (error) {
    console.error("Error fetching guru:", error);
    throw error;
  }
};

export const getGuruByUserId = async (token, id) => {
  try {
    const response = await api.get(`/guru/user/${id}`, setAuthHeader(token));
    return response.data;
  } catch (error) {
    console.error("Error fetching guru:", error);
    throw error;
  }
};

export const createGuru = async (token, data) => {
  try {
    const response = await api.post("/users", data, setAuthHeader(token));
    return response.data;
  } catch (error) {
    console.error("Error creating guru:", error);
    throw error;
  }
};

export const createManyGuru = async (token, data) => {
  try {
    const response = await api.post("/import-guru", data, setAuthHeader(token));
    return response.data;
  } catch (error) {
    console.error("Error creating multiple guru:", error);
    throw error;
  }
};

export const updateGuruById = async (token, id, data) => {
  try {
    const response = await api.patch(
      `/users/${id}`,
      data,
      setAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error("Error updating guru:", error);
    throw error;
  }
};

export const deleteGuruById = async (token, id) => {
  try {
    const response = await api.delete(`/users/${id}`, setAuthHeader(token));
    return response.data;
  } catch (error) {
    console.error("Error deleting guru:", error);
    throw error;
  }
};
