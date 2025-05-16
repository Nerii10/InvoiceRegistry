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

export default function AddDocument() {
  //States
  const [currentFile, setCurrentFile] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [fileURL, setFileURL] = useState(null);

  //Hooks
  const { token, user } = useUser();
  const { createDocument, message, loading } = useCreateDocument({
    token: token,
  });
  const { data: companyData, loading: companyLoading } = useCompany();
  const { ocrFile, data, loading: ocrLoading } = useOcr({ token });
  const Company = companyData ? true : companyLoading ? null : false;
  
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
          createDocument({ invoiceData });
        }}
      >
        {/* Header */}
        <section className="add-document-header">
          <p>Add Document</p>
        </section>

        {/* Form */}
        <InvoiceForm
          user={user}
          ocrData={data}
          companyData={companyData}
          setInvoiceData={setInvoiceData}
        ></InvoiceForm>

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
                children: "Save Invoice",
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
    console.log(companyLoading);
  }, [companyLoading]);

  return <>{addDocumentSections.map((section) => section)}</>;
}
