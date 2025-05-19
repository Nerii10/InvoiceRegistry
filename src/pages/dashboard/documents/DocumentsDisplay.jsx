import Loader from "../../../components/Loader.jsx";
import { X, Check, ClockAlert } from "lucide-react";
import { Reorder, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function DocumentStateDisplay({ invoice }) {
  const iconSize = 15;

  if (!invoice) return null;

  if (Number(invoice.amount) === 0) {
    return (
      <p className="invoice-status paid">
        <Check size={iconSize} />
      </p>
    );
  }

  const paid = Number(invoice.amount_paid) || 0;
  const total = Number(invoice.amount) || 0;
  const dueDate = new Date(invoice.due_date);
  const now = new Date();

  if (paid === 0) {
    return (
      <p className="invoice-status pending">
        <ClockAlert size={iconSize} />
      </p>
    );
  }

  if (paid > 0 && paid < total) {
    if (dueDate < now) {
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

  if (paid >= total) {
    return (
      <p className="invoice-status paid">
        <Check size={iconSize} />
      </p>
    );
  }

  return null;
}

export default function DocumentsDisplay({
  data,
  documentType,
  loading,
  filters: initialFilters,
  total,
}) {
  const navigate = useNavigate();
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
                <motion.tr
                  key={rowIndex}
                  onClick={() => {
                    navigate(`/dashboard/invoice/${invoice.id}`);
                  }}
                  layout
                >
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
                <motion.tr
                  onClick={() => {
                    navigate("dashboard/invoice");
                  }}
                  key={idx}
                  layout
                >
                  {filters.map((filter) => {
                    let cell;
                    switch (filter) {
                      case "Name":
                        cell = client.name;
                        break;
                      case "Address":
                        cell = client.address;
                        break;
                      case "NIP":
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

      {loading && <p className="empty-row">e</p>}

      <p className="no-results">
        {!loading ? total === 0 && "No results" : ""}
      </p>
    </>
  );
}
