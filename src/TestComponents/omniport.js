import React, { useEffect, useState } from "react";
import axios from "axios";
import { Redirect } from "react-router";

export const Omniport = (props) => {
  const [isAuth, setisAuth] = useState(false);
  const codeAuth = () => {
    const params = new URLSearchParams(window.location.search);
    // code = params.get("code")
    const auth = params.get("code");
    // axios intercepter
    axios
      .get("http://127.0.0.1:8000/trelloAPIs/oauth_redirect", {
        params: { code: auth },
        withCredentials: true,
      })
      .then((response) => {
        // Cookies.set("sessionid", response.data["sessionid"], { path: "/" });
        // Cookies.set("csrftoken", response.data["csrftoken"], { path: "/" });
        console.log(response.data);
        console.log(isAuth);
        setisAuth(true);
        console.log("before redirecting");
        return response.data;
      })
      .catch((error) => {
        console.log("error occured with...", error);
      });
  };
  useEffect(() => {
    codeAuth();
  });
  useEffect(() => {
    console.log(isAuth);
  }, [isAuth]);
  return !isAuth ? (
    <p>Authenticating with omniport...</p>
  ) : (
    <Redirect to="/dashboard" />
  );
  // Encourage loading ui
};
// ssh with github
// frontend diff repo
