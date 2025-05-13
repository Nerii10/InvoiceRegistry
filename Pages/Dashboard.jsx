//--
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

//Icons
import { CircleUserRound, File, Settings, Upload } from "lucide-react";

//Components
import Navbar from "../Components/Navbar";

//Pages
import Documents from "./Documents";
import DocumentsAdd from "./DocumentsAdd";
import User from "./User";
import Invoice from './Invoice'

export default function Dashboard() {
  //Backendurl
  const ApiUrl = "http://localhost:3000";

  //Path
  const location = useLocation();
  const [query, setQuery] = useState("");

  //User, Copmany
  const [Token, setToken] = useState("");
  const [CurrentUser, setCurrentUser] = useState("");
  const [CompanyData, setCompanyData] = useState([]);

  //Company Data
  async function DownloadCompanyData() {
    try {
      const response = await fetch(`${ApiUrl}/myCompany/`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCompanyData(data);
        console.log(data, "- DashboardData");
      } else {
        console.error("Failed to fetch company data");
      }
    } catch (err) {
      console.error(err);
    }
  }

  //Path
  useEffect(() => {
    setQuery(location.pathname.split("/")[2]);
    if (Token) {
      DownloadCompanyData();
    }
  }, [location, Token]);

  //Token init
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      setCurrentUser(jwtDecode(token));
    } else {
      setCurrentUser("");
      setToken("");
    }
  }, []);

  return (
    <>
      <div className="website">
        <>
          <div className="panel">
            <div
              style={{
                height: "60px",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p style={{ margin: 0 }}>Dashboard</p>
            </div>

            <br></br>
            <br></br>

            <Link
              to={"/dashboard/documents"}
              className={
                query == "documents" ? "panel-input-active" : "panel-input"
              }
            >
              <File />
              Documents
            </Link>

            <Link
              to={"/dashboard/documents-add"}
              className={
                query == "documents-add" ? "panel-input-active" : "panel-input"
              }
            >
              <Upload />
              New
            </Link>

            <Link
              to={"/dashboard/user"}
              className={query == "user" ? "panel-input-active" : "panel-input"}
            >
              <CircleUserRound />
              Company
            </Link>

            <Link
              to={"/dashboard/settings"}
              className={
                query == "settings" ? "panel-input-active" : "panel-input"
              }
            >
              <Settings />
              Settings
            </Link>
          </div>
        </>

        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Navbar CurrentHash={query} CurrentUser={CurrentUser}></Navbar>

          <div className="content">
            {query == "documents" && (
              <>
                <Documents Token={Token}></Documents>
              </>
            )}

            {query == "documents-add" && (
              <>
                <DocumentsAdd
                  CurrentUser={CurrentUser}
                  Token={Token}
                  CompanyData={CompanyData}
                ></DocumentsAdd>
              </>
            )}

            {query == "user" && (
              <>
                <User
                  DownloadCompanyData={DownloadCompanyData}
                  CompanyData={CompanyData}
                  Token={Token}
                  CurrentUser={CurrentUser}
                ></User>
              </>
            )}

            {query == "settings" && (
              <>
                <h1>settings</h1>
              </>
            )}


            {query.startsWith("invoice") && (
              <>
                <Invoice Token={Token}></Invoice>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
