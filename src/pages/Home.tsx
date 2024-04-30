import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function Home() {
  const navigate = useNavigate();
  // const location = useLocation();
  useEffect(() => {
    // Check if there is user data in session storage
    const userData = sessionStorage.getItem("userData");

    if (userData) {
      // Redirect to the dashboard page if session data exists and the user is trying to access the login page
      navigate("/dashboard");
    }
  }, [navigate]);

  const routeLogin = () => {
    navigate("/login");
  };
  const routeRegister = () => {
    navigate("/register");
  };
  return (
    <div className="containerCustom">
      <div className={styles.cardHome}>
        <h2 className={styles.title}>{import.meta.env.MARMUT_KELOMPOK}</h2>
        <button className={styles.btn} onClick={routeLogin}>
          Log In
        </button>
        <button className={styles.btn} onClick={routeRegister}>
          Register
        </button>
      </div>
    </div>
  );
}
