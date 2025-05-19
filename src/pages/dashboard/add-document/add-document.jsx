//Lib
import { useState, useEffect } from "react";

//Components
import DashboardPageWrapper from "../DashboardPageWrapper";
import Loader from "../../../components/Loader";
import MessagePopup from "../../../components/MessagePopup.jsx";

//Styles
import "../../../styles/Add-Document.css";

//Hooks
import { useCreateDocument } from "../../../hooks/useCreateDocument";
import { useOcr } from "../../../hooks/useOcr.js";
import { useUser } from "../../../contexts/UserContext";
import { useCompany } from "../../../contexts/CompanyContext.jsx";
import InvoiceForm from "./invoice/InvoiceForm.jsx";
import RenderInputs from "../../../components/RenderInputs.jsx";
import Input from "../../../components/Input.jsx";
import ClientForm from "./client/clientForm.jsx";
import { useLocation, useNavigate } from "react-router-dom";

export default function AddDocument() {
  //Hooks
  const { token, user } = useUser();
  const { createDocument, addClient, message, loading } = useCreateDocument({
    token: token,
  });
  const { data: companyData, loading: companyLoading } = useCompany();
  const { ocrFile, data, loading: ocrLoading } = useOcr({ token });
  const Company = companyData ? true : companyLoading ? null : false;
  const { search } = useLocation();
  const navigate = useNavigate();
  //States
  const [currentFile, setCurrentFile] = useState(null);
  const [documentType, setDocumentType] = useState("Invoice");
  const [invoiceData, setInvoiceData] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [fileURL, setFileURL] = useState(null);

  const addDocumentSections = [
    <DashboardPageWrapper maxWidth={"1250px"}>
      <Loader
        loading={loading || ocrLoading}
        error={message?.type == "error"}
        size={30}
        position={"center"}
        color={"black"}
      ></Loader>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          documentType == "Invoice"
            ? createDocument({ invoiceData })
            : addClient({ clientData });
        }}
      >
        {/* Header */}
        <section className="add-document-header">
          <p>Add Document</p>
          <Input
            type={"select"}
            required={true}
            width={"150px"}
            borderRadius="10px"
            label="Document Type"
            value={documentType}
            setValue={(e) => {
              setDocumentType(e);
            }}
            options={[{ value: "Invoice" }, { value: "Client" }]}
          />
        </section>

        {/* Form */}
        {documentType == "Invoice" ? (
          <InvoiceForm
            user={user}
            ocrData={data}
            companyData={companyData}
            setInvoiceData={setInvoiceData}
          ></InvoiceForm>
        ) : documentType == "Client" ? (
          <ClientForm
            setClientData={setClientData}
            clientData={clientData}
            ocrData={data}
          />
        ) : (
          <section className="add-document-content-wrapper">
            <p>Select document type to continue</p>
          </section>
        )}

        {/* Controls */}
        <RenderInputs
          className="add-document-controls"
          data={[
            [
              {
                type: "file",
                label: <>Scan File</>,
                width: "fit-content",
                borderRadius: "10px",
                disabled: loading,
                setValue: (e) => {
                  console.log(e);
                  setCurrentFile(e);
                  ocrFile(e);
                  const url = URL.createObjectURL(e);
                  setFileURL(url);
                },
              },
              {
                type: "submit",
                disabled: loading || !Company,
                width: "fit-content",
                borderRadius: "10px",
                children: `Save ${documentType}`,
              },
            ],
          ]}
        />
      </form>
    </DashboardPageWrapper>,

    <>
      {fileURL && (
        <div className="add-document-frame">
          <iframe
            src={fileURL}
            width="100%"
            height="100%"
            style={{ borderRadius: "var(--borderRadius)", border: "none" }}
            title="Podgląd PDF-a"
          />
        </div>
      )}
    </>,

    <MessagePopup
      message={
        !companyLoading &&
        (Company
          ? message
          : {
              message:
                "No company found. Please create one before adding documents.",
              type: "error",
            })
      }
      loading={companyLoading}
    />,
  ];

  useEffect(() => {
    if (search == "?client") {
      setDocumentType("Client");
    }
    if (search == "?invoice") {
      setDocumentType("Invoice");
    }
  }, []);

  useEffect(() => {
    navigate(`?client${documentType.toLowerCase()}`);
  }, [documentType]);

  return <>{addDocumentSections.map((section) => section)}</>;
}
