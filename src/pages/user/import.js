import React, { useState } from "react";
import axios from "axios";

function ImportUser() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:1122/import-user-baru",
        formData
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Gagal mengimpor data");
    }
  };

  return (
    <div>
      <h2>Import Data Siswa</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ImportUser;
