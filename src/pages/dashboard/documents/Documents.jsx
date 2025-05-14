//Lib
import { useEffect, useState } from "react";

//Styles
import "../../../styles/Documents.css";

//Components
import Input from "../../../components/Input";
import DashboardPageWrapper from "../DashboardPageWrapper";

//Icons
import { LayoutPanelTop, AlignJustify, Plus, Link } from "lucide-react";

//Hooks
import { useDocuments } from "../../../hooks/useDocuments";
import { useUser } from "../../../contexts/UserContext.jsx";
import DocumentsDisplay from "./DocumentsDisplay.jsx";
import { useNavigate } from "react-router-dom";

export default function Documents() {
  //States
  const [currentPage, setcurrentPage] = useState(1);
  const [availablePages, setavailablePages] = useState([{ value: 1 }]);
  const [viewMode, setviewMode] = useState("list");
  const [documentType, setdocumentType] = useState("invoices");
  const [search, setSearch] = useState("");
  const iconSize = 15;
  const invoiceTableHeaders = [
    "Invoice Number",
    "Date of Issue",
    "Due Date",
    "User",
    "Client",
    "Status",
    "Amount",
  ];
  const navigate = useNavigate();

  // Hooks
  const { token } = useUser();

  const { fetchDocs, data, loading } = useDocuments({
    token: token,
    type: documentType,
    page: currentPage,
    search: search,
  });

  // Filters
  const [filters, setFilters] = useState(() => {
    try {
      const stored = localStorage.getItem("filters");
      return stored ? JSON.parse(stored) : invoiceTableHeaders;
    } catch {
      return invoiceTableHeaders;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("filters", JSON.stringify(filters));
    } catch {
      console.warn("Nie udało się zapisać ustawień filtrów");
    }
  }, [filters]);

  // PageOptions
  useEffect(() => {
    if (token) {
      let options = [];

      for (let i = 1; i <= Math.ceil(data.total / 50); i++) {
        options.push({ value: i });
      }
      if (options.length == 0) {
        options.push({ value: data?.page });
      }
      setavailablePages(options);
    }
  }, [data]);

  // FetchingData
  useEffect(() => {
    if (token) {
      console.log("tw");
      fetchDocs();
    }
  }, [token, documentType, currentPage]);

  return (
    <DashboardPageWrapper maxWidth={"1250px"}>
      {/* Controls */}
      <section className="documents-controls">
        <section className="documents-controls-left">
          <Input
            type="select"
            width="30px"
            height="30px"
            value={currentPage}
            disabled={loading}
            options={availablePages}
            setValue={(e) => {
              setcurrentPage(e);
            }}
            borderRadius="10px"
          ></Input>
        </section>
        <section className="documents-controls-right">
          <Input
            type="button"
            width="fit-content"
            height="30px"
            borderRadius="10px"
            disabled={loading}
            active={viewMode == "list"}
            onClick={() => {
              setviewMode("list");
            }}
          >
            <AlignJustify size={iconSize} />
          </Input>
          <Input
            type="button"
            active={viewMode == "blocks"}
            width="fit-content"
            height="30px"
            disabled={loading}
            borderRadius="10px"
            onClick={() => {
              setviewMode("blocks");
            }}
          >
            <LayoutPanelTop size={iconSize} />
          </Input>
          <p style={{ margin: 0 }}>-</p>
          <Input
            type="button"
            disabled={loading}
            width="fit-content"
            height="30px"
            borderRadius="10px"
            active={documentType == "invoices"}
            onClick={() => {
              setdocumentType("invoices");
            }}
          >
            Invoices
          </Input>
          <Input
            type="button"
            disabled={loading}
            width="fit-content"
            height="30px"
            active={documentType == "clients"}
            borderRadius="10px"
            onClick={() => {
              setdocumentType("clients");
            }}
          >
            Clients
          </Input>
          <Input
            width="50px"
            setValue={setFilters}
            value={filters}
            height="30px"
            borderRadius="10px"
            type="multiselect"
            options={invoiceTableHeaders}
          ></Input>
        </section>
      </section>

      {/* Search */}
      <form
        className="documents-search"
        onSubmit={(e) => {
          e.preventDefault();
          fetchDocs();
        }}
      >
        <Input
          type="button"
          width="50px"
          borderRadius="0px"
          onClick={()=>{navigate('/dashboard/add-document')}}
          borderStyle="none"
          customStyle={{borderRight:"1px var(--borderColor) solid"}}
        >
          <Plus />
        </Input>
        <div style={{ borderRight: "1px var(--borderColor) solid", flex: 1 }}>
          <Input
            type="text"
            width="100%"
            value={search}
            label={"..."}
            setValue={(e) => {
              setSearch(e);
            }}
            borderRadius="0px"
            borderStyle="none"
          ></Input>
        </div>
        <Input
          type="button"
          onClick={() => {
            fetchDocs();
          }}
          width="fit-content"
          borderRadius="0px"
          borderStyle="none"
        >
          Search
        </Input>
      </form>

      {/* Display */}
      <section className="documents-display">
        <DocumentsDisplay
          data={data}
          documentType={documentType}
          loading={loading}
          filters={filters}
          total={data.total}
        />
      </section>
      {/* Details */}
      {!loading && data?.total != 0 && currentPage && (
        <section className="documents-details">
          <p style={{ padding: "10px" }}>
            {(currentPage - 1) * 50} - {Math.min(currentPage * 50, data?.total)}
          </p>
        </section>
      )}
    </DashboardPageWrapper>
  );
}
