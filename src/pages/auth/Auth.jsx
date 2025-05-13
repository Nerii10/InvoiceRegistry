import { useState } from "react";
import "../../styles/Auth.css";
import Login from "./Login";
import Register from "./Register";

export default function Auth() {
  const [action, setAction] = useState("login");

  return (
    <section className="auth-wrapper">
      {action == "login" ? <Login setAction={setAction}/> : <Register setAction={setAction}/>}
    </section>
  );
}
