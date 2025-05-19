import api from "./Api.js";

const setAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const login = async (data) => {
  try {
    const response = await api.post("/login", data);
    return response.data;
  } catch (error) {
    console.error("Error login:", error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createUser = async (token, userData) => {
  try {
    const response = await api.post("/users", userData, setAuthHeader(token));
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const importUser = async (userData) => {
  try {
    const response = await api.post("/import-user-baru", userData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const importUserUpdateKelas = async (formData) => {
  try {
    const response = await api.post("/update-user-class", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response;
  } catch (error) {
    console.error("Error update user:", error);
    throw error;
  }
};


export const getUserById = async (token, userId) => {
  try {
    const response = await api.get(`/users/${userId}`, setAuthHeader(token));
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

export const updateUserById = async (token, id, data) => {
  try {
    const response = await api.patch(
      `/users/${id}`,
      data,
      setAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error("Error update User:", error);
    throw error;
  }
};

export const deleteUserById = async (token, id) => {
  try {
    const response = await api.delete(`/users/${id}`, setAuthHeader(token));
    return response.data;
  } catch (error) {
    console.error("Error delete User:", error);
    throw error;
  }
};
