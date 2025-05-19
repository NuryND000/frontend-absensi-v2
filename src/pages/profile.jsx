import React, { useState, useEffect } from "react";
import "react-confirm-alert/src/react-confirm-alert.css";
import AuthLayouts from "../layouts/AuthLayouts.jsx";
import logo from "./../image/logo.png";
import useAuth from "../services/authService.js";
import { getDetailAttendanceByUserId } from "../services/attendanceService.js";
import { getTahunByTanggal } from "../services/tahunAjarSevice.js";
import AttendanceSummary from "../components/AttSummary.jsx";

const Profile = () => {
  const { dataUser, role, token, refreshToken, userId } = useAuth();
  const [attendanceData, setAttendanceData] = useState(null); // Ubah jadi `null` biar bisa cek loading
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    
    // Return the formatted date as YYYY-MM-DD
    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    if (role === "siswa") {
      const fetchData = async () => {
        try {
          const response = await getDetailAttendanceByUserId(token, userId);

          const today = new Date();
          const currentMonth = today.getMonth();
          const currentYear = today.getFullYear();
          const todayString = today.toISOString().split('T')[0];
          const datenow = getTodayDate();
      
          const currentAcademicYear = await getTahunByTanggal(token, datenow);
          const startDate = new Date(currentAcademicYear.startDate);
          const endDate = new Date(currentAcademicYear.endDate);
      
          const groupedData = response.reduce(
            (acc, item) => {
              // Check if item status exists
              if (!item.status || !item.absensi_id || !item.absensi_id.tanggal) return acc;
      
              const absensiDate = new Date(item.absensi_id.tanggal);
              const isSameDay = todayString === absensiDate.toISOString().split('T')[0]; // Check if same day
              const isSameMonth = absensiDate.getMonth() === currentMonth && absensiDate.getFullYear() === currentYear;
              const isSameAcademicYear = absensiDate >= startDate && absensiDate <= endDate;
      
              // Initialize grouped counts if they are not initialized yet
              acc.total_hadir = acc.total_hadir || { today: 0, month: 0, academicYear: 0, all: 0 };
              acc.total_izin = acc.total_izin || { today: 0, month: 0, academicYear: 0, all: 0 };
              acc.total_sakit = acc.total_sakit || { today: 0, month: 0, academicYear: 0, all: 0 };
              acc.total_alpa = acc.total_alpa || { today: 0, month: 0, academicYear: 0, all: 0 };
      
              // Increment counts based on status and date
              if (item.status === 'h') {
                acc.total_hadir.all++;
                if (isSameDay) acc.total_hadir.today++;
                if (isSameMonth) acc.total_hadir.month++;
                if (isSameAcademicYear) acc.total_hadir.academicYear++;
              }
              if (item.status === 'i') {
                acc.total_izin.all++;
                if (isSameDay) acc.total_izin.today++;
                if (isSameMonth) acc.total_izin.month++;
                if (isSameAcademicYear) acc.total_izin.academicYear++;
              }
              if (item.status === 's') {
                acc.total_sakit.all++;
                if (isSameDay) acc.total_sakit.today++;
                if (isSameMonth) acc.total_sakit.month++;
                if (isSameAcademicYear) acc.total_sakit.academicYear++;
              }
              if (item.status === 'a') {
                acc.total_alpa.all++;
                if (isSameDay) acc.total_alpa.today++;
                if (isSameMonth) acc.total_alpa.month++;
                if (isSameAcademicYear) acc.total_alpa.academicYear++;
              }
      
              return acc;
            },
            {} // Initial value
          );
      
          // Set the state with the grouped data
          setAttendanceData(groupedData);
      
        } catch (error) {
          console.error("Error fetching attendance data:", error);
        }
      };

      refreshToken().then(fetchData);
    }
  }, [token, role, userId, refreshToken]);

  return (
    <AuthLayouts name="Profile">
      <section className="hero is-fullwidth">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-5-tablet is-4-desktop">
                {/* Header */}
                <div className="has-text-centered mb-5">
                  <p className="has-text-weight-bold is-size-4 has-text-white">
                    UPT SMP NEGERI 3 SRENGAT
                  </p>
                  <figure className="image is-128x128 is-inline-block mt-3">
                    <img src={logo} alt="Logo Sekolah" />
                  </figure>
                </div>

                {/* Tabel Profil */}
                <div className="box">
                  {dataUser ? (
                    <table className="table is-fullwidth is-striped is-hoverable">
                      <tbody>
                        {role === "siswa" ? (
                          <>
                            <tr>
                              <th>NISN</th>
                              <td>: {dataUser?.username}</td>
                            </tr>
                            <tr>
                              <th>Nama</th>
                              <td>: {dataUser?.name}</td>
                            </tr>
                            <tr>
                              <th>Kelas</th>
                              <td>: {dataUser?.class_id?.name}</td>
                            </tr>
                          </>
                        ) : role === "guru" ? (
                          <>
                            <tr>
                              <th>NIP</th>
                              <td>: {dataUser?.username}</td>
                            </tr>
                            <tr>
                              <th>Nama</th>
                              <td>: {dataUser?.name}</td>
                            </tr>
                          </>
                        ) : (
                          <tr>
                            <th>Nama</th>
                            <td>: {dataUser?.name}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <p className="has-text-centered has-text-grey">
                      Data tidak tersedia...
                    </p>
                  )}

                  {/* Tabel Kehadiran */}
                  <AttendanceSummary role={role} attendanceData={attendanceData}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AuthLayouts>
  );
};

export default Profile;
