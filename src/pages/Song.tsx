import styles from "../App.module.css";
import marmutLogo from "../../src/assets/marmut.svg";
import coverPlaylist from "../../src/assets/coverSong.svg";
import audiotest from "../../src/assets/testAudio.mp3";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { CirclesWithBar } from "react-loader-spinner";
import axios, { AxiosError } from "axios";
import { convertSecondsToReadable } from "./hooks/convertTimeWord";

export default function Song() {
  const { id } = useParams();
  const myTime = new Date();
  const formattedDate = myTime.toISOString().split("T")[0];
  const [isLabel, setIsLabel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMassage, setErrorMassage] = useState("");
  const [increasePlay, setIncreasePlay] = useState<{
    email_pemain: string;
    id_song: string | undefined;
    waktu: string;
  }>({
    email_pemain: "",
    id_song: id,
    waktu: formattedDate,
  });
  const [songDetail, setSongDetail] = useState<{
    judul: string;
    genre?: string[];
    nama_artist: string;
    songwriter?: string[];
    durasi: number;
    tanggal_rilis: string;
    tahun: number;
    total_play: number;
    total_download: number;
    nama_album: string;
  }>({
    judul: "",
    genre: [""],
    nama_artist: "",
    songwriter: [""],
    durasi: 0,
    tanggal_rilis: "",
    tahun: 0,
    total_play: 0,
    total_download: 0,
    nama_album: "",
  });
  const [valSongChoose, setValSongChoose] = useState("");

  const [penggunaData, setPenggunaData] = useState<{
    email: string;
    nama: string;
    gender?: number;
    kontak?: string;
    kotaAsal?: string;
    role: string[] | [];
    tanggalLahir?: string;
    tempatLahir?: string;
    is_premium?: boolean;
  }>();

  const [listPlaylist, setListPlaylist] = useState<
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

  const [trackValue, setTrackValue] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [isSuccessAdd, setIsSuccessAdd] = useState(false);
  const [isSuccessDownload, setIsSuccessDownload] = useState(false);

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
  const refSlider = useRef<HTMLInputElement>();
  const refPlay = useRef<HTMLAudioElement>();

  const getDetailSong = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.MARMUT_URL}api/getDetailSong/`,
        {
          params: {
            id_song: id,
          },
        }
      );
      setSongDetail(response.data);
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

  const getListPlaylist = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.MARMUT_URL}api/getListPlaylist/`,
        {
          params: {
            email: penggunaData?.email,
          },
        }
      );
      setListPlaylist(response.data);
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
  const [formData, setFormData] = useState<{
    id_playlist: string | undefined;
    id_song: string | undefined;
  }>({
    id_playlist: "",
    id_song: id,
  });

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
        setIsAdd(false);
        setIsSuccessAdd(true);
        setValSongChoose("");
      } catch (err) {
        const errors = err as Error | AxiosError;
        setIsAdd(false);
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
  const addPointDownload = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.post(`${import.meta.env.MARMUT_URL}api/increaseDownload/`, {
        id_konten: id,
      });

      setIsLoading(false);
      setIsError(false);
      setIsSuccessDownload(true);
      if (refPlay.current) {
        refPlay.current.play();
      }
    } catch (err) {
      const errors = err as Error | AxiosError;
      setIsLoading(false);
      setIsError(true);
      setIsSuccessDownload(false);
      if (axios.isAxiosError(errors) && errors.response) {
        setErrorMassage(errors.message);
      }
      console.error("Registration failed:", errors);
      // Handle registration failure
    }
  };
  const addPointPlay = async () => {
    try {
      await axios.post(
        `${import.meta.env.MARMUT_URL}api/increasePlay/`,
        increasePlay
      );
      setIsError(false);
    } catch (err) {
      const errors = err as Error | AxiosError;
      setIsError(true);
      if (axios.isAxiosError(errors) && errors.response) {
        setErrorMassage(errors.message);
      }
      console.error("Registration failed:", errors);
      // Handle registration failure
    }
  };

  useEffect(() => {
    const updateTrack = () => {
      if (refPlay.current) {
        setTrackValue(
          (Number(refPlay.current.currentTime) /
            Number(refPlay.current.duration)) *
            100
        );
      }
    };

    if (refPlay.current) {
      refPlay.current.addEventListener("timeupdate", updateTrack);
    }
  }, [trackValue, isPlay]);

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
          setIncreasePlay((fd) => {
            return { ...fd, email_pemain: userData.email };
          });
          userData.role.map((e: string) => {
            if (e === "label" || e === "Label") {
              setIsLabel(true);
            }
          });
        }
      };
      getUserDataFromSession();
    }
    getDetailSong();
  }, [navigate, isSuccessDownload]);
  useEffect(() => {
    getListPlaylist();
  }, [isAdd]);
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

      {isAdd && (
        <div className={styles.modalPlaylistContainer}>
          <div className={styles.modalPlaylist}>
            <h3 className={styles.inputTitle}>Add Song To User Playlist</h3>
            <h3 className={styles.inputTitle}>judul: {songDetail.judul}</h3>
            <h3 className={styles.inputTitle}>
              Artist: {songDetail.nama_artist}
            </h3>
            <select
              className={styles.inp}
              defaultValue=""
              onChange={(e) => {
                if (e.target) {
                  setFormData((fd) => {
                    return { ...fd, id_playlist: e.target.value };
                  });
                  setValSongChoose(e.target.value);
                }
              }}
            >
              <option disabled selected value="" key={0}>
                {" "}
                -- select an option --{" "}
              </option>
              {listPlaylist.map((val, ind) => (
                <option
                  value={val.id_playlist}
                  className={styles.inp}
                  key={ind + 1}
                >
                  {val.judul}
                </option>
              ))}
            </select>

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
                Tambah
              </Button>
              <Button
                variant="danger"
                style={{
                  fontSize: "1.6rem",
                  fontWeight: "800",
                  padding: "8px 16px",
                  width: "100px",
                }}
                onClick={() => setIsAdd(false)}
              >
                Kembali
              </Button>
            </div>
          </div>
        </div>
      )}

      {isSuccessAdd && (
        <div className={styles.modalPlaylistContainer}>
          <div className={styles.modalPlaylist}>
            <h3 className={styles.inputTitle}>
              Berhasil menambahkan lagu dengan judul '{songDetail.judul}' ke
              playlist1
            </h3>
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
                  width: "120px",
                }}
              >
                Ke Playlist
              </Button>
              <Button
                variant="danger"
                style={{
                  fontSize: "1.6rem",
                  fontWeight: "800",
                  padding: "8px 16px",
                  width: "12  0px",
                }}
                onClick={() => setIsSuccessAdd(false)}
              >
                Kembali
              </Button>
            </div>
          </div>
        </div>
      )}
      {isSuccessDownload && (
        <div className={styles.modalPlaylistContainer}>
          <div className={styles.modalPlaylist}>
            <h3 className={styles.inputTitle}>
              Berhasil mengunduh lagu dengan judul '{songDetail.judul}'
            </h3>
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
                  width: "200px",
                }}
                onClick={() => {
                  navigate("/daftarDownload");
                }}
              >
                Ke Daftar Download
              </Button>
              <Button
                variant="danger"
                style={{
                  fontSize: "1.6rem",
                  fontWeight: "800",
                  padding: "8px 16px",
                  width: "200px",
                }}
                onClick={() => setIsSuccessDownload(false)}
              >
                Kembali
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.userPlaylist}>
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
          <>
            <div className={styles.playlistTitleGroup}>
              <h3 className={styles.playListTitle}>Song Detail</h3>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    justifyItems: "flex-start",
                    alignItems: "flex-start",
                    width: "50%",
                  }}
                >
                  <h3>Judul: {songDetail.judul}</h3>
                  <h3>Genre(s):</h3>
                  {songDetail.genre
                    ? songDetail.genre.map((val, index) => (
                        <h3
                          key={index}
                          style={{
                            marginLeft: "30px",
                          }}
                        >
                          - {val}
                        </h3>
                      ))
                    : "-"}
                  <h3>Artist: {songDetail.nama_artist}</h3>
                  <h3>Songwriter(s):</h3>
                  {songDetail.songwriter
                    ? songDetail.songwriter.map((val, index) => (
                        <h3
                          key={index}
                          style={{
                            marginLeft: "30px",
                          }}
                        >
                          - {val}
                        </h3>
                      ))
                    : "-"}
                  <h3>Durasi: {convertSecondsToReadable(songDetail.durasi)}</h3>
                </div>
                <div
                  style={{
                    justifyItems: "flex-start",
                    alignItems: "flex-start",
                    width: "50%",
                  }}
                >
                  <h3>Tanggal Rilis: {songDetail.tanggal_rilis}</h3>
                  <h3>Tahun: {songDetail.tahun}</h3>
                  <h3>Total Play: {songDetail.total_play}</h3>
                  <h3>Total Download: {songDetail.total_download}</h3>
                  <h3>Album: {songDetail.nama_album}</h3>
                </div>
              </div>
              <div
                style={{
                  height: "40vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background:
                    "linear-gradient(to bottom right, #010101 0%, #232323 100%)",
                  width: "100%",
                  borderRadius: "10px",
                }}
              >
                <img
                  src={coverPlaylist}
                  alt="cover song"
                  style={{
                    height: "60%",
                  }}
                />
                <audio
                  src={audiotest}
                  ref={refPlay as React.LegacyRef<HTMLAudioElement>}
                ></audio>
              </div>

              <div style={{ width: "100%" }}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.01}
                  defaultValue={0}
                  value={trackValue}
                  ref={refSlider as React.LegacyRef<HTMLInputElement>}
                  onChange={() => {
                    if (refSlider.current) {
                      setTrackValue(Number(refSlider.current.value));
                      if (refPlay.current) {
                        refPlay.current.currentTime =
                          (Number(refSlider.current.value) / 100) *
                          Number(refPlay.current.duration);
                      }
                    }
                  }}
                  className={styles.slider}
                  style={{
                    background: `linear-gradient(to right, #1fdf64 ${
                      ((Number(trackValue ? trackValue : 0) - 0) * 100) /
                      (100 - 0)
                    }%, #aaa 0px`,
                  }}
                />
              </div>
              <h3>{Math.round(trackValue * 100) / 100}%</h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "21px",
                }}
              >
                {!isPlay ? (
                  <Button
                    variant="info"
                    style={{
                      fontSize: "1.6rem",
                      width: "160px",
                      color: "#000",
                      fontWeight: "600",
                    }}
                    onClick={() => {
                      setIsPlay(true);
                      if (refPlay.current) {
                        if (trackValue > 70) {
                          getDetailSong();
                          addPointPlay();
                          refPlay.current.play();
                          setTrackValue(
                            (Number(refPlay.current.currentTime) /
                              Number(refPlay.current.duration)) *
                              100
                          );
                        } else {
                          refPlay.current.play();

                          setTrackValue(
                            (Number(refPlay.current.currentTime) /
                              Number(refPlay.current.duration)) *
                              100
                          );
                        }
                      }
                    }}
                  >
                    Play
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    style={{
                      fontSize: "1.6rem",
                      width: "160px",
                      color: "#000",
                      fontWeight: "600",
                    }}
                    onClick={() => {
                      setIsPlay(false);
                      if (refPlay.current) {
                        refPlay.current.pause();
                      }
                    }}
                  >
                    pause
                  </Button>
                )}
                <Button
                  variant="success"
                  style={{
                    fontSize: "1.6rem",
                    width: "160px",
                    color: "#000",
                    fontWeight: "600",
                  }}
                  onClick={() => {
                    setIsAdd(true);
                  }}
                >
                  Add To Playlist
                </Button>
                {penggunaData?.is_premium && (
                  <Button
                    variant="secondary"
                    style={{
                      fontSize: "1.6rem",
                      width: "160px",
                      color: "#000",
                      fontWeight: "600",
                    }}
                    onClick={addPointDownload}
                  >
                    Download
                  </Button>
                )}
                <Button
                  variant="danger"
                  onClick={() => navigate(-1)}
                  style={{
                    fontSize: "1.6rem",
                    width: "160px",
                    color: "#000",
                    fontWeight: "600",
                  }}
                >
                  Kembali
                </Button>
              </div>
            </div>
          </>
        )}
        {isError && (
          <h3 style={{ fontSize: "1.6rem", color: "red" }}>{errorMassage}</h3>
        )}
      </div>
    </div>
  );
}
