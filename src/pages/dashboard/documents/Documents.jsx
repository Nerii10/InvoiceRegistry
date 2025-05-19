//Lib
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

//Styles
import "../../../styles/Documents.css";

//Components
import Input from "../../../components/Input";
import DashboardPageWrapper from "../DashboardPageWrapper";

//Icons
import {
  LayoutPanelTop,
  AlignJustify,
  Plus,
  Link,
  EllipsisVertical,
} from "lucide-react";

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
  const [sort, setSort] = useState({ date: "desc" });
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
  const clientTableHeaders = ["Name", "Address", "NIP"];
  const [filters, setFilters] = useState();
  const navigate = useNavigate();

  // Hooks
  const { token } = useUser();

  const { fetchDocs, data, loading } = useDocuments({
    token: token,
    type: documentType,
    page: currentPage,
    search: search,
    sort: sort,
    filters: filters,
  });

  // Displays
  const [invoiceFilters, setInvoiceFilters] = useState(() => {
    try {
      const stored = localStorage.getItem("invoiceFilters");
      return stored ? JSON.parse(stored) : invoiceTableHeaders;
    } catch {
      return invoiceTableHeaders;
    }
  });

  const [clientFilters, setClientFilters] = useState(() => {
    try {
      const stored = localStorage.getItem("clientFilters");
      return stored ? JSON.parse(stored) : clientFilters;
    } catch {
      return clientTableHeaders;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("invoiceFilters", JSON.stringify(invoiceFilters));
    } catch {
      console.warn("Nie udało się zapisać ustawień filtrów");
    }
  }, [invoiceFilters]);

  useEffect(() => {
    try {
      localStorage.setItem("clientFilters", JSON.stringify(clientFilters));
    } catch {
      console.warn("Nie udało się zapisać ustawień filtrów");
    }
  }, [clientFilters]);

  function exportToCSV(jsonData, filename = "data.csv") {
    if (!jsonData.length) {
      alert("Brak danych do eksportu");
      return;
    }

    const keys = Object.keys(jsonData[0]);
    const csvRows = [];

    // nagłówek
    csvRows.push(keys.join(","));

    // wiersze
    for (const row of jsonData) {
      const values = keys.map((key) => {
        let val = row[key] === null || row[key] === undefined ? "" : row[key];
        // ucieczka cudzysłowów i przecinków
        if (
          typeof val === "string" &&
          (val.includes(",") || val.includes('"'))
        ) {
          val = `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      });
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

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
  }, [token, documentType, currentPage, sort, filters]);

  return (
    <DashboardPageWrapper maxWidth={"1250px"}>
      {/* Controls */}
      {/* <button onClick={()=>{exportToCSV(data.invoices)}}>EXPORT</button> */}
      <section className="documents-controls">
        <section className="documents-controls-left">
          <Input
            type="select"
            width="auto"
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
          <p
            style={{
              margin: 0,
              width: "0px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <EllipsisVertical
              style={{ flexShrink: 0 }}
              size={15}
              stroke="gray"
            />
          </p>
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
            setValue={
              documentType == "invoices" ? setInvoiceFilters : setClientFilters
            }
            value={documentType == "invoices" ? invoiceFilters : clientFilters}
            height="30px"
            borderRadius="10px"
            type="multiselect"
            options={
              documentType == "invoices"
                ? invoiceTableHeaders
                : clientTableHeaders
            }
          ></Input>
          <Input
            type="filter"
            width="50px"
            height="30px"
            borderRadius="10px"
            options={[
              {
                type: "select",
                label: "Status - All",
                options: [
                  { value: "Ongoing", label: "Ongoing" },
                  { value: "Late", label: "Late" },
                  { value: "Paid", label: "Paid" },
                ],
                value: filters?.status,
                setValue: (val) =>
                  setFilters((prev) => ({ ...prev, status: val })),
              },
            ]}
          />
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
          onClick={() => {
            documentType == "invoices"
              ? navigate("/dashboard/add-document?document")
              : navigate("/dashboard/add-document?client");
          }}
          borderStyle="none"
          customStyle={{ borderRight: "1px var(--borderColor) solid" }}
        >
          <Plus />
        </Input>
        <div style={{ borderRight: "1px var(--borderColor) solid", flex: 1 }}>
          <Input
            type="text"
            width="100%"
            value={search}
            activeTextHidden={true}
            label={"Aa"}
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
          setSort={setSort}
          documentType={documentType}
          loading={loading}
          sort={sort}
          filters={documentType == "invoices" ? invoiceFilters : clientFilters}
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
