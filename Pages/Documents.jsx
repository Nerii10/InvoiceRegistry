//React
import { useState, useEffect } from "react";

//Styles
import "../Styles/Documents.css";

//Icons
import { LayoutTemplate, AlignJustify, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Documents({ Token }) {
  const ApiUrl = "http://localhost:3000";
  const [DocumentType, setDocumentType] = useState("invoices");
  const [DisplayStyle, setDisplayStyle] = useState("list");

  const [invoices, setInvoices] = useState([]);
  const [invoicesFiltered, setInvoicesFiltered] = useState([]);

  const [clients, setClients] = useState([]);
  const [clientsFiltered, setClientsFiltered] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [CurrentDocumentPage, setCurrentDocumentPage] = useState(1);
  const [Search, setSearch] = useState("");

  const navigate = useNavigate();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pl-PL", {
      timeZone: "Europe/Warsaw",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const calculateSum = (services) => {
    let price = 0;
    services.map((service, index) => {
      price = price + parseInt(service.price);
    });

    return price;
  };

  async function getInvoices(Select) {
    setLoading(true);
    setError(null);
    setInvoicesFiltered("");
    try {
      const url = new URL(`${ApiUrl}/invoices/all`);
      url.searchParams.append("page", Select ? Select : CurrentDocumentPage);
      url.searchParams.append("search", Select ? "" : Search);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setInvoices(result);
        setInvoicesFiltered(result);
        setLoading(false);
      } else {
        setError("Failed to fetch invoices");
        console.log("", "Failed to fetch invoices");
      }
    } catch (err) {
      setError("An error occurred while fetching invoices.", err);
    } finally {
      setLoading(false);
    }
  }

  async function getClients(Select) {
    setLoading(true);
    setError(null);
    setClientsFiltered("");
    try {
      const response = await fetch(
        `${ApiUrl}/clients/all?page=${
          Select ? Select : CurrentDocumentPage
        }&search=${Select ? "" : Search}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setClients(result);
        setClientsFiltered(result);
        setLoading(false);
      } else {
        setError("Failed to fetch clients");
      }
    } catch (err) {
      setError("An error occurred while fetching clients.", err);
    } 
  }

  //UseEffects
  useEffect(() => {
    if (Token) {
      if (DocumentType == "clients") {
        getClients();
      } else if (DocumentType == "invoices") {
        getInvoices();
      }
    }
  }, [Token, DocumentType]);

  useEffect(() => {
    setCurrentDocumentPage(invoices.page);
  }, [invoices]);

  useEffect(() => {
    console.log(error, '- error | null ');
  }, [error]);
  useEffect(() => {
    setCurrentDocumentPage(clients.page);
  }, [clients]);

  return (
    <>
      <div className="documents-container">
        <div className="documents-box">
          <div className="documents-mainpulations">
            <div className="documents-mainpulations-top-left">
              <select
                className="documents-mainpulations-top-left-select"
                style={{ color: "black" }}
                value={CurrentDocumentPage}
                onChange={(event) => {
                  setCurrentDocumentPage(parseInt(event.target.value));
                  DocumentType == "invoices"
                    ? getInvoices(parseInt(event.target.value))
                    : getClients(parseInt(event.target.value));
                }}
              >
                {!loading &&
                  (() => {
                    const options = [];
                    for (
                      let i = 1;
                      i <=
                      Math.ceil(
                        DocumentType == "invoices"
                          ? invoicesFiltered.total / 50
                          : clientsFiltered.total / 50
                      );
                      i++
                    ) {
                      options.push(
                        <option key={i} value={i}>
                          {i}
                        </option>
                      );
                    }
                    return options;
                  })()}

                {loading && <option value={0}>-</option>}

                {clientsFiltered.total == 0 && <option value={0}>-</option>}

                {invoicesFiltered.total == 0 && <option value={0}>-</option>}
              </select>
            </div>

            <div className="documents-mainpulations-top-right">
              <div className="documents-mainpulations-top-right-view">
                <button
                  onClick={() => {
                    setDisplayStyle("list");
                  }}
                  className={
                    DisplayStyle == "list"
                      ? "documents-mainpulations-button-active"
                      : "documents-mainpulations-button"
                  }
                >
                  <AlignJustify size={15} />
                </button>
                <button
                  onClick={() => {
                    setDisplayStyle("blocks");
                  }}
                  className={
                    DisplayStyle == "blocks"
                      ? "documents-mainpulations-button-active"
                      : "documents-mainpulations-button"
                  }
                >
                  <LayoutTemplate size={15} />
                </button>
              </div>
              .
              <div className="documents-mainpulations-top-right-type">
                <button
                  onClick={() => {
                    setDocumentType("invoices");
                  }}
                  className={
                    DocumentType == "invoices"
                      ? "documents-mainpulations-button-active"
                      : "documents-mainpulations-button"
                  }
                >
                  Invoices
                </button>
                <button
                  onClick={() => {
                    setDocumentType("contracts");
                  }}
                  className={
                    DocumentType == "contracts"
                      ? "documents-mainpulations-button-active"
                      : "documents-mainpulations-button"
                  }
                >
                  Contracts
                </button>
                <button
                  onClick={() => {
                    setDocumentType("clients");
                  }}
                  className={
                    DocumentType == "clients"
                      ? "documents-mainpulations-button-active"
                      : "documents-mainpulations-button"
                  }
                >
                  Clients
                </button>
              </div>
            </div>
          </div>

          <form
            className="document-manipulations-bottom"
            onSubmit={(e) => {
              e.preventDefault();
              DocumentType === "invoices" ? getInvoices() : getClients();
            }}
          >
            <input
              type="text"
              className="document-manipulations-bottom-input-text"
              value={Search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
            />
            <input
              type="submit"
              className="document-manipulations-bottom-input-button"
              value="Search"
            />
          </form>

          {DocumentType == "invoices" && (
            <div
              className={
                DisplayStyle == "list"
                  ? "documents-list"
                  : "documents-list-blocks"
              }
            >
              {DisplayStyle == "list" && (
                <>
                  <table className="invoice-table">
                    <thead>
                      <tr>
                        <th>Invoice Number</th>
                        <th>Date of Issue</th>
                        <th>Client</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoicesFiltered?.invoices?.map((invoice) => {
                        return (
                          <>
                            <tr
                              onClick={() => {
                                navigate(`/dashboard/invoice/${invoice?.invoice_number}`);
                              }}
                            >
                              <td>{invoice.invoice_number}</td>
                              <td>{formatDate(invoice.issue_date)}</td>
                              <td>{invoice.receiver_name}</td>
                              <td>{calculateSum(invoice.services)}zł</td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>

                  {loading && (
                    <>
                      <div className="invoices-loading">
                        <Loader className="invoices-loading-icon" />
                      </div>
                    </>
                  )}
                </>
              )}

              {DisplayStyle == "blocks" && (
                <>
                  {invoicesFiltered?.invoices?.map((invoice, index) => {
                    return (
                      <>
                        <div className="invoice-block-container">
                          <div className="invoice-block">
                            <div className="invoice-block-main">
                              <p>Invoice {invoice.invoice_number}</p>
                              <p>{formatDate(invoice.issue_date)}</p>
                            </div>

                            <div className="invoice-block-second">
                              <p>{invoice.receiver_name}</p>
                              <p>{invoice.receiver_address}</p>
                              <p>{invoice.receiver_nip}</p>
                            </div>

                            <div className="invoice-block-third">
                              <p>
                                {invoice.services.map((service, index) => {
                                  return (
                                    <>
                                      <div className="invoice-block-service">
                                        <p>{service.name} </p>
                                        <p>{service.price} </p>
                                      </div>
                                    </>
                                  );
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </>
              )}

              {invoicesFiltered.total == 0 && (
                <p style={{ width: "100%", textAlign: "center" }}>
                  {" "}
                  No results
                </p>
              )}

              {invoicesFiltered.total != 0 && (
                <p style={{ padding: "10px" }}>
                  {(CurrentDocumentPage - 1) * 50} -{" "}
                  {Math.min(CurrentDocumentPage * 50, invoices?.total)}
                </p>
              )}
            </div>
          )}

          {DocumentType == "clients" && (
            <div
              className={
                DisplayStyle == "list"
                  ? "documents-list"
                  : "documents-list-blocks"
              }
            >
              {DisplayStyle == "list" && (
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>Firm Name</th>
                      <th>Firm Address</th>
                      <th>NIP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientsFiltered?.clients?.map((client) => {
                      return (
                        <>
                          <tr>
                            <td>{client.name}</td>
                            <td>{client.address}</td>
                            <td>{client.nip}</td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {loading && (
                <>
                  <div className="invoices-loading">
                    <Loader className="invoices-loading-icon" />
                  </div>
                </>
              )}

              {DisplayStyle == "blocks" && (
                <>
                  {clientsFiltered?.clients?.map((client) => {
                    return (
                      <>
                        <div className="invoice-block-container">
                          <div className="invoice-block">
                            <div className="invoice-block-main">
                              <p>{client.name}</p>
                              <p>{client.address}</p>
                              <p>{client.nip}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </>
              )}

              {clientsFiltered.total == 0 && (
                <p style={{ width: "100%", textAlign: "center" }}>
                  {" "}
                  No results
                </p>
              )}

              {clientsFiltered?.total != 0 && (
                <p style={{ padding: "10px" }}>
                  {(CurrentDocumentPage - 1) * 50} -{" "}
                  {Math.min(CurrentDocumentPage * 50, clientsFiltered?.total)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
