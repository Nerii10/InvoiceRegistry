import Input from "../../components/Input";
import RenderInputs from "../../components/RenderInputs";
import { LogIn } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { Children, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { Lock, UserRound } from "lucide-react";
import { motion } from "framer-motion";

function GoogleLoginButton() {
  const { loginGoogle } = useUser();
  const login = useGoogleLogin({
    onSuccess: (response) => {
      console.log(response);
      if (response?.access_token) {
        loginGoogle(response.access_token);
      }
    },
    onError: () => console.log("Błąd logowania"),
  });

  return (
    <div onClick={() => login()} className="google-login-button">
      <img
        src="/InvoiceRegistry/google-logo.webp"
        alt="Google"
        className="google-logo"
      />
      <p>Login with google</p>
    </div>
  );
}

export default function Login({ setAction }) {
  const [userData, setUserData] = useState({ username: null, password: null });
  const { login, authMessage, loading } = useUser();

  const loginInputs = [
    [
      {
        type: "text",
        required: true,
        customStyle: { textAlign: "center" },
        label: (
          <>
            <UserRound /> Login
          </>
        ),
        value: userData.username,
        setValue: (e) => {
          setUserData((prev) => ({ ...prev, username: e }));
        },
      },
      {
        type: "password",
        customStyle: { textAlign: "center" },
        required: true,
        label: (
          <>
            <Lock /> Password
          </>
        ),
        value: userData.password,
        setValue: (e) => {
          setUserData((prev) => ({ ...prev, password: e }));
        },
      },
      {
        type: "submit",
        customStyle: { textAlign: "center" },
        active: true,
        disabled: loading,
        children: (
          <>
            <LogIn /> Login
          </>
        ),
      },
    ],
  ];

  return (
    <section className="login-wrapper">
      <div className="header">
        <h2>Login</h2>
      </div>

      <RenderInputs
        form={true}
        onSubmit={() => login(userData)}
        formStyle={{ width: "100%" }}
        className={"inputs"}
        data={loginInputs}
      />

      <div className="inputs">
        <div className="auth-buttons">
          <div className="auth-divider">
            <hr />
            <p>or</p>
          </div>
          <div className="auth-button auth-button-google">
            <GoogleLoginButton />
            <p
              onClick={() => {
                setAction("register");
              }}
              style={{ textAlign: "center", color: "gray", cursor: "pointer" }}
            >
              Don’t have an account? Create one!
            </p>
          </div>
        </div>
      </div>

      <div
        className="login-feedback"
        style={{
          "--info-color":
            authMessage.type == "error"
              ? "rgb(255, 128, 128)"
              : "rgb(4, 172, 32)",
        }}
      >
        {authMessage.message || ""}
      </div>
    </section>
  );
}
