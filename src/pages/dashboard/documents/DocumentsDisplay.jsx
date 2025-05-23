import Loader from "../../../components/Loader.jsx";
import { X, Check, ClockAlert, ChevronDown, ChevronUp } from "lucide-react";
import { Reorder, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function DocumentStateDisplay({ invoice }) {
  const iconSize = 15;

  if (!invoice) return null;

  const paid = Number(invoice.paid) || 0;
  const total = Number(invoice.amount) || 0;
  const dueDate = new Date(invoice.due_date);
  const now = new Date();

  if (invoice.amount == "0") {
    return (
      <p className="invoice-status paid">
        <Check size={iconSize} />
      </p>
    );
  } else {
    if (paid === 0) {
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

    if (paid > 0 && paid < total) {
      if (dueDate < now) {
        return (
          <p className="invoice-status late">
            <X size={iconSize} />
          </p>
        );
      } else {
        return (
          <p className="invoice-status pending-paid">
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
  }

  return null;
}

export default function DocumentsDisplay({
  data,
  documentType,
  loading,
  filters: initialFilters,
  total,
  setSort,
  sort,
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
                    {filter == "Due Date" ? (
                      <a
                        className="sort_button"
                        onClick={() =>
                          setSort((prev) => ({
                            ...prev,
                            date: prev.date === "desc" ? "asc" : "desc",
                          }))
                        }
                      >
                        {filter}{" "}
                        {sort.date == "asc" ? <ChevronUp /> : <ChevronDown />}
                      </a>
                    ) : (
                      filter
                    )}
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
                                (sum, srv) => Number(sum) + Number(srv.price),
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
                <motion.tr key={idx} layout>
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

        {documentType === "warehouse" && (
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
              {data?.data?.map((item, idx) => (
                <motion.tr key={idx} layout>
                  {filters.map((filter) => {
                    let cell;
                    switch (filter) {
                      case "Item":
                        cell = item.name;
                        break;
                      case "Quantity":
                        cell = item.quantity;
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

        {documentType === "items" && (
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
              {data?.data &&
                data.data.length > 0 &&
                data.data.map((data, idx) => (
                  <motion.tr key={idx} layout>
                    {filters.map((filter) => {
                      let cell;
                      switch (filter) {
                        case "Item":
                          cell = data.name;
                          break;
                        case "Description":
                          cell = data.description;
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

        {documentType === "orders" && (
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
              {data &&
                data[0]?.order_number &&
                data?.map((order, idx) => (
                  <motion.tr key={idx} layout>
                    {filters.map((filter) => {
                      let cell;
                      switch (filter) {
                        case "Order Number":
                          cell = order.order_number;
                          break;
                        case "Ordered By":
                          cell = order.ordered_by;
                          break;
                        case "RequestID":
                          cell = order.related_request_id;
                          break;
                        case "Status":
                          if (order.status === "completed") {
                            cell = (
                              <div className="invoice-status-container">
                                <p className="invoice-status paid">
                                  <Check size={15} />
                                </p>
                              </div>
                            );
                          } else if (order.status === "paid") {
                            cell = (
                              <div className="invoice-status-container">
                                <p className="invoice-status pending">
                                  <ClockAlert size={15} />
                                </p>
                              </div>
                            );
                          } else {
                            cell = null;
                          }
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

        {documentType === "requests" && (
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
              {data &&
                data.length > 0 &&
                data.map((order, orderIdx) =>
                  order.items && order.items.length > 0 ? (
                    order.items.map((item, itemIdx) => (
                      <motion.tr
                        onClick={() => {
                          navigate(`/dashboard/request/${order.id}`);
                        }}
                        key={`${orderIdx}-${itemIdx}`}
                        layout
                      >
                        {filters.map((filter) => {
                          let cell;
                          switch (filter) {
                            case "RequestID":
                              // Wyświetl item_id
                              cell = item.request_id || "Brak ID";
                              break;
                            case "Item":
                              // Wyświetl item_id
                              cell = item.item_name || item.id || "Brak ID";
                              break;
                            case "Quantity":
                              cell = item.quantity ?? "Brak ilości";
                              break;
                            case "Status":
                              if (order.status === "completed") {
                                cell = (
                                  <div className="invoice-status-container">
                                    <p className="invoice-status paid">
                                      <Check size={15} />
                                    </p>
                                  </div>
                                );
                              } else if (
                                order.status === "paid" ||
                                order.status === "pending"
                              ) {
                                cell = (
                                  <div className="invoice-status-container">
                                    <p className="invoice-status pending">
                                      <ClockAlert size={15} />
                                    </p>
                                  </div>
                                );
                              } else {
                                cell = null;
                              }
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
                    ))
                  ) : (
                    <motion.tr key={orderIdx}>
                      <motion.td colSpan={filters.length} layout>
                        Brak pozycji
                      </motion.td>
                    </motion.tr>
                  )
                )}
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
