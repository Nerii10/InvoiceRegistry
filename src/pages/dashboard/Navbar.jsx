import { useUser, UserStatus } from "../../contexts/UserContext";
import "../../styles/Navbar.css";

export default function Navbar() {
  const { user } = useUser();

  return (
    <div className="navbar">
      <section className="navbar-left">
        <p>Invoice Registry</p>
      </section>
      <section className="navbar-right">
          <UserStatus user={user}/>
      </section>
    </div>
  );
}
