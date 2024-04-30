import styles from "../App.module.css";
import marmutLogo from "../../src/assets/marmut.svg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import axios, { AxiosError } from "axios";
import { CirclesWithBar } from "react-loader-spinner";

export default function Collection() {
  const myTime = new Date();
  const formattedDate = myTime.toISOString().split("T")[0]; // Extract YYYY-MM-DD
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMassage, setErrorMassage] = useState("");
  const [songTable, setSongTable] = useState<
    {
      deskripsi: string;
      email_pembuat: string;
      id_playlist: string;
      id_user_playlist: string;
      judul: string;
      jumlah_lagu: number;
      tanggal_dibuat: string;
      total_durasi: number;
    }[]
  >([]);
  const [isLabel, setIsLabel] = useState(false);
  const [penggunaData, setPenggunaData] = useState<{
    email: string;
    nama: string;
    gender?: number;
    kontak?: string;
    kotaAsal?: string;
    role: string[] | [];
    tanggalLahir?: string;
    tempatLahir?: string;
  }>();

  const [formData, setFormData] = useState<{
    email_pembuat: string;
    judul: string;
    deskripsi: string;
    jumlah_lagu: number;
    tanggal_dibuat: string;
  }>({
    email_pembuat: "",
    judul: "",
    deskripsi: "",
    jumlah_lagu: 1,
    tanggal_dibuat: `${formattedDate}`,
  });

  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const [id_user_playlist, setid_user_playlist] = useState("");

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

  const submitHandler = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.post(
        `${import.meta.env.MARMUT_URL}api/userPlaylist/`,
        formData
      );
      setIsLoading(false);
      setIsError(false);
      setIsCreate(false);
    } catch (err) {
      const errors = err as Error | AxiosError;
      setIsLoading(false);
      setIsError(true);
      setIsCreate(false);
      if (axios.isAxiosError(errors) && errors.response) {
        setErrorMassage(errors.message);
      }
      console.error("Registration failed:", errors);
      // Handle registration failure
    }
  };

  const getTable = async () => {
    if (penggunaData?.email) {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.MARMUT_URL}api/getUserPlaylist/`,
          {
            params: {
              email_pembuat: penggunaData?.email,
            },
          }
        );
        setSongTable(response.data);
        setIsLoading(false);
        setIsError(false);
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
    }
  };

  const updatePlaylist = async (
    id: string,
    updatedData: {
      email_pembuat: string;
      judul: string;
      deskripsi: string;
      jumlah_lagu: number;
      tanggal_dibuat: string;
    }
  ) => {
    try {
      await axios.put(
        `${import.meta.env.MARMUT_URL}api/updateUserPlaylist/${id}/`,
        updatedData
      );
      setIsEdit(false);
    } catch (error) {
      console.error("Error updating playlist:", error);
      setIsEdit(false);
      throw error;
    }
  };

  const deletePlaylist = async (id: string) => {
    try {
      await axios.delete(
        `${import.meta.env.MARMUT_URL}api/deleteUserPlaylist/${id}/`
      );
      setIsDelete(false);
    } catch (error) {
      console.error("Error deleting playlist:", error);
      setIsDelete(false);
      throw error;
    }
  };

  useEffect(() => {
    const userData = sessionStorage.getItem("userData");
    if (!userData) {
      navigate("/");
    }

    const getUserDataFromSession = () => {
      // Retrieve the user data JSON string from session storage
      const userDataString = sessionStorage.getItem("userData");
      if (userDataString != null) {
        const userData = JSON.parse(userDataString);
        setFormData((fd) => {
          return { ...fd, email_pembuat: userData.email };
        });
        setPenggunaData(userData);
        userData.role.map((e: string) => {
          if (e === "label" || e === "Label") {
            setIsLabel(true);
          }
        });
      }
    };
    getUserDataFromSession();
  }, []);

  useEffect(() => {
    getTable();
  }, [isCreate, isDelete, isEdit, formData.email_pembuat]);

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
            <h4>{penggunaData?.nama || "tidak ada"} </h4>
          </div>
          <div className={styles.userGroup}>
            <h4>Email : </h4>
            <h4>{penggunaData?.email || "tidak ada"} </h4>
          </div>
          {isLabel && (
            <div className={styles.userGroup}>
              <h4>Kontak : </h4>
              <h4>{penggunaData?.kontak} </h4>
            </div>
          )}
          {!isLabel && (
            <>
              <div className={styles.userGroup}>
                <h4>Kota Asal : </h4>
                <h4>{penggunaData?.kotaAsal || "tidak ada"} </h4>
              </div>
              <div className={styles.userGroup}>
                <h4>Gender : </h4>
                <h4>
                  {penggunaData?.gender === 0 ? "Perempuan" : "Laki-laki"}{" "}
                </h4>
              </div>
              <div className={styles.userGroup}>
                <h4>Tempat Lahir : </h4>
                <h4>{penggunaData?.tempatLahir || "tidak ada"} </h4>
              </div>
              <div className={styles.userGroup}>
                <h4>Tanggal Lahir : </h4>
                <h4>{penggunaData?.tanggalLahir || "tidak ada"} </h4>
              </div>
              <div className={styles.userGroup}>
                <h4>Role : </h4>
                <h4>
                  {penggunaData && penggunaData?.role.length > 0
                    ? penggunaData?.role.join(", ")
                    : "pengguna biasa"}{" "}
                </h4>
              </div>
            </>
          )}
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

      {isCreate && (
        <div className={styles.modalPlaylistContainer}>
          <div className={styles.modalPlaylist}>
            <h3 className={styles.inputTitle}>Tambah Playlist</h3>
            <div className={styles.inputGroup}>
              <h3 className={styles.inputTitle}>Judul</h3>
              <input
                type="text"
                className={styles.inp}
                placeholder="Judul"
                onChange={(val) => {
                  setFormData({ ...formData, judul: val.target.value });
                }}
              />
            </div>
            <div className={styles.inputGroup}>
              <h3 className={styles.inputTitle}>Deskripsi</h3>
              <input
                type="text"
                className={styles.inp}
                placeholder="Deskripsi"
                onChange={(val) => {
                  setFormData({ ...formData, deskripsi: val.target.value });
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "21px",
              }}
            >
              <Button
                variant="success"
                style={{
                  fontSize: "1.6rem",
                  fontWeight: "800",
                  padding: "8px 16px",
                  width: "100px",
                }}
                onClick={submitHandler}
              >
                Submit
              </Button>
              <Button
                variant="danger"
                style={{
                  fontSize: "1.6rem",
                  fontWeight: "800",
                  padding: "8px 16px",
                  width: "100px",
                }}
                onClick={() => setIsCreate(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {isEdit && (
        <div className={styles.modalPlaylistContainer}>
          <div className={styles.modalPlaylist}>
            <h3 className={styles.inputTitle}>Ubah Playlist</h3>
            <div className={styles.inputGroup}>
              <h3 className={styles.inputTitle}>Judul</h3>
              <input
                type="text"
                className={styles.inp}
                placeholder="Judul"
                onChange={(val) => {
                  setFormData({ ...formData, judul: val.target.value });
                }}
              />
            </div>
            <div className={styles.inputGroup}>
              <h3 className={styles.inputTitle}>Deskripsi</h3>
              <input
                type="text"
                className={styles.inp}
                placeholder="Deskripsi"
                onChange={(val) => {
                  setFormData({ ...formData, deskripsi: val.target.value });
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "21px",
              }}
            >
              <Button
                variant="success"
                style={{
                  fontSize: "1.6rem",
                  fontWeight: "800",
                  padding: "8px 16px",
                  width: "100px",
                }}
                onClick={() => {
                  updatePlaylist(id_user_playlist, formData);
                }}
              >
                Submit
              </Button>
              <Button
                variant="danger"
                style={{
                  fontSize: "1.6rem",
                  fontWeight: "800",
                  padding: "8px 16px",
                  width: "100px",
                }}
                onClick={() => setIsEdit(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {isDelete && (
        <div className={styles.modalPlaylistContainer}>
          <div className={styles.modalPlaylist}>
            <h3 className={styles.inputTitle}>Hapus Playlist</h3>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "21px",
              }}
            >
              <Button
                variant="success"
                style={{
                  fontSize: "1.6rem",
                  fontWeight: "800",
                  padding: "8px 16px",
                  width: "100px",
                }}
                onClick={() => {
                  deletePlaylist(id_user_playlist);
                }}
              >
                Submit
              </Button>
              <Button
                variant="danger"
                style={{
                  fontSize: "1.6rem",
                  fontWeight: "800",
                  padding: "8px 16px",
                  width: "100px",
                }}
                onClick={() => setIsDelete(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.userPlaylist}>
        <div className={styles.playlistTitleGroup}>
          <h3 className={styles.playListTitle}>User Playlist</h3>
          <button
            className={styles.btnAdd}
            onClick={() => {
              setIsCreate(true);
            }}
          >
            + Tambah Playlist
          </button>
        </div>
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
          <div style={{ width: "100%", height: "100vw", overflowY: "auto" }}>
            {songTable.length > 0 ? (
              <Table striped bordered hover responsive variant="dark">
                <thead>
                  <tr>
                    <th style={{ fontSize: "1.8rem", textAlign: "center" }}>
                      Judul
                    </th>
                    <th style={{ fontSize: "1.8rem", textAlign: "center" }}>
                      Jumlah Lagu
                    </th>
                    <th style={{ fontSize: "1.8rem", textAlign: "center" }}>
                      Total Durasi
                    </th>
                    <th style={{ fontSize: "1.8rem", textAlign: "center" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {songTable.map((type, index) => (
                    <tr key={index}>
                      <td style={{ fontSize: "1.4rem", textAlign: "center" }}>
                        {type.judul!}
                      </td>
                      <td style={{ fontSize: "1.4rem", textAlign: "center" }}>
                        {type.jumlah_lagu!}
                      </td>
                      <td style={{ fontSize: "1.4rem", textAlign: "center" }}>
                        {type.total_durasi!}
                      </td>
                      <td
                        style={{
                          display: "flex",
                          gap: "16px",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          variant="success"
                          style={{ fontSize: "1.4rem", width: "80px" }}
                          onClick={() =>
                            navigate(`/playlist/${type.id_playlist}`)
                          }
                        >
                          Detail
                        </Button>
                        <Button
                          variant="warning"
                          style={{ fontSize: "1.4rem", width: "80px" }}
                          onClick={() => {
                            setIsEdit(true);
                            setid_user_playlist(type.id_user_playlist);
                          }}
                        >
                          Ubah
                        </Button>
                        <Button
                          variant="danger"
                          style={{ fontSize: "1.4rem", width: "80px" }}
                          onClick={() => {
                            setIsDelete(true);
                            setid_user_playlist(type.id_user_playlist);
                          }}
                        >
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <h3 className={styles.playListSubTitle}>
                Anda Belum Memiliki Playlist
              </h3>
            )}
          </div>
        )}
        {isError && (
          <h3 style={{ fontSize: "1.6rem", color: "red" }}>{errorMassage}</h3>
        )}
      </div>
    </div>
  );
}
