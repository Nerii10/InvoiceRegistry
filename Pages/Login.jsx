//Frameworks
import { useEffect, useState } from "react";
import { useGoogleLogin, GoogleLogin } from "@react-oauth/google";

//Styles
import "../Styles/Login.css";

//Icons
import { Lock, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../src/contexts/UserContext";

export default function LoginRegister() {
  const ApiUrl = "http://localhost:3000";
  const [Login, setLogin] = useState("");
  const [Password, setPassword] = useState("");
  const [Email, setEmail] = useState("");
  const [FirmName, setFirmName] = useState("");
  const [FirmNip, setFirmNip] = useState("");
  const [FirmAddress, setFirmAddress] = useState("");
  const [Message, setMessage] = useState({ message: "", type: "error" });
  const [State, setState] = useState("login");
  const navigate = useNavigate();
  const { token } = useUser();

  useEffect(()=>{
    if(token){
      navigate('/dashboard/')
    }
  },[token])
  
  // Signin
  async function SignIn() {
    try {
      const response = await fetch(`${ApiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: Login,
          email: Email,
          password: Password,
          firm_nip: FirmNip,
          firm_address: FirmAddress,
          firm_name: FirmName,
        }),
      });

      if (response.ok) {
        setMessage({ message: "Rejestracja udana!", type: "success" });
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        const data = await response.json();
        setMessage({
          message: data.error || "Wystąpił błąd podczas rejestracji.",
          type: "error",
        });
      }
    } catch (err) {
      console.log(err);
      setMessage({
        message: "Wystąpił błąd podczas łączenia z serwerem.",
        type: "error",
      });
    }
  }

  // Login
  async function LoginUser() {
    try {
      const response = await fetch(`${ApiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: Login, password: Password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setMessage({ message: "Succesfully logged in..", type: "login" });
        setTimeout(() => {
          setLogin("");
          window.location.reload();
        }, 1000);
      } else {
        const data = await response.json();
        setMessage({
          message: data.error || "Wystąpił błąd podczas logowania.",
          type: "error",
        });
      }
    } catch (err) {
      console.log(err);
      setMessage({
        message: "Wystąpił błąd podczas łączenia z serwerem.",
        type: "error",
      });
    }
  }

  async function LoginUserGoogle(GoogleToken) {
    try {
      const response = await fetch(`${ApiUrl}/Googlelogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GoogleToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setMessage({ message: "Succesfully logged in..", type: "login" });
        setTimeout(() => {
          setLogin("");
          window.location.reload();
        }, 1000);
      } else {
        const data = await response.json();
        setMessage({
          message: data.error || "Wystąpił błąd podczas logowania.",
          type: "error",
        });
      }
    } catch (err) {
      console.log(err);
      setMessage({
        message: "Wystąpił błąd podczas łączenia z serwerem.",
        type: "error",
      });
    }
  }

  function GoogleLoginButton() {
    const login = useGoogleLogin({
      onSuccess: (response) => {
        console.log(response);
        if (response?.access_token) {
          LoginUserGoogle(response.access_token);
        }
      },
      onError: () => console.log("Błąd logowania"),
    });

    return (
      <div onClick={() => login()} className="google-login-button">
        <img src="/google-logo.webp" alt="Google" className="google-logo" />
      </div>
    );
  }

  // Front
  return (
    <>
      <div className="page-container">
        <div className="login-box">
          {State == "login" ? (
              <>
                <h2 style={{ margin: 0 }}>Login</h2>
                <div className="login-input">
                  <p
                    className={
                      Login ? "login-input-text-top" : "login-input-text"
                    }
                  >
                    <Lock size={17} />
                    login
                  </p>
                  <input
                    value={Login}
                    onChange={(event) => {
                      setLogin(event.target.value);
                    }}
                    type="text"
                  ></input>
                </div>

                <div className="login-input">
                  <p
                    className={
                      Password ? "login-input-text-top" : "login-input-text"
                    }
                  >
                    <UserRound size={17} />
                    password
                  </p>
                  <input
                    value={Password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                    type="password"
                  ></input>
                </div>

                <div className="login-input-google">
                  <GoogleLoginButton />

                  <input
                    className="login-input-google-button"
                    type="button"
                    value={"Login"}
                    onClick={LoginUser}
                  />
                </div>

                <div className="login-input">
                  <p
                    className="login-input-register-text"
                    onClick={() => {
                      setState((prev) =>
                        prev == "login" ? "register" : "login"
                      );
                    }}
                  >
                    No account? Create one!
                  </p>
                </div>

                {Message.message && (
                  <p
                    style={{
                      color:
                        Message.type === "error"
                          ? "red"
                          : "rgba(39, 168, 87, 0.6)",
                      margin: 0,
                      position: "absolute",
                      bottom: "10px",
                      width: "100%",
                      textAlign: "center",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {Message.message}
                  </p>
                )}
              </>
          ) : (
            <>
              <h2 style={{ margin: 0 }}>SignUp</h2>

              <div className="login-input">
                <p
                  className={
                    Email ? "login-input-text-top" : "login-input-text"
                  }
                >
                  <Lock size={17} />
                  email
                </p>
                <input
                  value={Email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  type="text"
                ></input>
              </div>

              <div className="login-input">
                <p
                  className={
                    Login ? "login-input-text-top" : "login-input-text"
                  }
                >
                  <Lock size={17} />
                  login
                </p>
                <input
                  value={Login}
                  onChange={(event) => {
                    setLogin(event.target.value);
                  }}
                  type="text"
                ></input>
              </div>

              <div className="login-input">
                <p
                  className={
                    Password ? "login-input-text-top" : "login-input-text"
                  }
                >
                  <UserRound size={17} />
                  password
                </p>
                <input
                  value={Password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  type="password"
                ></input>
              </div>

              <div className="login-input">
                <p
                  className={
                    FirmNip ? "login-input-text-top" : "login-input-text"
                  }
                >
                  <UserRound size={17} />
                  Nip
                </p>
                <input
                  value={FirmNip}
                  onChange={(event) => {
                    setFirmNip(event.target.value);
                  }}
                  type="text"
                ></input>
              </div>

              <div className="login-input">
                <p
                  className={
                    FirmAddress ? "login-input-text-top" : "login-input-text"
                  }
                >
                  <UserRound size={17} />
                  Address
                </p>
                <input
                  value={FirmAddress}
                  onChange={(event) => {
                    setFirmAddress(event.target.value);
                  }}
                  type="text"
                ></input>
              </div>

              <div className="login-input">
                <p
                  className={
                    FirmName ? "login-input-text-top" : "login-input-text"
                  }
                >
                  <UserRound size={17} />
                  Name
                </p>
                <input
                  value={FirmName}
                  onChange={(event) => {
                    setFirmName(event.target.value);
                  }}
                  type="text"
                ></input>
              </div>

              <div className="login-input">
                <input type="button" value={"SignIn"} onClick={SignIn} />
              </div>

              {Message.message && (
                <p
                  style={{ color: Message.type === "error" ? "red" : "green" }}
                >
                  {Message.message}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
