import { useEffect, useState } from "react";
import Input from "../../../components/Input";
import { useUser } from "../../../contexts/UserContext";
import { useCompany } from "../../../contexts/CompanyContext";

export default function CompanySetup() {
  const [selectedCompanyTab, setSelectedCompanyTab] = useState("new");
  const [newCompanyData, setNewCompanyData] = useState({
    name: "",
    nip: "",
    address: "",
    password: "",
    code: "",
  });

  useEffect(() => {
    setNewCompanyData({
      name: "",
      nip: "",
      address: "",
      password: "",
      code: "",
    });
  }, [selectedCompanyTab]);

  const { token } = useUser();
  const { newUnit } = useCompany({ token });
  
  return (
    <section>
      {/* Empty‑state header */}
      <section className="add-document-header">
        <p>You don’t have a company yet</p>
      </section>

      {/* Tabs */}
      <section className="add-document-header" style={{ padding: 0 }}>
        <Input
          active={selectedCompanyTab == "new"}
          height="30px"
          type="button"
          borderRadius="0px"
          width="50%"
          borderStyle="none"
          onClick={() => {
            setSelectedCompanyTab("new");
          }}
        >
          New
        </Input>
        <Input
          active={selectedCompanyTab == "join"}
          height="30px"
          type="button"
          borderRadius="0px"
          width="50%"
          borderStyle="none"
          onClick={() => {
            setSelectedCompanyTab("join");
          }}
        >
          Join
        </Input>
      </section>

      {/* New */}
      <section className="add-document-content-wrapper">
        <section className="add-document-content">
          {/* Create new company */}
          {selectedCompanyTab == "new" && (
            <>
              <p className="section-title">Create New Company</p>
              <div className="add-document-input-container">
                <Input
                  type="text"
                  width="100%"
                  label="Company Name"
                  borderRadius="10px"
                  value={newCompanyData?.name}
                  setValue={(e) => {
                    setNewCompanyData((prev) => ({ ...prev, name: e }));
                  }}
                />
                <Input
                  type="text"
                  width="100%"
                  label="Tax ID (Tax Number)"
                  borderRadius="10px"
                  value={newCompanyData?.nip}
                  setValue={(e) => {
                    setNewCompanyData((prev) => ({ ...prev, nip: e }));
                  }}
                />
                <Input
                  type="text"
                  width="100%"
                  label="Address"
                  borderRadius="10px"
                  value={newCompanyData?.address}
                  setValue={(e) => {
                    setNewCompanyData((prev) => ({ ...prev, address: e }));
                  }}
                />
                <Input
                  type="text"
                  width="100%"
                  label="Password"
                  borderRadius="10px"
                  value={newCompanyData?.password}
                  setValue={(e) => {
                    setNewCompanyData((prev) => ({ ...prev, password: e }));
                  }}
                />
              </div>
            </>
          )}

          {/* Join existing company */}
          {selectedCompanyTab == "join" && (
            <>
              <p className="section-title">Join Existing Company</p>
              <div className="add-document-input-container">
                <Input
                  type="text"
                  width="100%"
                  label="Company Code"
                  borderRadius="10px"
                  value={newCompanyData?.code}
                  setValue={(e) => {
                    setNewCompanyData((prev) => ({ ...prev, code: e }));
                  }}
                />
                <Input
                  type="text"
                  width="100%"
                  label="Password"
                  borderRadius="10px"
                  value={newCompanyData?.password}
                  setValue={(e) => {
                    setNewCompanyData((prev) => ({ ...prev, password: e }));
                  }}
                />
              </div>
            </>
          )}
        </section>
      </section>

      {/* Action buttons */}
      <section className="add-document-controls">
        <Input
          type="button"
          width="100%"
          borderRadius="10px"
          onClick={() => {
            newUnit(newCompanyData);
          }}
        >
          {selectedCompanyTab == "join" ? "Join" : "Create"}
        </Input>
      </section>
    </section>
  );
}
