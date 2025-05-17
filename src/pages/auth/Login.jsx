//Components
import Input from "../../components/Input";
import RenderInputs from "../../components/RenderInputs";
import MessagePopup from "../../components/MessagePopup";

//Hooks
import { useUser } from "../../contexts/UserContext";

//Icons
import { LogIn, Lock, UserRound } from "lucide-react";

//React
import { motion } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import { Children, useState } from "react";

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
        activeTextHidden:true,
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
        activeTextHidden:true,
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

      <MessagePopup message={authMessage} />
    </section>
  );
}
