import React, { useEffect, useState, useMemo } from "react";
import "../Styles/User.css";
import { Loader } from "lucide-react";

export default function User({
  CurrentUser,
  Token,
  CompanyData,
  DownloadCompanyData,
}) {
  const ApiUrl = "http://localhost:3000";

  const [NewUnitName, setNewUnitName] = useState(null);
  const [NewUnitParent, setNewUnitParent] = useState(null);
  const [Root, setRoot] = useState(null);

  const [MoveToUnit, setMoveToUnit] = useState(null);
  const [SelectedUser, setSelectedUser] = useState(null);

  const [CompanyPassword, setCompanyPassword] = useState(null);
  const [CompanyName, setCompanyName] = useState(null);

  const [StructureAction, setStructureAction] = useState(null);

  async function addNewUnit() {
    try {
      await fetch(`${ApiUrl}/unit/add`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify({ NewUnitName, NewUnitParent, Root }),
      });
      DownloadCompanyData();
    } catch (err) {
      console.error(err);
    }
  }

  async function moveUnit() {
    if (!SelectedUser || !MoveToUnit) return;
    try {
      await fetch(`${ApiUrl}/unit/move`, {
        method: "patch",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify({ user: SelectedUser, newUnit: MoveToUnit }),
      });
      DownloadCompanyData();
    } catch (err) {
      console.error(err);
    }
  }

  async function joinCompany() {
    try {
      await fetch(`${ApiUrl}/unit/join`, {
        method: "patch",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify({ CompanyName, CompanyPassword }),
      });
      DownloadCompanyData();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!CompanyData?.error) {
      setRoot(CompanyData?.unitsData?.filter((u) => u.id === u.root_id)[0]);
    }
    // console.log(CompanyData)
  }, [CompanyData]);

  //Tree
  const { unitsData = [], usersData = [], me } = CompanyData || {};
  const [rootUnits, allowedUnitIds] = useMemo(() => {
    if (!Array.isArray(unitsData)) return [[], new Set()];

    // 1) map
    const map = new Map(
      unitsData.map((u) => [u.id, { ...u, children: [], users: [] }])
    );

    // 2) parent/children
    for (let { id, parent_id } of unitsData) {
      if (parent_id && map.has(parent_id)) {
        map.get(parent_id).children.push(map.get(id));
      }
    }

    // 3) users
    for (let u of usersData) {
      map.get(u.unit_id)?.users.push(u);
    }

    // 4) root
    const roots = Array.from(map.values()).filter((u) => !u.parent_id);

    // 5) permisions
    const allowed = new Set();
    const stack = [];
    const start = map.get(me?.userUnit);
    if (start) stack.push(start);

    while (stack.length) {
      const node = stack.pop();
      allowed.add(node.id);
      for (let child of node.children) {
        stack.push(child);
      }
    }

    return [roots, allowed];
  }, [unitsData, usersData, me]);
  const renderUnits = (units, level = 0) =>
    units.map((unit) => {
      const isGreen = allowedUnitIds.has(unit.id);

      return (
        <div
          key={unit.id}
          style={{
            marginLeft: `${level * 30}px`,
            padding: "4px 8px",
            borderLeft: `3px ${
              isGreen ? "rgb(81, 198, 38)" : "rgb(203, 56, 56)"
            } dotted`,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            gap: "10px",
            borderRadius: "0px",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              borderTop: `2px ${
                isGreen ? "rgba(81, 198, 38, 0.46)" : "rgba(203, 56, 56, 0.76)"
              } solid`,
            }}
          >
            <p style={{ margin: 0 }}>{unit.name}</p>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "-6px",
                backgroundColor: isGreen
                  ? "rgb(81, 198, 38)"
                  : "rgb(203, 56, 56)",
                height: "10px",
                width: "10px",
                borderRadius: "50%",
              }}
            />
          </div>

          {unit.users.map((u) => (
            <div key={u.id} style={{ marginLeft: "20px" }}>
              <p style={{ margin: 0 }}>
                – {u.name} {u.type === "admin" ? "(admin)" : ""}
              </p>
            </div>
          ))}

          {unit.children.length > 0 && renderUnits(unit.children, level + 1)}
        </div>
      );
    });

  //Front
  return (
    <div className="user-container">
      <main className="main-content">
        <header className="main-header">
          {CurrentUser.profilepic && (
            <img
              className="main-header-picture"
              src={CurrentUser.profilepic}
              alt="Profile"
            />
          )}
          <h1>Witaj, {CurrentUser.username}</h1>
        </header>

        <section className="profile-overview">
          {!CompanyData.me || !CompanyData.access ? (
            //Loading
            <>
              <div className="invoices-loading">
                <Loader className="invoices-loading-icon" />
              </div>
            </>
          ) : CompanyData?.me.companyRootId == null ? (
            //No company
            <>
              <h1>NoCompany</h1>

              <p>Create a Company</p>
              <input
                value={NewUnitName}
                onChange={(event) => {
                  setNewUnitName(event.target.value);
                }}
                placeholder="Company Name"
              ></input>
              <button
                onClick={() => {
                  addNewUnit();
                }}
              >
                Add
              </button>

              <p>Join Existing Company</p>
              <input
                value={CompanyName}
                onChange={(event) => {
                  setCompanyName(event.target.value);
                }}
                placeholder="Enter Company Name"
              ></input>
              <input
                value={CompanyPassword}
                onChange={(event) => {
                  setCompanyPassword(event.target.value);
                }}
                placeholder="password"
              ></input>
              <button
                onClick={() => {
                  joinCompany();
                }}
              >
                Join
              </button>
            </>
          ) : (
            //Company
            <>
              <br></br>
              <h1 style={{ margin: 0 }}> {CompanyData?.unitsData[0].name}</h1>

              {/* Controlls */}
              {CompanyData?.me?.userType == 'admin' &&
                <div className="profile-company-management-controlls">
                  <button
                    className="profile-company-management-input-button"
                    onClick={() => {
                      setStructureAction("user");
                    }}
                  >
                    Move user
                  </button>
                  <button
                    className="profile-company-management-input-button"
                    onClick={() => {
                      setStructureAction("unit");
                    }}
                  >
                    Create unit
                  </button>
                </div>
              }

              {/* User popup */}
              {StructureAction == "user" && (
                <div className="profile-company-management-inputs">
                  <button
                    className="profile-company-management-input-button-close"
                    onClick={() => {
                      setStructureAction("");
                    }}
                  >
                    X
                  </button>

                  <div className="profile-company-management-inputs-input">
                    <select
                      className="profile-company-management-input-select"
                      onChange={(e) => {
                        const id = parseInt(e.target.value, 10);
                        const unit = CompanyData.unitsData.find(
                          (u) => u.id === id
                        );
                        setMoveToUnit(unit);
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Wybierz jednostkę
                      </option>
                      {CompanyData?.access?.units?.map((unit) => {
                        const unitAccesed = CompanyData.unitsData.find(
                          (u) => u.id == unit
                        );

                        return (
                          <option key={unitAccesed.id} value={unitAccesed.id}>
                            {unitAccesed.name}
                          </option>
                        );
                      })}
                    </select>

                    <select
                      className="profile-company-management-input-select"
                      value={SelectedUser?.user_id ?? ""}
                      onChange={(e) => {
                        const id = parseInt(e.target.value, 10);
                        const usr = CompanyData.usersData.find(
                          (u) => u.user_id === id
                        );
                        setSelectedUser(usr);
                      }}
                    >
                      <option value="" disabled>
                        Wybierz użytkownika
                      </option>

                      {CompanyData?.access?.users
                        .filter((u) => u !== CurrentUser.userId)
                        .map((user) => {
                          const foundUser = CompanyData?.usersData.find(
                            (u) => u.user_id == user
                          );

                          return (
                            <>
                              <option
                                key={foundUser.user_id}
                                value={foundUser.user_id}
                              >
                                {foundUser.name}
                              </option>
                            </>
                          );
                        })}
                    </select>
                  </div>

                  <button
                    className="profile-company-management-input-button"
                    onClick={() => {
                      moveUnit();
                    }}
                  >
                    Change
                  </button>
                </div>
              )}

              {/* Structure popup */}
              {StructureAction == "unit" && (
                <div className="profile-company-management-inputs">
                  <button
                    className="profile-company-management-input-button-close"
                    onClick={() => {
                      setStructureAction("");
                    }}
                  >
                    X
                  </button>
                  <input
                    value={NewUnitName}
                    className="profile-company-management-input-text"
                    onChange={(e) => setNewUnitName(e.target.value)}
                    placeholder="Add New Unit"
                  />

                  <div className="profile-company-management-inputs-input">
                    <select
                      className="profile-company-management-input-select"
                      onChange={(e) =>
                        setNewUnitParent(parseInt(e.target.value, 10))
                      }
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Wybierz rodzica
                      </option>
                      {CompanyData?.access.units.map((unit) => {
                        const unitAccesed = CompanyData.unitsData.find(
                          (u) => u.id == unit
                        );

                        return (
                          <option key={unitAccesed.id} value={unitAccesed.id}>
                            {unitAccesed.name}
                          </option>
                        );
                      })}
                    </select>
                    <button
                      className="profile-company-management-input-button"
                      onClick={addNewUnit}
                    >
                      Add Unit
                    </button>
                  </div>
                </div>
              )}

              {/* Tree Render */}
              <div className="profile-company-tree">
                {CompanyData && renderUnits(rootUnits)}
                <br></br>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
