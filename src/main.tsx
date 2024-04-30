import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Label from "./pages/Label.tsx";
import User from "./pages/User.tsx";
import Collection from "./pages/Collection.tsx";
import UserPlaylist from "./pages/playlist/UserPlaylist.tsx";
import Song from "./pages/Song.tsx";
import DaftarDownload from "./pages/playlist/DaftarDownload.tsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/userRegister",
    element: <User />,
  },
  {
    path: "/labelRegister",
    element: <Label />,
  },
  {
    path: "/dashboard",
    element: <App />,
  },
  {
    path: "/collection",
    element: <Collection />,
  },
  {
    path: "/daftarDownload",
    element: <DaftarDownload />,
  },
  {
    path: "/playlist/:id",
    element: <UserPlaylist />,
  },
  {
    path: "/song/:id",
    element: <Song />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
