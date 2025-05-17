import { useEffect, useState } from "react";
import Input from "../../../components/Input";
import { useUser } from "../../../contexts/UserContext";
import { useCompany } from "../../../contexts/CompanyContext";
import RenderInputs from "../../../components/RenderInputs";
import { Plus, KeyRound } from "lucide-react";
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        newUnit(newCompanyData);
      }}
    >
      {/* Empty‑state header */}
      <section className="add-document-header">
        <p>You don’t have a company yet</p>
      </section>

      {/* Tabs */}
      <RenderInputs
        className="add-document-header"
        style={{ padding: 0 }}
        data={[
          [
            {
              type: "button",
              active: selectedCompanyTab == "new",
              height: "30px",
              activeStyle: "1",
              borderRadius: "0px",
              width: "100%",
              borderStyle: "none",
              onClick: () => {
                setSelectedCompanyTab("new");
              },
              children: (
                <>
                  <Plus size={15} />
                  New
                </>
              ),
            },
            {
              active: selectedCompanyTab == "join",
              height: "30px",
              type: "button",
              activeStyle: "1",
              borderRadius: "0px",
              width: "100%",
              borderStyle: "none",
              onClick: () => {
                setSelectedCompanyTab("join");
              },
              children: (
                <>
                  <KeyRound size={15} />
                  Join
                </>
              ),
            },
          ],
        ]}
      />

      {/* New */}
      <section className="add-document-content-wrapper">
        <section className="add-document-content">
          <p className="section-title">
            {selectedCompanyTab == "join"
              ? "Join Existing Company"
              : "Create New Company"}
          </p>
          <div className="add-document-input-container">
            <RenderInputs
              className="add-document-input-container"
              data={
                selectedCompanyTab == "join"
                  ? [
                      [
                        {
                          type: "text",
                          width: "100%",
                          label: "Company Code",
                          required: true,
                          borderRadius: "10px",
                          value: newCompanyData?.code,
                          setValue: (e) =>
                            setNewCompanyData((prev) => ({
                              ...prev,
                              code: e,
                            })),
                        },
                        {
                          type: "text",
                          width: "100%",
                          label: "Password",
                          borderRadius: "10px",
                          required: true,
                          value: newCompanyData?.password,
                          setValue: (e) =>
                            setNewCompanyData((prev) => ({
                              ...prev,
                              password: e,
                            })),
                        },
                      ],
                    ]
                  : [
                      [
                        {
                          type: "text",
                          width: "100%",
                          label: "Company Name",
                          borderRadius: "10px",
                          required: true,
                          value: newCompanyData?.name,
                          setValue: (e) =>
                            setNewCompanyData((prev) => ({
                              ...prev,
                              name: e,
                            })),
                        },
                        {
                          type: "text",
                          width: "100%",
                          label: "Tax ID (Tax Number)",
                          borderRadius: "10px",
                          required: true,
                          value: newCompanyData?.nip,
                          setValue: (e) =>
                            setNewCompanyData((prev) => ({
                              ...prev,
                              nip: e,
                            })),
                        },
                        {
                          type: "text",
                          width: "100%",
                          label: "Address",
                          borderRadius: "10px",
                          required: true,
                          value: newCompanyData?.address,
                          setValue: (e) =>
                            setNewCompanyData((prev) => ({
                              ...prev,
                              address: e,
                            })),
                        },
                        {
                          type: "text",
                          width: "100%",
                          label: "Password",
                          borderRadius: "10px",
                          required: true,
                          value: newCompanyData?.password,
                          setValue: (e) =>
                            setNewCompanyData((prev) => ({
                              ...prev,
                              password: e,
                            })),
                        },
                      ],
                    ]
              }
            />
          </div>
        </section>
      </section>

      {/* Action buttons */}
      <section className="add-document-controls">
        <Input type="submit" width="100%" borderRadius="10px">
          {selectedCompanyTab == "join" ? "Join" : "Create"}
        </Input>
      </section>
    </form>
  );
}
