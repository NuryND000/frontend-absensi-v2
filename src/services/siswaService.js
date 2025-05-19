import api from "./Api.js";

const setAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getSiswa = async (token) => {
  try {
    const response = await api.get("/users", setAuthHeader(token));
    const siswaList = response.data.filter((user) => user.role === "siswa"); // Filter hanya yang memiliki role "siswa"
    return siswaList;
  } catch (error) {
    console.error("Error fetching Siswa:", error);
    throw error;
  }
};

export const getSiswaById = async (token, id) => {
  try {
    const response = await api.get(`/siswas/${id}`, setAuthHeader(token));
    return response.data;
  } catch (error) {
    console.error("Error fetching Siswa:", error);
    throw error;
  }
};

export const getSiswaByUserId = async (token, id) => {
  try {
    const response = await api.get(`/siswas/user/${id}`, setAuthHeader(token));
    return response.data;
  } catch (error) {
    console.error("Error fetching siswa:", error);
    throw error;
  }
};

export const getSiswaByKelasId = async (token, id) => {
  try {
    const response = await api.get("/users", setAuthHeader(token));
    const siswaKelas = response.data.filter(
      (user) => user.role === "siswa" && user.class_id?._id === id
    );
    console.log(response.data.filter((user) => user.role === "siswa"));
    return siswaKelas;
  } catch (error) {
    console.error("Error fetching siswa:", error);
    throw error;
  }
};

export const createSiswa = async (token, data) => {
  try {
    const response = await api.post("/users", data, setAuthHeader(token));
    return response.data;
  } catch (error) {
    console.error("Error creating Siswa:", error);
    throw error;
  }
};

export const createManySiswa = async (token, data) => {
  try {
    const response = await api.post(
      "/import-siswa",
      data,
      setAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error("Error creating Siswa:", error);
    throw error;
  }
};

export const updateSiswaById = async (token, id, data) => {
  try {
    const response = await api.patch(
      `/users/${id}`,
      data,
      setAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error("Error update Siswa:", error);
    throw error;
  }
};

export const deleteSiswaById = async (token, id) => {
  try {
    const response = await api.delete(`/users/${id}`, setAuthHeader(token));
    return response.data;
  } catch (error) {
    console.error("Error delete Siswa:", error);
    throw error;
  }
};
