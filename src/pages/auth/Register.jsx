//Components
import Input from "../../components/Input";
import RenderInputs from "../../components/RenderInputs";
import MessagePopup from "../../components/MessagePopup";

//Hooks
import { useUser } from "../../contexts/UserContext";

//Icons
import { LogIn, Lock, UserRound, Mail } from "lucide-react";

//React
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Register({ setAction }) {
  const [userData, setUserData] = useState({ username: null, password: null });
  const { register, authMessage, loading } = useUser();
  const [message, setMessage] = useState(authMessage);

  useEffect(() => {
    setMessage(authMessage);
  }, [authMessage]);

  const loginInputs = [
    [
      {
        activeTextHidden:true,
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
        required: true,
        customStyle: { textAlign: "center" },
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
        type: "password",
        required: true,
        customStyle: { textAlign: "center" },
        activeTextHidden:true,
        label: (
          <>
            <Lock /> Confirm Password
          </>
        ),
        value: userData.confirmedPassword,
        setValue: (e) => {
          setUserData((prev) => ({ ...prev, confirmedPassword: e }));
        },
      },
      {
        type: "email",
        activeTextHidden:true,
        required: true,
        customStyle: { textAlign: "center" },
        label: (
          <>
            <Mail /> Email
          </>
        ),
        value: userData.email,
        setValue: (e) => {
          setUserData((prev) => ({ ...prev, email: e }));
        },
      },
      {
        type: "submit",
        customStyle: { textAlign: "center" },
        className: "auth-button-submit",
        active: true,
        activeTextHidden:true,
        disabled: loading,
        children: (
          <>
            <LogIn /> Register
          </>
        ),
      },
    ],
  ];

  return (
    <section className="login-wrapper">
      <div className="header">
        <h2>Register</h2>
      </div>

      <RenderInputs
        onSubmit={() => {
          if (!userData.password || !userData.confirmedPassword) {
            setMessage({
              message: "Wprowadź i potwierdź hasło.",
              type: "error",
            });
          } else if (userData.password !== userData.confirmedPassword) {
            setMessage({
              message: "Hasła nie pasują do siebie.",
              type: "error",
            });
          } else {
            register(userData);
          }
        }}
        form={true}
        formStyle={{ width: "100%" }}
        className={"inputs"}
        data={loginInputs}
      ></RenderInputs>

      <div>
        <div className="auth-divider">
          <hr />
          <p>or</p>
        </div>

        <div className="auth-button auth-button-google">
          <p
            onClick={() => {
              setAction("login");
            }}
            style={{ textAlign: "center", color: "gray", cursor: "pointer" }}
          >
            Have an account? Login!
          </p>
        </div>
      </div>

      <MessagePopup message={message} />
    </section>
  );
}
