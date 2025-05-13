//--
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

//Styles
import "../Styles/DocumentsAdd.css";

//Icons
import { Upload, Plus, Minus, Loader } from "lucide-react";

export default function DocumentsAdd({ CurrentUser, Token, CompanyData }) {
  const ApiUrl = "http://localhost:3000";

  //InvoiceInput
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState();
  const [dueDate, setDueDate] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverNIP, setReceiverNIP] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [services, setServices] = useState([{ name: "", price: "" }]);

  //PageSettings
  const [documentType, setDocumentType] = useState("invoice");
  const [Loading, setLoading] = useState(false);

  //Clients
  const [clients, setClients] = useState([]);
  const [clientsFiltered, setClientsFiltered] = useState([]);

  //InvoiceServices
  function addServiceField() {
    setServices((prev) => [...prev, { name: "", price: "" }]);
  }

  function removeServiceField(index) {
    setServices((prev) => prev.filter((_, i) => i !== index));
  }

  function handleServiceChange(index, field, value) {
    setServices((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  }

  //Server communication
  async function getClients() {
    try {
      const response = await fetch(`${ApiUrl}/clients/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        setClients(result);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function addInvoice(e) {
    e.preventDefault();

    const invoiceData = {
      invoiceNumber,
      issueDate,
      dueDate,
      receiverName,
      receiverNIP,
      receiverAddress,
      services,
    };
    console.log(invoiceData);
    setLoading(true);
    try {
      const response = await fetch(`${ApiUrl}/invoices/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify(invoiceData),
      });

      if (response.ok) {
        const result = await response.json();
        setTimeout(() => {
          console.log("Invoice added successfully", result);
          setInvoiceNumber("");
          setIssueDate("");
          setDueDate("");
          setReceiverName("");
          setReceiverNIP("");
          setReceiverAddress("");
          setLoading(false);
          setServices([{ name: "", price: "" }]);
        }, 1000);
      } else {
        const error = await response.json();
        console.log("Error:", error);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    } catch (err) {
      console.log("Error:", err);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }

  async function addClient(e) {
    e.preventDefault();

    const clientData = {
      name: receiverName,
      nip: receiverNIP,
      address: receiverAddress,
      userId: CurrentUser.userId,
    };
    console.log(clientData);
    setLoading(true);

    try {
      const response = await fetch(`${ApiUrl}/clients/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify(clientData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Client added successfully", result);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } else {
        const error = await response.json();
        console.log("Error:", error);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    } catch (err) {
      console.log("Error:", err);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }

  //Use effects
  useEffect(() => {
    if (CurrentUser) {
      if (Token && documentType === "invoice") {
        getClients();
      }
    }
  }, [CurrentUser, Token, documentType]);

  useEffect(() => {
    setInvoiceNumber("");
    setIssueDate("");
    setDueDate("");
    setReceiverName("");
    setReceiverNIP("");
    setReceiverAddress("");
    setServices([{ name: "", price: "" }]);
  }, [documentType]);

  useEffect(() => {
    setClientsFiltered(
      clients?.clients?.filter((c) =>
        c.name.toLowerCase().includes(receiverName.toLowerCase())
      )
    );
  }, [receiverName, clients]);

  return (
    <>
      <AnimatePresence>
        {Loading && (
          <motion.div
            className="invoice-add-loading"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <Loader
              size={45}
              stroke="white"
              className="invoices-loading-icon"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="invoice-add-container">
        <div className="invoice-add-box" style={{ overflow: "auto" }}>
          <div
            className="invoice-add-input"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className="invoice-add-input-left"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                padding: "10px",
              }}
            >
              <p style={{ width: "50%" }}>Add Document</p>
              <select
                className="invoice-add-input-select"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                style={{ color: "black" }}
              >
                <option value="invoice">Invoice</option>
                <option value="contract">Contract</option>
                <option value="client">Client</option>
              </select>
            </div>
          </div>

          {documentType === "invoice" && (
            <form onSubmit={addInvoice}>
              <div className="invoice-add-input-conainer">
                <div
                  className="invoice-add-input-right"
                  style={{ width: "100%" }}
                >
                  <p>Invoice Number</p>
                  <input
                    className="invoice-add-input-input"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    type="number"
                  />
                </div>

                <div className="invoice-add-input">
                  <div className="invoice-add-input-left">
                    <p>Issue Date</p>
                    <input
                      className="invoice-add-input-input"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      type="date"
                    />
                  </div>

                  <div className="invoice-add-input-left">
                    <p>Due Date</p>
                    <input
                      className="invoice-add-input-input"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      type="date"
                    />
                  </div>
                </div>

                <div className="invoice-add-input">
                  <div className="invoice-add-input-left">
                    <p>Seller</p>
                    <input
                      disabled={true}
                      className="invoice-add-input-input"
                      value={CompanyData?.me?.companyName || "No copmany"}
                      type="text"
                    />
                  </div>

                  <div className="invoice-add-input-right">
                    <p>Seller NIP</p>
                    <input
                      disabled={true}
                      className="invoice-add-input-input"
                      value={CompanyData?.me?.companyNip || "0000"}
                      type="number"
                    />
                  </div>

                  <div className="invoice-add-input-right">
                    <p>Seller Address</p>
                    <input
                      disabled={true}
                      className="invoice-add-input-input"
                      value={CompanyData?.me?.companyAddress || "No copmany"}
                      type="text"
                    />
                  </div>
                </div>

                <div className="invoice-add-input">
                  <div
                    className="invoice-add-input-left"
                    style={{ position: "relative", zIndex: 2 }}
                  >
                    <div className="invoice-add-input-wrapper">
                      <p>Client</p>
                      <input
                        className="invoice-add-input-input"
                        value={receiverName}
                        onChange={(e) => setReceiverName(e.target.value)}
                        type="text"
                      />
                      <div className="invoice-add-input-search">
                        {clientsFiltered?.map((client, index) => (
                          <button
                            key={index}
                            type="button"
                            style={{
                              height: "50px",
                              flexShrink: 0,
                              color: "black",
                              borderBottom: "1px var(--BorderColor) solid",
                              backgroundColor: "var(--AccentColor)",
                            }}
                            onClick={() => {
                              setReceiverAddress(client.address);
                              setReceiverNIP(client.nip);
                              setReceiverName(client.name);
                            }}
                          >
                            {client.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="invoice-add-input-right">
                    <p>Client NIP</p>
                    <input
                      className="invoice-add-input-input"
                      value={receiverNIP}
                      onChange={(e) => setReceiverNIP(e.target.value)}
                      type="number"
                    />
                  </div>

                  <div className="invoice-add-input-right">
                    <p>Client Address</p>
                    <input
                      className="invoice-add-input-input"
                      value={receiverAddress}
                      onChange={(e) => setReceiverAddress(e.target.value)}
                      type="text"
                    />
                  </div>
                </div>

                <div
                  className="invoice-add-input"
                  style={{ flexDirection: "column", gap: "10px" }}
                >
                  <p>Services</p>
                  {services.map((svc, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <input
                        className="invoice-add-input-input"
                        placeholder="Service Name"
                        value={svc.name}
                        onChange={(e) =>
                          handleServiceChange(idx, "name", e.target.value)
                        }
                        type="text"
                      />
                      <input
                        className="invoice-add-input-input"
                        placeholder="Price"
                        value={svc.price}
                        onChange={(e) =>
                          handleServiceChange(idx, "price", e.target.value)
                        }
                        type="number"
                      />
                      <button
                        type="button"
                        onClick={() => removeServiceField(idx)}
                        className="invoice-add-button"
                        style={{
                          padding: "0 8px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Minus size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="invoice-add-button"
                    onClick={addServiceField}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Plus size={16} /> Add Service
                  </button>
                </div>
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px",
                  boxSizing: "border-box",
                }}
              >
                <button
                  type="button"
                  className="invoice-add-button"
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <Upload size={16} /> Upload File
                </button>
                <button type="submit" className="invoice-add-button">
                  Save Invoice
                </button>
              </div>
            </form>
          )}

          {documentType === "client" && (
            <div className="client-add-input-conainer">
              <form onSubmit={addClient}>
                <div className="invoice-add-input">
                  <div className="invoice-add-input-left">
                    <p>Client Name</p>
                    <input
                      className="invoice-add-input-input"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      type="text"
                    />
                  </div>

                  <div className="invoice-add-input-right">
                    <p>Client NIP</p>
                    <input
                      className="invoice-add-input-input"
                      value={receiverNIP}
                      onChange={(e) => setReceiverNIP(e.target.value)}
                      type="number"
                    />
                  </div>

                  <div className="invoice-add-input-right">
                    <p>Client Address</p>
                    <input
                      className="invoice-add-input-input"
                      value={receiverAddress}
                      onChange={(e) => setReceiverAddress(e.target.value)}
                      type="text"
                    />
                  </div>
                </div>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    padding: "10px 0px",
                    boxSizing: "border-box",
                  }}
                >
                  <button type="submit" className="invoice-add-button">
                    Save Client
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
