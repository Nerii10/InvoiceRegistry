import { Children, useEffect, useState } from "react";
import Input from "../../../components/Input";
import Tree from "../../../components/Tree";
import "../../../styles/User.css";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import RenderInputs from "../../../components/RenderInputs";
export default function CompanyPanel({
  company,
  newUnit,
  moveUnit,
  removeUnit,
  leaveCompany,
  loading,
}) {
  //Admin
  const [selectedAction, setSelectedAction] = useState("New");
  const [selectedUserData, setSelectedUserData] = useState({
    user: null,
    unit: null,
  });
  const [selectedUnitData, setSelectedUnitData] = useState();
  const [newUnitData, setNewUnitData] = useState({ name: null, parent: null });

  //Popup
  const [showExitPopup, setShowExitPopup] = useState(false);

  return (
    <section>
      {/* Empty‑state header */}
      <section className="add-document-header">
        <p>{company?.me?.companyName}</p>

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

      {/* Popup */}
      <AnimatePresence mode="wait">
        {showExitPopup && (
          <motion.div
            className="exit-popup-wrapper"
            initial={{ scale: 0 }}
            animate={showExitPopup && { scale: 1 }}
            exit={{ scale: 0 }}
          >
            <p className="exit-popup-text">
              {company?.me?.userType === "owner"
                ? "Are you sure you want to delete the organization? This action will permanently remove all invoices and data associated with your company."
                : "Are you sure you want to leave the organization? You will lose access to all units and invoices associated with this company."}
            </p>

            <div className="exit-poput-button">
              <Input
                onClick={() => {
                  setShowExitPopup((o) => !o);
                }}
                width="45%"
                maxWidth="200px"
                borderRadius="50px"
                height="50px"
                type="button"
              >
                No, Keep my company
              </Input>
              <Input
                width="45%"
                maxWidth="200px"
                borderRadius="50px"
                height="50px"
                type="button"
                onClick={() => {
                  leaveCompany();
                }}
              >
                Im sure, delete my company
              </Input>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TO MA BYC KOMPONENT - Company unit manager */}
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
              type="button"
              borderRadius="0px"
              disabled={loading}
              width="50%"
              borderStyle="none"
              onClick={() => {
                setSelectedAction("New");
              }}
            >
              New
            </Input>
            <Input
              active={selectedAction == "Move"}
              height="30px"
              type="button"
              borderRadius="0px"
              width="50%"
              disabled={loading}
              borderStyle="none"
              onClick={() => {
                setSelectedAction("Move");
              }}
            >
              Move
            </Input>

            {company?.me?.userType == "owner" && (
              <Input
                active={selectedAction == "Remove"}
                height="30px"
                type="button"
                borderRadius="0px"
                width="50%"
                disabled={loading}
                borderStyle="none"
                onClick={() => {
                  setSelectedAction("Remove");
                }}
              >
                Remove
              </Input>
            )}
          </section>

          {selectedAction == "New" && (
            <div>
              <RenderInputs
                data={[
                  [
                    {
                      type: "text",
                      setValue: (e) => {
                        setNewUnitData((prev) => ({ ...prev, name: e }));
                      },
                      borderRadius: "0px",
                      label: "New Unit Name",
                      borderStyle: "none",
                      value: newUnitData.name,
                    },
                    {
                      type: "select",
                      borderRadius: "0px",
                      label: "New Unit Name",
                      customStyle: {
                        border: "none",
                        borderLeft: "1px var(--borderColor) solid",
                      },
                      value: newUnitData.parent,
                      options: [
                        { value: "", label: "Select Unit" }, // domyślna pozycja
                        ...(company?.unitsData?.map((unit) => ({
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
                      type: "button",
                      borderRadius: "0px",
                      label: "New Unit Name",
                      borderStyle: "none",
                      disabled: loading,
                      children: "Add",
                      onClick: () => {
                        newUnit(newUnitData);
                      },
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
                data={[
                  [
                    {
                      type: "select",
                      setValue: (e) => {
                        setSelectedUserData((prev) => ({ ...prev, unit: e }));
                      },
                      borderRadius: "0px",
                      options: [
                        { value: "", label: "Select unit" },
                        ...(company?.unitsData?.map((unit) => ({
                          value: unit.id,
                          label: unit.name,
                        })) || []),
                      ],
                      label: "Select Unit",
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
                        { value: "", label: "Select User" },
                        ...(company?.usersData?.map((user) => ({
                          value: user.user_id,
                          label: user.name,
                        })) || []),
                      ],
                      label: "Select Unit",
                      customStyle: {
                        border: "none",
                        borderLeft: "1px var(--borderColor) solid",
                      },
                      value: selectedUserData.user,
                    },
                  ],

                  [
                    {
                      type: "button",
                      borderRadius: "0px",
                      disabled: loading,
                      customStyle: {
                        border: "none",
                      },
                      onClick: () => {
                        moveUnit(selectedUserData);
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
                        { value: "", label: "Select unit or user" },
                        ...(company?.usersData?.map((user) => ({
                          value: `user-${user.user_id}`,
                          label: `${user.name} - ${user.type}`,
                        })) || []),
                        ...(company?.unitsData?.map((unit) => ({
                          value: `unit-${unit.id}`,
                          label: `${unit.name} - unit`,
                        })) || []),
                      ],
                      label: "Select Unit Or User",
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
                      type: "button",
                      borderRadius: "0px",
                      disabled: loading,
                      width: "100%",
                      borderStyle: "none",
                      onClick: () => {
                        removeUnit({ selectedUnitData });
                      },
                      children: "Remove",
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
