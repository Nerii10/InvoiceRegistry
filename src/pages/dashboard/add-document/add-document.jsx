//Lib
import { useState, useEffect } from "react";

//Components
import Input from "../../../components/Input";
import DashboardPageWrapper from "../DashboardPageWrapper";
import Loader from "../../../components/Loader";
import ErrorPopup from "../../../components/ErrorPopup.jsx";

//Styles
import "../../../styles/Add-Document.css";

//Icons
import { Upload, Plus } from "lucide-react";

//Hooks
import { useCreateDocument } from "../../../hooks/useCreateDocument";
import { useOcr } from "../../../hooks/useOcr.js";
import { useUser } from "../../../contexts/UserContext";
import { useCompany } from "../../../contexts/CompanyContext.jsx";
import InvoiceForm from "./invoice/InvoiceForm.jsx";

export default function AddDocument() {
  //States
  const [currentFile, setCurrentFile] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [fileURL, setFileURL] = useState(null);

  //Hooks
  const { token, user } = useUser();

  const { createDocument, loading, error, setError } = useCreateDocument({
    token: token,
  });

  const { data: companyData } = useCompany();

  const { ocrFile, data, loading: ocrLoading } = useOcr({ token });

  useEffect(() => {
    setError(null);
  }, [ocrLoading]);

  useEffect(() => {
    console.log(currentFile);
  }, [currentFile]);

  const Company = companyData?.me?.userUnit == null ? false : true;
  console.log(Company);
  console.log(companyData);
  return (
    <>
      <ErrorPopup
        error={
          Company
            ? error
            : {
                message:
                  "No company found. Please create one before adding documents.",
              }
        }
      />
      <DashboardPageWrapper maxWidth={"1250px"}>
        <Loader
          loading={loading || ocrLoading}
          error={error}
          size={30}
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
          <section className="add-document-controls">
            <Input
              type="file"
              label={"Scan File"}
              setValue={(e) => {
                console.log(e);
                setCurrentFile(e);
                ocrFile(e);
                const url = URL.createObjectURL(e);
                setFileURL(url);
              }}
              width="fit-content"
              borderRadius="10px"
            ></Input>

            <Input
              type="submit"
              disabled={!Company}
              width="fit-content"
              borderRadius="10px"
            >
              Save Invoice
            </Input>
          </section>
        </form>
      </DashboardPageWrapper>
      <br></br>
      <br></br>
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

      <br></br>
    </>
  );
}
