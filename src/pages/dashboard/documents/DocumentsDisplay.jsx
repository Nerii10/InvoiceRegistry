import Loader from "../../../components/Loader.jsx";
import { X, Check, ClockAlert } from "lucide-react";
import { Reorder } from "framer-motion";
import { useEffect, useState } from "react";

function DocumentStateDispaly({ invoice }) {
  const icon_size = 15;
  if (invoice.status) {
    return (
      <p className="invoice-status paid">
        <Check size={icon_size} />
      </p>
    );
  } else {
    if (new Date(invoice.due_date) < new Date()) {
      return (
        <p className="invoice-status late">
          <X size={icon_size} />
        </p>
      );
    } else {
      return (
        <p className="invoice-status pending">
          <ClockAlert size={icon_size} />
        </p>
      );
    }
  }
}

export default function DocumentsDisplay({
  data,
  documentType,
  loading,
  filters: initialFilters,
  total,
}) {
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return (
    <>
      <table className="documents-display-table">
        <Loader loading={loading} onlyLoader={true}></Loader>

        {documentType == "invoices" && (
          <>
            <thead>
              <Reorder.Group
                axis="x"
                values={filters || []}
                onReorder={setFilters}
                as="tr"
              >
                {filters?.map((filter) => (
                  <Reorder.Item
                    as="th"
                    key={filter}
                    value={filter}
                    className="cursor-grab"
                  >
                    {filter}
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </thead>
            <tbody>
              {data?.invoices?.map((invoice, index) => (
                <tr key={index}>
                  {filters?.map((filter) => {
                    if (filter === "Invoice Number") {
                      return <td key={filter}>{invoice.invoice_number}</td>;
                    }
                    if (filter === "Date of Issue") {
                      return (
                        <td key={filter}>
                          {new Date(invoice.issue_date).toLocaleDateString()}
                        </td>
                      );
                    }
                    if (filter === "Due Date") {
                      return (
                        <td key={filter}>
                          {new Date(invoice.due_date).toLocaleDateString()}
                        </td>
                      );
                    }
                    if (filter === "User") {
                      return <td key={filter}>{invoice.username}</td>;
                    }
                    if (filter === "Client") {
                      return <td key={filter}>{invoice.receiver_name}</td>;
                    }
                    if (filter === "Amount") {
                      return (
                        <td key={filter}>
                          {invoice.services.length !== 0
                            ? Number(
                                invoice.services.reduce(
                                  (total, value) => total + value.price,
                                  0
                                )
                              ).toFixed(2) + " zł"
                            : "-"}
                        </td>
                      );
                    }
                    if (filter === "Status") {
                      return (
                        <td key={filter}>
                          <div className="invoice-status-container">
                            <DocumentStateDispaly invoice={invoice} />
                          </div>
                        </td>
                      );
                    }
                    return null;
                  })}
                </tr>
              ))}
            </tbody>
          </>
        )}

        {documentType == "clients" && (
          <>
            <thead>
              <tr>
                <th>Client</th>
                <th>Address</th>
                <th>Nip</th>
              </tr>
            </thead>
            <tbody>
              {data?.clients?.map((client, index) => (
                <tr key={index}>
                  <td>{client.name}</td>
                  <td>{client.address}</td>
                  <td>{client.nip}</td>
                </tr>
              ))}
            </tbody>
          </>
        )}
      </table>

      {loading && (
        <p
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "transparent",
          }}
        >
          -
        </p>
      )}

      {!loading && total == 0 && (
        <p
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          No results
        </p>
      )}
    </>
  );
}
