import { useEffect, useState } from "react";
import Input from "../../../components/Input";
import Tree from "../../../components/Tree";
import "../../../styles/User.css";

import { motion } from "framer-motion";
import RenderInputs from "../../../components/RenderInputs";
export default function CompanyPanel({
  company,
  newUnit,
  moveUnit,
  removeUnit,
  promoteUnit,
  setShowExitPopup,
  loading,
}) {
  //Admin
  const [selectedAction, setSelectedAction] = useState("New");
  const [selectedUserData, setSelectedUserData] = useState({
    user: null,
    unit: null,
    type: null,
  });
  const [selectedUnitData, setSelectedUnitData] = useState();
  const [newUnitData, setNewUnitData] = useState({ name: null, parent: null });

  //Popup
  const accessedUnits = company?.unitsData.filter((u) =>
    company?.access?.units?.includes(u.id)
  );
  const accessedUsers = company?.usersData.filter((u) =>
    company?.access?.users?.includes(u.user_id)
  );

  

  return (
    <section>
      {/* Empty‑state header */}
      <section className="add-document-header">
        <p>{company?.me?.companyCode}</p>

        <Input
          onClick={() => {
            setShowExitPopup((i) => !i);
          }}
          borderRadius="15px"
          type="button"
          width="fit-content"
        >
          {company?.me?.userType == "owner" ? "Delete Company" : "Leave"}
        </Input>
      </section>

      {/* Admin / Owner */}
      {(company?.me?.userType == "admin" ||
        company?.me?.userType == "owner") && (
        <section>
          <section
            className="add-document-header"
            style={{ padding: 0, gap: 0 }}
          >
            <Input
              active={selectedAction == "New"}
              height="30px"
              activeStyle="1"
              type="button"
              borderRadius="0px"
              borderStyle="none"
              width="50%"
              onClick={() => {
                setSelectedAction("New");
              }}
            >
              New
            </Input>
            <Input
              active={selectedAction == "Move"}
              height="30px"
              activeStyle="1"
              type="button"
              borderRadius="0px"
              width="50%"
              borderStyle="none"
              onClick={() => {
                setSelectedAction("Move");
              }}
            >
              Move
            </Input>

            {/* Tylko owner */}
            {company?.me?.userType == "owner" && (
              <>
                <Input
                  active={selectedAction == "Remove"}
                  height="30px"
                  activeStyle="1"
                  type="button"
                  borderRadius="0px"
                  width="50%"
                  borderStyle="none"
                  onClick={() => {
                    setSelectedAction("Remove");
                  }}
                >
                  Remove
                </Input>

                <Input
                  active={selectedAction == "Promote"}
                  height="30px"
                  activeStyle="1"
                  type="button"
                  borderRadius="0px"
                  width="50%"
                  borderStyle="none"
                  onClick={() => {
                    setSelectedAction("Promote");
                  }}
                >
                  Promote
                </Input>
              </>
            )}
          </section>

          {selectedAction == "New" && (
            <div>
              <RenderInputs
                form={true}
                onSubmit={() => {
                  newUnit(newUnitData);
                }}
                data={[
                  [
                    {
                      type: "text",
                      setValue: (e) => {
                        setNewUnitData((prev) => ({ ...prev, name: e }));
                      },
                      borderRadius: "0px",
                      label: "New Unit Name",
                      required: true,
                      activeTextHidden: true,
                      borderStyle: "none",
                      value: newUnitData.name,
                    },
                    {
                      type: "select",
                      borderRadius: "0px",
                      required: true,
                      customStyle: {
                        border: "none",
                        borderLeft: "1px var(--borderColor) solid",
                      },
                      value: newUnitData.parent,
                      label: "Select Parent Unit",
                      options: [
                        ...(accessedUnits?.map((unit) => ({
                          // rozłóż dynamiczne opcje
                          value: unit.id,
                          label: unit.name,
                        })) || []),
                      ],
                      setValue: (e) => {
                        setNewUnitData((prev) => ({ ...prev, parent: e }));
                      },
                    },
                  ],
                  [
                    {
                      type: "submit",
                      borderRadius: "0px",
                      label: "New Unit Name",
                      borderStyle: "none",
                      disabled: loading,
                      children: "Add",
                    },
                  ],
                ]}
                className={"add-document-inputrender-container"}
              />
            </div>
          )}

          {selectedAction == "Move" && (
            <div>
              <RenderInputs
                form={true}
                onSubmit={() => {
                  moveUnit(selectedUserData);
                }}
                data={[
                  [
                    {
                      type: "select",
                      setValue: (e) => {
                        setSelectedUserData((prev) => ({ ...prev, unit: e }));
                      },
                      borderRadius: "0px",
                      label: "Select Unit",
                      required: true,
                      options: [
                        ...(accessedUnits?.map((unit) => ({
                          value: unit.id,
                          label: unit.name,
                        })) || []),
                      ],
                      borderStyle: "none",
                      value: selectedUserData.unit,
                    },
                    {
                      type: "select",
                      setValue: (e) => {
                        setSelectedUserData((prev) => ({ ...prev, user: e }));
                      },
                      borderRadius: "0px",
                      options: [
                        ...(accessedUsers?.map((user) => ({
                          value: user.user_id,
                          label: user.name,
                        })) || []),
                      ],
                      label: "Select User",
                      required: true,
                      customStyle: {
                        border: "none",
                        borderLeft: "1px var(--borderColor) solid",
                      },
                      value: selectedUserData.user,
                    },
                  ],

                  [
                    {
                      type: "submit",
                      borderRadius: "0px",
                      disabled: loading,
                      customStyle: {
                        border: "none",
                      },
                      children: "Move",
                    },
                  ],
                ]}
                className={"add-document-inputrender-container"}
              />
            </div>
          )}

          {selectedAction == "Remove" && (
            <div>
              <RenderInputs
                form={true}
                onSubmit={() => {
                  removeUnit({ selectedUnitData });
                }}
                data={[
                  [
                    {
                      type: "select",
                      setValue: (value) => {
                        const found =
                          company?.usersData?.find(
                            (u) => `user-${u.user_id}` === value
                          ) ||
                          company?.unitsData?.find(
                            (u) => `unit-${u.id}` === value
                          );
                        setSelectedUnitData(found || null);
                      },
                      borderRadius: "0px",
                      options: [
                        ...(accessedUsers?.map((user) => ({
                          value: `user-${user.user_id}`,
                          label: `${user.name} - ${user.type}`,
                        })) || []),
                        ...(accessedUnits?.map((unit) => ({
                          value: `unit-${unit.id}`,
                          label: `${unit.name} - unit`,
                        })) || []),
                      ],
                      label: "Select unit or user",
                      required: true,
                      borderStyle: "none",
                      value: selectedUnitData
                        ? selectedUnitData.user_id
                          ? `user-${selectedUnitData.user_id}`
                          : `unit-${selectedUnitData.id}`
                        : "",
                    },
                  ],
                  [
                    {
                      type: "submit",
                      borderRadius: "0px",
                      disabled: loading,
                      width: "100%",
                      borderStyle: "none",
                      children: "Remove",
                    },
                  ],
                ]}
                className={"add-document-inputrender-container"}
              />
            </div>
          )}

          {selectedAction == "Promote" && (
            <div>
              <RenderInputs
                form={true}
                onSubmit={() => {
                  promoteUnit({ selectedUserData });
                }}
                data={[
                  [
                    {
                      type: "select",
                      setValue: (e) => {
                        setSelectedUserData((prev) => ({ ...prev, user: e }));
                      },
                      borderRadius: "0px",
                      options: [
                        ...(accessedUsers?.map((user) => ({
                          value: user.user_id,
                          label: user.name,
                        })) || []),
                      ],
                      label: "Select User",
                      required: true,
                      customStyle: {
                        border: "none",
                        borderLeft: "1px var(--borderColor) solid",
                      },
                      value: selectedUserData.user,
                    },
                    {
                      type: "select",
                      setValue: (e) => {
                        setSelectedUserData((prev) => ({ ...prev, type: e }));
                      },
                      borderRadius: "0px",
                      options: [{ value: "user" }, { value: "admin" }],
                      label: "New Role",
                      required: true,
                      customStyle: {
                        border: "none",
                        borderLeft: "1px var(--borderColor) solid",
                      },
                      value: selectedUserData.type,
                    },
                  ],
                  [
                    {
                      type: "submit",
                      borderRadius: "0px",
                      disabled: loading,
                      width: "100%",
                      borderStyle: "none",
                      children: "Promote",
                    },
                  ],
                ]}
                className={"add-document-inputrender-container"}
              />
            </div>
          )}
        </section>
      )}

      {/* Tree */}
      <section className="add-document-content-wrapper">
        <section className="add-document-content">
          <div className="add-document-input-container">
            <Tree
              setNewUnitData={setNewUnitData}
              setSelectedAction={setSelectedAction}
              moveUnit={moveUnit}
              unitsData={company?.unitsData}
              usersData={company?.usersData}
            />
          </div>
        </section>
      </section>

      {/* Action buttons */}
      <section className="add-document-controls">
        <p></p>
      </section>
    </section>
  );
}
