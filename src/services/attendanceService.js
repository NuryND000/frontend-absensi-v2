import api from "./Api.js";

const setAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getAllDataCount = async (token) => {
  try {
    const response = await api.get(
      "/data/all-data-counts",
      setAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all data counts:", error);
    throw error;
  }
};

export const getAttendances = async (token) => {
  try {
    const response = await api.get("/absensis", setAuthHeader(token));
    return response.data;
  } catch (error) {
    console.error("Error fetching all absensi:", error);
    throw error;
  }
};

export const getAttendanceByKelasTanggal = async (token, id, date) => {
  try {
    const response = await api.get(
      `/absensis/${id}/${date}`,
      setAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching absensi:", error);
    throw error;
  }
};

export const getAttendanceById = async (token, id) => {
  try {
    const response = await api.get(`/absensis/${id}`, setAuthHeader(token));
    return response.data;
  } catch (error) {
    console.error("Error fetching absensi:", error);
    throw error;
  }
};

export const getAttendanceByUserId = async (token, id) => {
  try {
    const response = await api.get(`/absensi/user/${id}`, setAuthHeader(token));
    return response.data;
  } catch (error) {
    console.error("Error fetching absensi:", error);
    throw error;
  }
};

export const getDetailAttendanceByUserId = async (token, id) => {
  try {
    const response = await api.get(
      `/detail-absensi/${id}/user-siswa`,
      setAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching absensi:", error);
    throw error;
  }
};

export const getDetailAttendanceByUserIdData = async (token, id) => {
  try {
    const response = await api.get(
      `/detail-absensi/${id}/user-siswa`,
      setAuthHeader(token)
    );
    return response.data.reduce((acc, item) => {
      const userId = item.user_id._id;
      if (!acc[userId]) {
        acc[userId] = {
          _id: userId,
          name: item.user_id.name, // Nama user dari object user_id
          total_hadir: 0,
          total_izin: 0,
          total_sakit: 0,
          total_alpa: 0,
        };
      }

      // Menambah jumlah sesuai status
      if (item.status === "h") acc[userId].total_hadir++;
      else if (item.status === "i") acc[userId].total_izin++;
      else if (item.status === "s") acc[userId].total_sakit++;
      else if (item.status === "a") acc[userId].total_alpa++;

      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching absensi:", error);
    throw error;
  }
};

export const createAttendance = async (token, data) => {
  try {
    const response = await api.post("/absensis", data, setAuthHeader(token));
    return response.data;
  } catch (error) {
    console.error("Error creating absensi:", error);
    throw error;
  }
};

export const getAttendanceLap = async (token, data) => {
  try {
    const response = await api.get("/absensi/laporan", {
      params: data, // Kirim data sebagai query parameters
      headers: setAuthHeader(token), // Pastikan setAuthHeader mengembalikan object headers
    });
    return response.data;
  } catch (error) {
    console.error("Error get absensi:", error);
    throw error;
  }
};

export const createManyAttendance = async (token, data) => {
  try {
    const response = await api.post(
      "/absensis/insert",
      data,
      setAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error("Error creating multiple absensi:", error);
    throw error;
  }
};

export const updateAttendanceById = async (token, id, data) => {
  try {
    const response = await api.patch(
      `/absensis/${id}`,
      data,
      setAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error("Error updating absensi:", error);
    throw error;
  }
};

export const deleteAttendanceById = async (token, id) => {
  try {
    const response = await api.delete(`/absensis/${id}`, setAuthHeader(token));
    return response.data;
  } catch (error) {
    console.error("Error deleting absensi:", error);
    throw error;
  }
};
