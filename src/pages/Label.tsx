import styles from "./User.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { CirclesWithBar } from "react-loader-spinner";
export default function Label() {
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    nama: string;
    kontak: string;
  }>({
    email: "",
    password: "",
    nama: "",
    kontak: "",
  });
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
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMassage, setErrorMassage] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.post(
        `${import.meta.env.MARMUT_URL}api/registerlabel/`,
        formData
      );
      setIsLoading(false);
      setIsError(false);
      navigate("/login");
    } catch (err) {
      const errors = err as Error | AxiosError;
      setIsLoading(false);
      setIsError(true);
      if (axios.isAxiosError(errors) && errors.response) {
        setErrorMassage(errors.message);
      }
      console.error("Registration failed:", errors);
      // Handle registration failure
    }
  };
  return (
    <div className="containerCustom">
      {isLoading ? (
        <CirclesWithBar
          height="100"
          width="100"
          color="#4fa94d"
          outerCircleColor="#4fa94d"
          innerCircleColor="#4fa94d"
          barColor="#4fa94d"
          ariaLabel="circles-with-bar-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      ) : (
        <div className={styles.cardLogin}>
          <h2 className={styles.title}>Register Label</h2>
          <div className={styles.inputGroup}>
            <h3 className={styles.inputTitle}>Email</h3>
            <input
              type="text"
              className={styles.inp}
              placeholder="Email"
              onChange={(val) => {
                setFormData({ ...formData, email: val.target.value });
              }}
            />
          </div>
          <div className={styles.inputGroup}>
            <h3 className={styles.inputTitle}>Password</h3>
            <input
              type="password"
              className={styles.inp}
              placeholder="Password"
              onChange={(val) => {
                setFormData({ ...formData, password: val.target.value });
              }}
            />
          </div>
          <div className={styles.inputGroup}>
            <h3 className={styles.inputTitle}>Nama</h3>
            <input
              type="text"
              className={styles.inp}
              placeholder="Nama"
              onChange={(val) => {
                setFormData({ ...formData, nama: val.target.value });
              }}
            />
          </div>
          <div className={styles.inputGroup}>
            <h3 className={styles.inputTitle}>Kontak</h3>
            <input
              type="text"
              className={styles.inp}
              placeholder="Kontak"
              onChange={(val) => {
                setFormData({ ...formData, kontak: val.target.value });
              }}
            />
          </div>

          <button onClick={handleRegister} className={styles.btn}>
            Register
          </button>
          {isError && (
            <h3 style={{ fontSize: "1.6rem", color: "red" }}>{errorMassage}</h3>
          )}
        </div>
      )}
    </div>
  );
}
