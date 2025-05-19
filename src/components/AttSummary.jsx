import React, { useState } from "react";

const AttendanceSummary = ({ role, attendanceData }) => {
  const tabs = ["Hari Ini", "Bulan Ini", "Tahun Ajar Ini", "Semua"]; // Store the tabs in an array
  const [activeTabIndex, setActiveTabIndex] = useState(0); // Initialize active tab index

  // Function to handle tab change
  const handleTabChange = (direction) => {
    if (direction === "next") {
      setActiveTabIndex((prevIndex) => (prevIndex + 1) % tabs.length); // Move to the next tab (looping back to the start)
    } else if (direction === "prev") {
      setActiveTabIndex((prevIndex) => (prevIndex - 1 + tabs.length) % tabs.length); // Move to the previous tab (looping back to the end)
    }
  };

  return (
    <>
      {role === "siswa" && attendanceData ? (
        <>
          <div className="carousel-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '10px' }}>
  <button
    className="button is-small is-warning"
    onClick={() => handleTabChange("prev")}
  >
    &lt; Prev
  </button>

  <p className="is-size-7 has-text-weight-semibold has-text-black" style={{ margin: '0 auto' }}>
    {tabs[activeTabIndex]} {/* Display the active tab */}
  </p>

  <button
    className="button is-small is-warning"
    onClick={() => handleTabChange("next")}
  >
    Next &gt;
  </button>
</div>


          <div className="carousel-content mt-3">
            {/* Display content based on the active tab */}
            {activeTabIndex === 0 && (
              <div className="tab-content">
                <table className="table is-fullwidth is-striped">
                  <thead>
                    <tr>
                      <th>Hadir</th>
                      <th>Izin</th>
                      <th>Sakit</th>
                      <th>Alpa</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span className="tag is-success">
                          {attendanceData.total_hadir?.today || 0}
                        </span>
                      </td>
                      <td>
                        <span className="tag is-warning">
                          {attendanceData.total_izin?.today || 0}
                        </span>
                      </td>
                      <td>
                        <span className="tag is-info">
                          {attendanceData.total_sakit?.today || 0}
                        </span>
                      </td>
                      <td>
                        <span className="tag is-danger">
                          {attendanceData.total_alpa?.today || 0}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTabIndex === 1 && (
              <div className="tab-content">
                <table className="table is-fullwidth is-striped">
                  <thead>
                    <tr>
                      <th>Hadir</th>
                      <th>Izin</th>
                      <th>Sakit</th>
                      <th>Alpa</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span className="tag is-success">
                          {attendanceData.total_hadir?.month || 0}
                        </span>
                      </td>
                      <td>
                        <span className="tag is-warning">
                          {attendanceData.total_izin?.month || 0}
                        </span>
                      </td>
                      <td>
                        <span className="tag is-info">
                          {attendanceData.total_sakit?.month || 0}
                        </span>
                      </td>
                      <td>
                        <span className="tag is-danger">
                          {attendanceData.total_alpa?.month || 0}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTabIndex === 2 && (
              <div className="tab-content">
                <table className="table is-fullwidth is-striped">
                  <thead>
                    <tr>
                      <th>Hadir</th>
                      <th>Izin</th>
                      <th>Sakit</th>
                      <th>Alpa</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span className="tag is-success">
                          {attendanceData.total_hadir?.academicYear || 0}
                        </span>
                      </td>
                      <td>
                        <span className="tag is-warning">
                          {attendanceData.total_izin?.academicYear || 0}
                        </span>
                      </td>
                      <td>
                        <span className="tag is-info">
                          {attendanceData.total_sakit?.academicYear || 0}
                        </span>
                      </td>
                      <td>
                        <span className="tag is-danger">
                          {attendanceData.total_alpa?.academicYear || 0}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTabIndex === 3 && (
              <div className="tab-content">
                <table className="table is-fullwidth is-striped">
                  <thead>
                    <tr>
                      <th>Hadir</th>
                      <th>Izin</th>
                      <th>Sakit</th>
                      <th>Alpa</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span className="tag is-success">
                          {attendanceData.total_hadir?.all || 0}
                        </span>
                      </td>
                      <td>
                        <span className="tag is-warning">
                          {attendanceData.total_izin?.all || 0}
                        </span>
                      </td>
                      <td>
                        <span className="tag is-info">
                          {attendanceData.total_sakit?.all || 0}
                        </span>
                      </td>
                      <td>
                        <span className="tag is-danger">
                          {attendanceData.total_alpa?.all || 0}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <p className="text is-size-7 has-text-centered">
            Jumlah kehadiran dihitung per jam mata pelajaran
          </p>
        </>
      ) : role === "siswa" ? (
        <p className="has-text-centered has-text-grey">
          Data kehadiran tidak tersedia...
        </p>
      ) : null}
    </>
  );
};

export default AttendanceSummary;
