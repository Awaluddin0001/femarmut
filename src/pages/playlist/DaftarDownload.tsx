import styles from "../../App.module.css";
import marmutLogo from "../../../src/assets/marmut.svg";
import { useNavigate } from "react-router-dom";

export default function DaftarDownload() {
  const navigate = useNavigate();

  const routeDashboardHandler = () => {
    navigate("/dashboard");
  };
  const routeCollectionHandler = () => {
    navigate("/collection");
  };
  const logOutHandler = () => {
    sessionStorage.removeItem("userData");
    navigate("/");
  };

  return (
    <div className="containerDashboard">
      <div className={styles.user}>
        <div className={styles.userDetails}>
          <div
            className={styles.userGroup}
            onClick={routeDashboardHandler}
            style={{ cursor: "pointer" }}
          >
            <img src={marmutLogo} alt="Marmut Logo" style={{ width: "3rem" }} />
            <h3>{import.meta.env.MARMUT_KELOMPOK}</h3>
          </div>
          <div className={styles.userGroup}>
            <h4>Nama : </h4>
            <h4>Dummy </h4>
          </div>
          <div className={styles.userGroup}>
            <h4>Email : </h4>
            <h4>Dummy </h4>
          </div>
          <div className={styles.userGroup}>
            <h4>Kontak : </h4>
            <h4>Dummy </h4>
          </div>
          <div className={styles.userGroup}>
            <h4>Kota Asal : </h4>
            <h4>Dummy </h4>
          </div>
          <div className={styles.userGroup}>
            <h4>Gender : </h4>
            <h4>Dummy </h4>
          </div>
          <div className={styles.userGroup}>
            <h4>Tempat Lahir : </h4>
            <h4>Dummy </h4>
          </div>
          <div className={styles.userGroup}>
            <h4>Tanggal Lahir : </h4>
            <h4>Dummy </h4>
          </div>
          <div className={styles.userGroup}>
            <h4>Role : </h4>
            <h4>Dummy </h4>
          </div>
        </div>
        <div className={styles.userNavbar}>
          <button className={styles.btn} onClick={routeCollectionHandler}>
            Kelola Playlist
          </button>
          <button className={styles.btn} onClick={logOutHandler}>
            Log Out
          </button>
        </div>
      </div>

      <div className={styles.userPlaylist}>
        <h3 className={styles.playListTitle}>Daftar Lagu</h3>
        <h3
          style={{
            fontSize: "5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          Available Soon Daftar Download
        </h3>
      </div>
    </div>
  );
}
