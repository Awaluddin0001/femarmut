import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { CirclesWithBar } from "react-loader-spinner";
export default function Login() {
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMassage, setErrorMassage] = useState("");
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

  const loginHandler = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.MARMUT_URL}api/login/`,
        formData
      );
      sessionStorage.setItem("userData", JSON.stringify(response.data));
      setIsLoading(false);
      setIsError(false);
      navigate("/dashboard");
    } catch (err) {
      const errors = err as Error | AxiosError;
      setIsLoading(false);
      setIsError(true);
      if (axios.isAxiosError(errors) && errors.response) {
        setErrorMassage(errors.response.data);
      }
      console.error("Registration failed:", errors);
      // Handle registration failure
    }
  };
  // useEffect(() => {
  //   console.log(formData);
  // }, [formData]);

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
          <button onClick={loginHandler} className={styles.btn}>
            Log In
          </button>
          {isError && (
            <h3 style={{ fontSize: "1.6rem", color: "red" }}>{errorMassage}</h3>
          )}
        </div>
      )}
    </div>
  );
}
