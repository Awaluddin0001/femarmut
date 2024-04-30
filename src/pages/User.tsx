import styles from "./User.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { CirclesWithBar } from "react-loader-spinner";
export default function User() {
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    nama: string;
    gender: number;
    tempat_lahir: string;
    tanggal_lahir: string;
    is_verified: boolean;
    kota_asal: string;
    role: string[];
  }>({
    email: "",
    password: "",
    nama: "",
    gender: 1,
    tempat_lahir: "",
    tanggal_lahir: "",
    is_verified: false,
    kota_asal: "",
    role: [],
  });

  const addRole = (val: string) => {
    setFormData({ ...formData, role: [...formData.role, val] });
  };
  const delRole = (val: string) => {
    setFormData({ ...formData, role: formData.role.filter((e) => e != val) });
  };
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMassage, setErrorMassage] = useState("");

  useEffect(() => {
    if (formData.role.length > 0) {
      setFormData((data) => {
        return { ...data, is_verified: true };
      });
    } else {
      setFormData((data) => {
        return { ...data, is_verified: false };
      });
    }
  }, [formData.role]);

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

  const handleRegister = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.post(`${import.meta.env.MARMUT_URL}api/register/`, formData);
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
          <h2 className={styles.title}>Register Pengguna</h2>
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
            <h3 className={styles.inputTitle}>Gender</h3>
            <select
              className={styles.inp}
              onChange={(val) => {
                setFormData({ ...formData, gender: Number(val.target.value) });
              }}
            >
              <option value="1" className={styles.inp}>
                Laki-Laki
              </option>
              <option value="0" className={styles.inp}>
                Perempuan
              </option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <h3 className={styles.inputTitle}>Tempat Lahir</h3>
            <input
              type="text"
              className={styles.inp}
              placeholder="Tempat Lahir"
              onChange={(val) => {
                setFormData({ ...formData, tempat_lahir: val.target.value });
              }}
            />
          </div>
          <div className={styles.inputGroup}>
            <h3 className={styles.inputTitle}>Tanggal Lahir</h3>
            <input
              type="date"
              className={styles.inp}
              placeholder="Tanggal Lahir"
              onChange={(val) => {
                setFormData({ ...formData, tanggal_lahir: val.target.value });
              }}
            />
          </div>
          <div className={styles.inputGroup}>
            <h3 className={styles.inputTitle}>Kota Asal</h3>
            <input
              type="text"
              className={styles.inp}
              placeholder="Kota Asal"
              onChange={(val) => {
                setFormData({ ...formData, kota_asal: val.target.value });
              }}
            />
          </div>
          <div className={styles.inputGroup}>
            <h3 className={styles.inputTitle}>Role</h3>
            <div className={styles.checkBoxGroup}>
              <label className={styles.inputTitle}>
                <input
                  type="checkbox"
                  value="podcaster"
                  onChange={(val) => {
                    if (val.target.checked) {
                      addRole(val.target.value);
                    } else {
                      delRole(val.target.value);
                    }
                  }}
                />
                Podcaster
              </label>
              <label className={styles.inputTitle}>
                <input
                  type="checkbox"
                  value="artist"
                  onChange={(val) => {
                    if (val.target.checked) {
                      addRole(val.target.value);
                    } else {
                      delRole(val.target.value);
                    }
                  }}
                />
                Artist
              </label>
              <label className={styles.inputTitle}>
                <input
                  type="checkbox"
                  value="songwriter"
                  onChange={(val) => {
                    if (val.target.checked) {
                      addRole(val.target.value);
                    } else {
                      delRole(val.target.value);
                    }
                  }}
                />
                Songwriter
              </label>
            </div>
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
