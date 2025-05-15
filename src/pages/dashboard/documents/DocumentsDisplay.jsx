import Loader from "../../../components/Loader.jsx";
import { X, Check, ClockAlert } from "lucide-react";
import { Reorder, motion } from "framer-motion";
import { useEffect, useState } from "react";

function DocumentStateDisplay({ invoice }) {
  const iconSize = 15;
  if (invoice.status) {
    return (
      <p className="invoice-status paid">
        <Check size={iconSize} />
      </p>
    );
  } else {
    if (new Date(invoice.due_date) < new Date()) {
      return (
        <p className="invoice-status late">
          <X size={iconSize} />
        </p>
      );
    } else {
      return (
        <p className="invoice-status pending">
          <ClockAlert size={iconSize} />
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
      <Loader loading={loading} onlyLoader />

      <table className="documents-display-table">
        {documentType === "invoices" && (
          <>
            <thead>
              <Reorder.Group
                axis="x"
                values={filters}
                onReorder={setFilters}
                as="tr"
              >
                {filters.map((filter) => (
                  <Reorder.Item
                    as="th"
                    key={filter}
                    value={filter}
                    dragListener
                    dragMomentum={false}
                    style={{ userSelect: "none", padding: "8px 12px" }}
                  >
                    {filter}
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </thead>

            <tbody>
              {data?.invoices?.map((invoice, rowIndex) => (
                <motion.tr key={rowIndex} layout>
                  {filters.map((filter) => {
                    let cell;
                    switch (filter) {
                      case "Invoice Number":
                        cell = invoice.invoice_number;
                        break;
                      case "Date of Issue":
                        cell = new Date(
                          invoice.issue_date
                        ).toLocaleDateString();
                        break;
                      case "Due Date":
                        cell = new Date(invoice.due_date).toLocaleDateString();
                        break;
                      case "User":
                        cell = invoice.username;
                        break;
                      case "Client":
                        cell = invoice.receiver_name;
                        break;
                      case "Amount":
                        cell =
                          invoice.services.length !== 0
                            ? invoice.services.reduce(
                                (sum, srv) => sum + srv.price,
                                0
                              ) + " zł"
                            : "-";
                        break;
                      case "Status":
                        cell = (
                          <div className="invoice-status-container">
                            <DocumentStateDisplay invoice={invoice} />
                          </div>
                        );
                        break;
                      default:
                        cell = null;
                    }
                    return (
                      <motion.td key={filter} layout>
                        {cell}
                      </motion.td>
                    );
                  })}
                </motion.tr>
              ))}
            </tbody>
          </>
        )}

        {documentType === "clients" && (
          <>
            <thead>
              <Reorder.Group
                axis="x"
                values={filters}
                onReorder={setFilters}
                as="tr"
              >
                {filters.map((filter) => (
                  <Reorder.Item
                    as="th"
                    key={filter}
                    value={filter}
                    dragListener
                    dragMomentum={false}
                    style={{ userSelect: "none", padding: "8px 12px" }}
                  >
                    {filter}
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </thead>

            <tbody>
              {data?.clients?.map((client, idx) => (
                <motion.tr key={idx} layout whileHover={{ scale: 1.01 }}>
                  {filters.map((filter) => {
                    let cell;
                    switch (filter) {
                      case "Client":
                        cell = client.name;
                        break;
                      case "Address":
                        cell = client.address;
                        break;
                      case "Nip":
                        cell = client.nip;
                        break;
                      default:
                        cell = null;
                    }
                    return (
                      <motion.td key={filter} layout>
                        {cell}
                      </motion.td>
                    );
                  })}
                </motion.tr>
              ))}
            </tbody>
          </>
        )}
      </table>

      {loading && <p className="empty-row"> </p>}

      {!loading && total === 0 && <p className="no-results">No results</p>}
    </>
  );
}
