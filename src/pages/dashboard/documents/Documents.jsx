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
  const warehouseTableHeaders = ["Item", "Quantity"];
  const itemsTableHeader = ["Item", "Description"];
  const ordersTableHearder = [
    "Order Number",
    "RequestID",
    "Ordered By",
    "Status",
  ];
  const requestsTableHeaders = ["RequestID", "Status", "Item", "Quantity"];

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
  function useLocalFilter(key, defaultValue) {
    const [filter, setFilter] = useState(() => {
      try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
      } catch {
        return defaultValue;
      }
    });

    useEffect(() => {
      try {
        localStorage.setItem(key, JSON.stringify(filter));
      } catch {
        console.warn(`Nie udało się zapisać ustawień filtrów dla ${key}`);
      }
    }, [key, filter]);

    return [filter, setFilter];
  }
  const [invoiceFilters, setInvoiceFilters] = useLocalFilter(
    "invoiceFilters",
    invoiceTableHeaders
  );

  const [clientFilters, setClientFilters] = useLocalFilter(
    "clientFilters",
    clientTableHeaders
  );
  const [warehouseFilters, setWarehouseFilters] = useLocalFilter(
    "warehouseFilters",
    warehouseTableHeaders
  );
  const [orderFilters, setOrderFilters] = useLocalFilter(
    "orderFilters",
    ordersTableHearder
  );
  const [itemFilters, setItemFilters] = useLocalFilter(
    "itemFilters",
    itemsTableHeader
  );
  const [requestFilters, setRequestFilters] = useLocalFilter(
    "requestFilters",
    requestsTableHeaders
  );

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
            type="select"
            disabled={loading}
            width="fit-content"
            height="30px"
            active={documentType == "clients"}
            borderRadius="10px"
            value={documentType}
            setValue={(e) => {
              setdocumentType(e);
            }}
            options={[
              { value: "invoices" },
              { value: "clients" },
              { value: "warehouse" },
              { value: "orders" },
              { value: "requests" },
              { value: "items" },
            ]}
          />
          {(() => {
            const config = {
              invoices: {
                setValue: setInvoiceFilters,
                value: invoiceFilters,
                options: invoiceTableHeaders,
              },
              clients: {
                setValue: setClientFilters,
                value: clientFilters,
                options: clientTableHeaders,
              },
              warehouse: {
                setValue: setWarehouseFilters,
                value: warehouseFilters,
                options: warehouseTableHeaders,
              },
              orders: {
                setValue: setOrderFilters,
                value: orderFilters,
                options: ordersTableHearder,
              },
              items: {
                setValue: setItemFilters,
                value: itemFilters,
                options: itemsTableHeader,
              },
              requests: {
                setValue: setRequestFilters,
                value: requestFilters,
                options: requestsTableHeaders,
              },
            };

            const current = config[documentType] || {
              setValue: () => {},
              value: [],
              options: [],
            };

            return (
              <Input
                width="50px"
                height="30px"
                borderRadius="10px"
                type="multiselect"
                setValue={current.setValue}
                value={current.value}
                options={current.options}
              />
            );
          })()}

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
            navigate(`/dashboard/add-document?${documentType}`);
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
          filters={
            documentType == "invoices"
              ? invoiceFilters
              : documentType == "clients"
              ? clientFilters
              : documentType == "warehouse"
              ? warehouseFilters
              : documentType == "requests"
              ? requestFilters
              : documentType == "items"
              ? itemFilters
              : documentType == "orders"
              ? orderFilters
              : invoiceFilters
          }
          total={data.total}
        />
      </section>
      {/* Details */}
      {!loading && data?.total != 0 && currentPage && (
        <section className="documents-details">
          <p style={{ padding: "10px" }}>
            {data?.total != undefined &&
              `${(currentPage - 1) * 50} - ${Math.min(
                currentPage * 50,
                data?.total
              )}`}
          </p>
        </section>
      )}
    </DashboardPageWrapper>
  );
}
