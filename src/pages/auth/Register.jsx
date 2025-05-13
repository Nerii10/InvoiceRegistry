import Input from "../../components/Input";
import RenderInputs from "../../components/RenderInputs";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { Lock, UserRound, Mail } from "lucide-react";

export default function Register({ setAction }) {
  const [userData, setUserData] = useState({ username: null, password: null });
  const { register , authMessage } = useUser();

  return (
    <section className="login-wrapper">
      <div className="header">
        <h2>Register</h2>
      </div>

      <form
        className="inputs"
        onSubmit={(e) => {
          e.preventDefault();
          register(userData);
        }}
      >
        <Input
          type="text"
          customStyle={{ textAlign: "center" }}
          label={
            <>
              <UserRound /> Login
            </>
          }
          value={userData.username}
          setValue={(e) => {
            setUserData((prev) => ({ ...prev, username: e }));
          }}
        ></Input>

        <Input
          type="text"
          customStyle={{ textAlign: "center" }}
          label={
            <>
              <Lock /> Password
            </>
          }
          value={userData.password}
          setValue={(e) => {
            setUserData((prev) => ({ ...prev, password: e }));
          }}
        ></Input>

        <Input
          type="text"
          customStyle={{ textAlign: "center" }}
          label={
            <>
              <Mail /> Email
            </>
          }
          value={userData.email}
          setValue={(e) => {
            setUserData((prev) => ({ ...prev, email: e }));
          }}
        ></Input>

        <div className="auth-buttons">
          <div className="auth-button">
            <Input type="submit" className="auth-button-submit" active={true}>
              <LogIn /> Register
            </Input>
          </div>

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
      </form>

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
