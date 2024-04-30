import styles from "./App.module.css";
import marmutLogo from "../src/assets/marmut.svg";
import coverPlaylist from "../src/assets/coverSong.svg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { CirclesWithBar } from "react-loader-spinner";

interface CardCover {
  judul?: string;
  id_playlist?: string;
}
function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMassage, setErrorMassage] = useState("");
  const [colors, setColors] = useState<{ [key: string]: string }>({});
  const [isLabel, setIsLabel] = useState(false);
  const [isArtist, setIsArtist] = useState(false);
  const [isPodcaster, setIsPodcaster] = useState(false);
  const [isSongwriter, setIsSongwriter] = useState(false);
  const [isExpandUser, setIsExpandUser] = useState(true);
  const [isExpandLabel, setIsExpandLabel] = useState(false);
  const [isExpandArtist, setIsExpandArtist] = useState(false);
  const [isExpandPodcaster, setIsExpandPodcaster] = useState(false);
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

  const [cardPlaylist, setCardPlaylist] = useState<CardCover[]>([]);
  const [cardSong, setCardSong] = useState<CardCover[]>([]);
  const [cardPodcaster, setCardPodcaster] = useState<CardCover[]>([]);
  const [cardAlbum, setCardAlbum] = useState<CardCover[]>([]);

  const getListPlaylist = async () => {
    if (penggunaData?.email) {
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
        setCardPlaylist(response.data);
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

  const navigate = useNavigate();
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
          userData.role.map((e: string) => {
            if (e === "label" || e === "Label") {
              setIsLabel(true);
            }
            if (e === "artist" || e === "Artist") {
              setIsArtist(true);
            }
            if (e === "podcaster" || e === "Podcaster") {
              setIsPodcaster(true);
            }
            if (e === "songwriter" || e === "Songwriter") {
              setIsSongwriter(true);
            }
          });
        }
        // Parse the JSON string to convert it into a JavaScript object
      };

      getUserDataFromSession();
    }
    setCardPodcaster([]);
    setCardSong([]);
    setCardAlbum([]);
    getListPlaylist();
  }, [penggunaData, navigate]);

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

  const generateRandomColor = () => {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)})`;
  };

  useEffect(() => {
    if (cardPlaylist.length > 0) {
      const newColors: { [key: string]: string } = {};
      // Generate color for the first card
      newColors[cardPlaylist[0].judul!] = generateRandomColor();

      // Generate colors for the rest of the cards
      for (let i = 1; i < cardPlaylist.length; i++) {
        let color = generateRandomColor();
        // Ensure the color is different from the first card's color
        while (color === newColors[cardPlaylist[0].judul!]) {
          color = generateRandomColor();
        }
        newColors[cardPlaylist[i].judul!] = color;
      }
      setColors(newColors);
    }
  }, [cardPlaylist]);

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
            <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              <h3 className={styles.playListTitle}>Daftar Playlist</h3>
              {isExpandUser ? (
                <div
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setIsExpandUser(false);
                  }}
                >
                  --
                </div>
              ) : (
                <div
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setIsExpandUser(true);
                  }}
                >
                  ++
                </div>
              )}
            </div>

            {isExpandUser && (
              <div
                className={
                  cardPlaylist.length > 0 ? styles.playListContainer : ""
                }
              >
                {cardPlaylist.length > 0 ? (
                  cardPlaylist.map((type, index) => {
                    if (type.judul) {
                      return (
                        <div
                          className={styles.playlistCard}
                          key={index}
                          onClick={() =>
                            navigate(`/playlist/${type.id_playlist}`)
                          }
                        >
                          <img
                            src={coverPlaylist}
                            alt="cover playlist"
                            className={styles.playlistCardCover}
                            style={{
                              background: `linear-gradient(to top, #121212 0%, ${
                                colors[type.judul]
                              } 100%)`,
                            }}
                            onMouseEnter={(val) => {
                              const target = val.target as HTMLImageElement;
                              target.style.filter = "brightness(1.8)";
                            }}
                            onMouseLeave={(val) => {
                              const target = val.target as HTMLImageElement;
                              target.style.filter = "";
                            }}
                          />
                          <p className={styles.playlistCardTitle}>
                            {type.judul}
                          </p>
                        </div>
                      );
                    }
                  })
                ) : (
                  <h3 className={styles.playListSubTitle}>
                    Belum Memiliki Playlist
                  </h3>
                )}
              </div>
            )}

            {isLabel && (
              <>
                {" "}
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "10px" }}
                >
                  <h3 className={styles.playListTitle}>Daftar Album</h3>
                  {isExpandLabel ? (
                    <div
                      style={{
                        fontSize: "1.6rem",
                        fontWeight: "800",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setIsExpandLabel(false);
                      }}
                    >
                      --
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: "1.6rem",
                        fontWeight: "800",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setIsExpandLabel(true);
                      }}
                    >
                      ++
                    </div>
                  )}
                </div>
                {isExpandLabel && (
                  <div
                    className={
                      cardAlbum.length > 0 ? styles.playListContainer : ""
                    }
                  >
                    {cardAlbum.length > 0 ? (
                      cardAlbum.map((type, index) => {
                        if (type.judul) {
                          return (
                            <div className={styles.playlistCard} key={index}>
                              <img
                                src={coverPlaylist}
                                alt="cover playlist"
                                className={styles.playlistCardCover}
                                style={{
                                  background: `linear-gradient(to top, #121212 0%, ${
                                    colors[type.judul]
                                  } 100%)`,
                                }}
                                onMouseEnter={(val) => {
                                  const target = val.target as HTMLImageElement;
                                  target.style.filter = "brightness(1.8)";
                                }}
                                onMouseLeave={(val) => {
                                  const target = val.target as HTMLImageElement;
                                  target.style.filter = "";
                                }}
                              />
                              <p className={styles.playlistCardTitle}>
                                {type.judul}
                              </p>
                            </div>
                          );
                        }
                      })
                    ) : (
                      <h3 className={styles.playListSubTitle}>
                        Belum Memproduksi Album
                      </h3>
                    )}
                  </div>
                )}
              </>
            )}

            {(isArtist || isSongwriter) && (
              <>
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "10px" }}
                >
                  <h3 className={styles.playListTitle}>Daftar Lagu</h3>
                  {isExpandArtist ? (
                    <div
                      style={{
                        fontSize: "1.6rem",
                        fontWeight: "800",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setIsExpandArtist(false);
                      }}
                    >
                      --
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: "1.6rem",
                        fontWeight: "800",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setIsExpandArtist(true);
                      }}
                    >
                      ++
                    </div>
                  )}
                </div>
                {isExpandArtist && (
                  <div
                    className={
                      cardSong.length > 0 ? styles.playListContainer : ""
                    }
                  >
                    {cardSong.length > 0 ? (
                      cardSong.map((type, index) => {
                        if (type.judul) {
                          return (
                            <div className={styles.playlistCard} key={index}>
                              <img
                                src={coverPlaylist}
                                alt="cover playlist"
                                className={styles.playlistCardCover}
                                style={{
                                  background: `linear-gradient(to top, #121212 0%, ${
                                    colors[type.judul]
                                  } 100%)`,
                                }}
                                onMouseEnter={(val) => {
                                  const target = val.target as HTMLImageElement;
                                  target.style.filter = "brightness(1.8)";
                                }}
                                onMouseLeave={(val) => {
                                  const target = val.target as HTMLImageElement;
                                  target.style.filter = "";
                                }}
                              />
                              <p className={styles.playlistCardTitle}>
                                {type.judul}
                              </p>
                            </div>
                          );
                        }
                      })
                    ) : (
                      <h3 className={styles.playListSubTitle}>
                        Belum Memiliki Lagu
                      </h3>
                    )}
                  </div>
                )}
              </>
            )}
            {isPodcaster && (
              <>
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "10px" }}
                >
                  <h3 className={styles.playListTitle}>Daftar Podcaster</h3>
                  {isExpandPodcaster ? (
                    <div
                      style={{
                        fontSize: "1.6rem",
                        fontWeight: "800",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setIsExpandPodcaster(false);
                      }}
                    >
                      --
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: "1.6rem",
                        fontWeight: "800",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setIsExpandPodcaster(true);
                      }}
                    >
                      ++
                    </div>
                  )}
                </div>
                {isExpandPodcaster && (
                  <div
                    className={
                      cardPodcaster.length > 0 ? styles.playListContainer : ""
                    }
                  >
                    {cardPodcaster.length > 0 ? (
                      cardPodcaster.map((type, index) => {
                        if (type.judul) {
                          return (
                            <div className={styles.playlistCard} key={index}>
                              <img
                                src={coverPlaylist}
                                alt="cover playlist"
                                className={styles.playlistCardCover}
                                style={{
                                  background: `linear-gradient(to top, #121212 0%, ${
                                    colors[type.judul]
                                  } 100%)`,
                                }}
                                onMouseEnter={(val) => {
                                  const target = val.target as HTMLImageElement;
                                  target.style.filter = "brightness(1.8)";
                                }}
                                onMouseLeave={(val) => {
                                  const target = val.target as HTMLImageElement;
                                  target.style.filter = "";
                                }}
                              />
                              <p className={styles.playlistCardTitle}>
                                {type.judul}
                              </p>
                            </div>
                          );
                        }
                      })
                    ) : (
                      <h3 className={styles.playListSubTitle}>
                        Belum Memproduksi Podcast
                      </h3>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
        {isError && (
          <h3 style={{ fontSize: "1.6rem", color: "red" }}>{errorMassage}</h3>
        )}
      </div>
    </div>
  );
}

export default App;
