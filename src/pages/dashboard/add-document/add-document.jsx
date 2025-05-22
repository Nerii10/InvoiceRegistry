//Lib
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

//Components
import DashboardPageWrapper from "../DashboardPageWrapper";
import Loader from "../../../components/Loader";
import MessagePopup from "../../../components/MessagePopup.jsx";
import InvoiceForm from "./invoice/InvoiceForm.jsx";
import RenderInputs from "../../../components/RenderInputs.jsx";
import Input from "../../../components/Input.jsx";
import ClientForm from "./client/clientForm.jsx";
import OrderForm from "./order/OrderForm.jsx";
import RequestForm from "./request/RequestForm.jsx";
import ItemForm from "./item/ItemForm.jsx";

//Styles
import "../../../styles/Add-Document.css";

//Hooks
import { useCreateDocument } from "../../../hooks/useCreateDocument";
import { useOcr } from "../../../hooks/useOcr.js";
import { useUser } from "../../../contexts/UserContext";
import { useCompany } from "../../../contexts/CompanyContext.jsx";

export default function AddDocument() {
  const { token, user } = useUser();
  const {
    createDocument,
    addClient,
    addOrder,
    addRequest,
    addItem,
    message,
    loading,
  } = useCreateDocument({ token });
  const { data: companyData, loading: companyLoading } = useCompany();
  const { ocrFile, data, loading: ocrLoading } = useOcr({ token });
  const Company = companyData ? true : companyLoading ? null : false;
  const { search } = useLocation();
  const navigate = useNavigate();

  // Typy dokumentów
  const validTypes = ["Invoice", "Client", "Order", "Request", "Item"];

  // States
  const [currentFile, setCurrentFile] = useState(null);
  const [documentType, setDocumentType] = useState("Invoice");
  const [invoiceData, setInvoiceData] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [itemData, setItemData] = useState([{ name: "", desc: "" }]);
  const [orderData, setOrderData] = useState([null]);
  const [requestData, setRequestData] = useState([
    { quantity: null, item: null },
  ]);

  // Inicjalizacja typu dokumentu z linku
  useEffect(() => {
    const params = new URLSearchParams(search);
    const typeFromURL = params.entries().next().value?.[0]; // np. "client" z "?client"
    const capitalized =
      typeFromURL?.charAt(0).toUpperCase() +
      typeFromURL?.slice(1).toLowerCase();

    if (validTypes.includes(capitalized)) {
      setDocumentType(capitalized);
    }

    console.log("Search:", search, "→ type:", capitalized);
  }, [search]);

  // Aktualizacja URL po zmianie typu
  useEffect(() => {
    const params = new URLSearchParams(search);
    const typeFromURL = params.entries().next().value?.[0];
    const capitalized =
      typeFromURL?.charAt(0).toUpperCase() +
      typeFromURL?.slice(1).toLowerCase();

    if (validTypes.includes(capitalized)) {
      setDocumentType(capitalized);
    }

    console.log("Search:", search, "→ type:", capitalized);
  }, [search]);

  // 2. A ten useEffect zmienia search (nawiguje do nowego search)
  useEffect(() => {
    navigate(`?${documentType.toLowerCase()}`);
  }, [documentType]);

  const addDocumentSections = [
    <DashboardPageWrapper maxWidth={"1250px"} key="form-section">
      <Loader
        loading={loading || ocrLoading}
        error={message?.type === "error"}
        size={30}
        position={"center"}
        color={"black"}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          switch (documentType) {
            case "Invoice":
              createDocument({ invoiceData });
              break;
            case "Client":
              addClient({ clientData });
              break;
            case "Item":
              addItem({ itemData });
              break;
            case "Order":
              addOrder({ orderData });
              break;
            case "Request":
              addRequest({ requestData });
              break;
            default:
              break;
          }
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
            setValue={(e) => setDocumentType(e)}
            options={validTypes.map((type) => ({ value: type }))}
          />
        </section>

        {/* Form */}
        {(() => {
          const formComponents = {
            Invoice: (
              <InvoiceForm
                user={user}
                ocrData={data}
                companyData={companyData}
                setInvoiceData={setInvoiceData}
              />
            ),
            Client: (
              <ClientForm
                setClientData={setClientData}
                clientData={clientData}
                ocrData={data}
              />
            ),
            Order: (
              <OrderForm orderData={orderData} setOrderData={setOrderData} />
            ),
            Request: (
              <RequestForm
                requestData={requestData}
                setRequestData={setRequestData}
              />
            ),
            Item: <ItemForm itemData={itemData} setItemData={setItemData} />,
          };

          return (
            formComponents[documentType] || (
              <section className="add-document-content-wrapper">
                <p>Select document type to continue</p>
              </section>
            )
          );
        })()}

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

    // PDF preview
    fileURL && (
      <div className="add-document-frame" key="preview-section">
        <iframe
          src={fileURL}
          width="100%"
          height="100%"
          style={{ borderRadius: "var(--borderRadius)", border: "none" }}
          title="Podgląd PDF-a"
        />
      </div>
    ),

    // Wiadomość
    <MessagePopup
      key="popup-section"
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

  return <>{addDocumentSections.map((section) => section)}</>;
}
