//Lib
import { useEffect, useState } from "react";

//Styles
import "../../../styles/Documents.css";

//Components
import Input from "../../../components/Input";
import DashboardPageWrapper from "../DashboardPageWrapper";

//Icons
import { LayoutPanelTop, AlignJustify } from "lucide-react";

//Hooks
import { useDocuments } from "../../../hooks/useDocuments";
import { useUser } from "../../../contexts/UserContext.jsx";
import DocumentsDisplay from "./DocumentsDisplay.jsx";

export default function Documents() {
  //States
  const [currentPage, setcurrentPage] = useState(1);
  const [availablePages, setavailablePages] = useState([]);
  const [viewMode, setviewMode] = useState("list");
  const [documentType, setdocumentType] = useState("invoices");
  const [search, setSearch] = useState("");
  const iconSize = 15;

  //Hooks
  const { token } = useUser();

  const { fetchDocs, data, loading, error } = useDocuments({
    token: token,
    type: documentType,
    page: currentPage,
    search: search,
  });

  // PageOptions
  useEffect(() => {
    setcurrentPage(data.page);

    let options = [];

    for (let i = 1; i <= Math.ceil(data.total / 50); i++) {
      options.push({ value: i });
    }
    if (options.length == 0) {
      options.push({ value: data?.page });
    }
    setavailablePages(options);
  }, [data]);

  // FetchingData
  useEffect(() => {
    if (token) {
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
