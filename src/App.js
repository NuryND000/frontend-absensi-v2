import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserList from "./pages/user/UserList.js";
import AddUser from "./pages/user/AddUser.js";
import KelasList from "./pages/kelas/KelasList.js";
import MapelList from "./pages/mapel/MapelList.js";

import SiswaList from "./pages/siswa/SiswaList.js";
import EditSiswa from "./pages/siswa/EditSiswa.js";
import AddSiswa from "./pages/siswa/AddSiswa.js";
import SiswaExport from "./pages/siswa/SiswaExport.js";

import AbsensiList from "./pages/absensi/AbsensiList.js";
import AddAbsensi from "./pages/absensi/AddAbsensi.js";
import EditAbsensi from "./pages/absensi/EditAbsensi.js";

import TentangEdit from "./pages/tentang/TentangEdit.jsx";

import DetailAbsensiList from "./pages/absensi/DetailAbsensiListSiswa.js";
import Login from "./pages/login/Login.jsx";

import PrivateRoute from "./pages/PrivateRoute.jsx"; // Import PrivateRoute component
import Laporan from "./pages/laporan/AbsensiLaporan.js";
import Dashboard from "./pages/dashboard.jsx";
import Profile from "./pages/profile.jsx";

import GuruList from "./pages/guru/GuruList.js";
import AddGuru from "./pages/guru/AddGuru.js";
import EditGuru from "./pages/guru/EditGuru.js";
import ChangePassword from "./pages/login/ChangePassword.js";
import ProfileGuest from "./pages/guest.jsx";
import TahunList from "./pages/tahunajar/TahunList.js";
import NotFoundRedirect from "./components/NotFoundRedirect.js";

function App() {
  return (
    <div className="custom-background">
      <BrowserRouter className="has-background-grey">
        <Routes>
          {/* Routes for teachers or admins */}
          <Route path="*" element={<NotFoundRedirect />} />
          <Route
            path="/absensi"
            element={
              <PrivateRoute roles={["guru", "admin"]} element={AbsensiList} />
            }
          />
          <Route
            path="/absensi/add"
            element={
              <PrivateRoute roles={["guru", "admin"]} element={AddAbsensi} />
            }
          />
          <Route
            path="/absensi/edit/:id"
            element={
              <PrivateRoute roles={["guru", "admin"]} element={EditAbsensi} />
            }
          />

          {/* Admin-specific routes */}
          <Route
            path="/user"
            element={<PrivateRoute roles={["admin"]} element={UserList} />}
          />
          <Route
            path="/user/add"
            element={<PrivateRoute roles={["admin"]} element={AddUser} />}
          />
          <Route
            path="/kelas"
            element={<PrivateRoute roles={["admin"]} element={KelasList} />}
          />

          <Route
            path="/tahun"
            element={<PrivateRoute roles={["admin"]} element={TahunList} />}
          />
          <Route
            path="/mapel"
            element={<PrivateRoute roles={["admin"]} element={MapelList} />}
          />

          <Route
            path="/siswa"
            element={<PrivateRoute roles={["admin"]} element={SiswaList} />}
          />
          <Route
            path="/siswa/add"
            element={<PrivateRoute roles={["admin"]} element={AddSiswa} />}
          />
          <Route
            path="/siswa/edit/:id"
            element={<PrivateRoute roles={["admin"]} element={EditSiswa} />}
          />

          <Route
            path="/siswa/import-update"
            element={<PrivateRoute roles={["admin"]} element={SiswaExport} />}
          />

          <Route
            path="/guru"
            element={<PrivateRoute roles={["admin"]} element={GuruList} />}
          />
          <Route
            path="/guru/add"
            element={<PrivateRoute roles={["admin"]} element={AddGuru} />}
          />
          <Route
            path="/guru/edit/:id"
            element={<PrivateRoute roles={["admin"]} element={EditGuru} />}
          />

          <Route
            path="/tentang/edit"
            element={<PrivateRoute roles={["admin"]} element={TentangEdit} />}
          />

          <Route
            path="/laporan"
            element={
              <PrivateRoute roles={["guru", "admin"]} element={Laporan} />
            }
          />

          <Route
            path="/dashboard"
            element={<PrivateRoute roles={["admin"]} element={Dashboard} />}
          />
          <Route
            path="/home"
            element={
              <PrivateRoute
                roles={["siswa", "guru", "admin"]}
                element={Profile}
              />
            }
          />

          <Route
            path="/absensi-siswa"
            element={
              <PrivateRoute roles={["siswa"]} element={DetailAbsensiList} />
            }
          />

          {/* Routes accessible without login */}
          <Route path="/" element={<ProfileGuest />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/change-password"
            element={
              <PrivateRoute
                roles={["admin", "guru", "siswa"]}
                element={ChangePassword}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
