import styles from "../../App.module.css";
import marmutLogo from "../../../src/assets/marmut.svg";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import axios, { AxiosError } from "axios";
import { CirclesWithBar } from "react-loader-spinner";
export default function UserPlaylist() {
  const { id } = useParams();
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
    id_playlist: string | undefined;
    id_song: string | undefined;
  }>({
    id_playlist: id,
    id_song: "",
  });

  const [isModal, setIsModal] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMassage, setErrorMassage] = useState("");
  const [playlistDetail, setPlaylistDetail] = useState<{
    deskripsi: string;
    email_pembuat: string;
    id_playlist: string;
    id_user_playlist: string;
    judul: string;
    jumlah_lagu: number;
    tanggal_dibuat: string;
    total_durasi: number;
  }>();
  const [listSong, setListSong] = useState<
    { konten_id: string; judul: string; nama_artist: string }[]
  >([]);

  const [songTable, setSongTable] = useState<
    {
      id_playlist: string;
      id_song: string;
      judul: string;
      nama_artist: string;
      total_durasi: number;
    }[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    getDetail();
    getSong();
  }, []);

  const [valSongChoose, setValSongChoose] = useState("");
  const [valIdSong, setValIdSong] = useState("");

  useEffect(() => {
    const userData = sessionStorage.getItem("userData");

    if (!userData) {
      navigate("/");
    }
    if (!penggunaData) {
      const getUserDataFromSession = () => {
        // Retrieve the user data JSON string from session storage
        const userDataString = sessionStorage.getItem("userData");
        if (userDataString != null) {
          const userData = JSON.parse(userDataString);
          setPenggunaData(userData);
        }
        // Parse the JSON string to convert it into a JavaScript object
      };
      getUserDataFromSession();
    }

    getTable();
  }, [navigate, playlistDetail, isModal, isDelete]);

  const getDetail = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.MARMUT_URL}api/getUserPlaylistById/`,
        {
          params: {
            id_playlist: id,
          },
        }
      );
      setPlaylistDetail(response.data[0]);
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
  };

  const getSong = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.MARMUT_URL}api/listSongArtist/`
      );
      setListSong(response.data);
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
  };

  const getTable = async () => {
    if (playlistDetail?.id_playlist) {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.MARMUT_URL}api/playlist/`,
          {
            params: {
              id_playlist: playlistDetail?.id_playlist,
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
      }
    }
  };

  const addSong = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (valSongChoose) {
      try {
        setIsLoading(true);
        await axios.post(
          `${import.meta.env.MARMUT_URL}api/addSongToPlaylist/`,
          formData
        );
        setIsLoading(false);
        setIsError(false);
        setIsModal(false);
        setValSongChoose("");
      } catch (err) {
        const errors = err as Error | AxiosError;
        setIsModal(false);
        setIsLoading(false);
        setIsError(true);
        if (axios.isAxiosError(errors) && errors.response) {
          setErrorMassage(errors.message);
        }
        setValSongChoose("");
        console.error("Registration failed:", errors);
        // Handle registration failure
      }
    }
  };

  const deleteSong = async () => {
    console.log(valIdSong, id);
    try {
      await axios.delete(
        `${import.meta.env.MARMUT_URL}api/deleteSongFromPlaylist/`,
        {
          data: {
            id_playlist: id,
            id_song: valIdSong,
          },
        }
      );
      setIsDelete(false);
    } catch (error) {
      console.error("Error deleting playlist:", error);
      setIsDelete(false);
      throw error;
    }
  };

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
            <h4>Judul : </h4>
            <h4>{playlistDetail?.judul} </h4>
          </div>
          <div className={styles.userGroup}>
            <h4>Pembuat : </h4>
            <h4>{penggunaData?.nama} </h4>
          </div>
          <div className={styles.userGroup}>
            <h4>Jumlah Lagu : </h4>
            <h4>{playlistDetail?.jumlah_lagu} </h4>
          </div>
          <div className={styles.userGroup}>
            <h4>Total Durasi : </h4>
            <h4>{playlistDetail?.total_durasi} </h4>
          </div>
          <div className={styles.userGroup}>
            <h4>Tanggal Dibuat : </h4>
            <h4>{playlistDetail?.tanggal_dibuat} </h4>
          </div>
          <div className={styles.userGroup}>
            <h4>Deskripsi : </h4>
            <h4>{playlistDetail?.deskripsi} </h4>
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

      {isModal && (
        <div className={styles.modalPlaylistContainer}>
          <div className={styles.modalPlaylist}>
            <h3 className={styles.inputTitle}>Tambah Lagu</h3>
            <div className={styles.inputGroup}>
              <h3 className={styles.inputTitle}>Lagu</h3>
              <select
                className={styles.inp}
                defaultValue=""
                onChange={(e) => {
                  if (e.target) {
                    setFormData((fd) => {
                      return { ...fd, id_song: e.target.value };
                    });
                    setValSongChoose(e.target.value);
                  }
                }}
              >
                <option disabled selected value="" key={0}>
                  {" "}
                  -- select an option --{" "}
                </option>
                {listSong.map((val, ind) => (
                  <option
                    value={val.konten_id}
                    className={styles.inp}
                    key={ind + 1}
                  >
                    {val.judul} - {val.nama_artist}
                  </option>
                ))}
              </select>
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
                onClick={addSong}
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
                onClick={() => setIsModal(false)}
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
                onClick={deleteSong}
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
          <h3 className={styles.playListTitle}>Daftar Lagu</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "16px",
            }}
          >
            <button className={styles.btnAddBack} onClick={() => navigate(-1)}>
              ← Kembali
            </button>
            <button className={styles.btnAdd} onClick={() => setIsModal(true)}>
              ↻ Shuffle Play
            </button>
            <button className={styles.btnAdd} onClick={() => setIsModal(true)}>
              + Tambah Lagu
            </button>
          </div>
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
                      Judul Lagu
                    </th>
                    <th style={{ fontSize: "1.8rem", textAlign: "center" }}>
                      Oleh
                    </th>
                    <th style={{ fontSize: "1.8rem", textAlign: "center" }}>
                      Durasi
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
                        {type.nama_artist!}
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
                          variant="warning"
                          style={{ fontSize: "1.4rem", width: "80px" }}
                          onClick={() => navigate(`/song/${type.id_song}`)}
                        >
                          Lihat
                        </Button>
                        <Button
                          variant="success"
                          style={{ fontSize: "1.4rem", width: "80px" }}
                          onClick={() => {
                            setValIdSong(type.id_song);
                          }}
                        >
                          Play
                        </Button>
                        <Button
                          variant="danger"
                          style={{ fontSize: "1.4rem", width: "80px" }}
                          onClick={() => {
                            setValIdSong(type.id_song);
                            setIsDelete(true);
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
                Anda Belum Memiliki Lagu
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
