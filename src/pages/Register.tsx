import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function Register() {
  const navigate = useNavigate();
  useEffect(() => {
    // Check if the current location is the login page

    // Check if there is user data in session storage
    const userData = sessionStorage.getItem("userData");

    if (userData) {
      // Redirect to the dashboard page if session data exists and the user is trying to access the login page
      navigate("/dashboard");
    }
  }, [navigate]);

  const routePengguna = () => {
    navigate("/userRegister");
  };
  const routeLabel = () => {
    navigate("/labelRegister");
  };
  return (
    <div className="containerCustom">
      <div className={styles.cardHome}>
        <h2 className={styles.title}>Register</h2>
        <button className={styles.btn} onClick={routePengguna}>
          Pengguna
        </button>
        <button className={styles.btn} onClick={routeLabel}>
          Label
        </button>
      </div>
    </div>
  );
}
