import { useEffect, useState } from "react";
import Input from "../../../../components/Input";
import { Upload, Plus, X } from "lucide-react";
import RenderInputs from "../../../../components/RenderInputs";
import { useUser } from "../../../../contexts/UserContext";
import { useDocuments } from "../../../../hooks/useDocuments";

export default function InvoiceForm({ ocrData, setInvoiceData, companyData }) {
  const today = new Date().toISOString().split("T")[0];

  //Invoice data
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState(today);
  const [dueDate, setDueDate] = useState("");
  const [services, setServices] = useState([{ name: "", price: "" }]);

  //Client Data
  const [clientName, setClientName] = useState("");
  const [clientNip, setClientNip] = useState("");
  const [clientAddress, setClientAddress] = useState("");

  const { token } = useUser();
  const { serachForClients, data } = useDocuments({ token });

  const [searchData, setSearchData] = useState([]);
  //SetInvoiceData
  useEffect(() => {
    setInvoiceData({
      invoiceNumber,
      issueDate,
      dueDate,
      services,
      clientName,
      clientNip,
      clientAddress,
    });
  }, [
    invoiceNumber,
    issueDate,
    dueDate,
    services,
    clientName,
    clientNip,
    clientAddress,
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (clientName.trim() !== "") {
        serachForClients(clientName);
      } else {
        setSearchData([])
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [clientName]);

  useEffect(() => {
    if(data?.clients[0]?.name != clientName)
    {
      setSearchData(data);
    }
  }, [data]);

  //OCR
  useEffect(() => {
    setInvoiceNumber(ocrData.invoiceNumber ?? "");
    setClientName(ocrData.clientName ?? "");
    setClientNip(ocrData.clientNip ?? "");
    setClientAddress(ocrData.clientAddress ?? "");
    setIssueDate(ocrData.issueDate ?? today);
    setDueDate(ocrData.dueDate ?? "");
    setServices(ocrData.services ?? services);
  }, [ocrData]);

  //InvoiceInputs
  const borderRadius = "10px";
  const required = true;
  const invoiceInputSections = [
    [
      {
        type: "text",
        label: "Invoice number",
        value: invoiceNumber,
        setValue: setInvoiceNumber,
        width: "100%",
        required: required,
        borderRadius: borderRadius,
      },
      {
        type: "date",
        label: "Issue date",
        value: issueDate,
        setValue: setIssueDate,
        width: "100%",
        required: required,
        borderRadius: borderRadius,
      },
      {
        type: "date",
        label: "Due date",
        value: dueDate,
        setValue: setDueDate,
        width: "100%",
        required: required,
        borderRadius: borderRadius,
      },
    ],
    [
      {
        type: "text",
        label: "Company name",
        value: companyData?.me?.companyName || "No company Name",
        width: "100%",
        borderRadius: borderRadius,
      },
      {
        type: "text",
        label: "Company NIP",
        value: companyData?.me?.companyNip || "No company Nip",
        width: "100%",
        borderRadius: borderRadius,
      },
      {
        type: "text",
        label: "Company Address",
        value: companyData?.me?.companyAddress || "No company Address",
        width: "100%",
        borderRadius: borderRadius,
      },
    ],
    [
      {
        type: "text",
        label: "Client name",
        value: clientName,
        setValue: setClientName,
        width: "100%",
        required: required,
        borderRadius: borderRadius,
      },
      {
        type: "text",
        label: "Client NIP",
        value: clientNip,
        setValue: setClientNip,
        width: "100%",
        required: required,
        borderRadius: borderRadius,
      },
      {
        type: "text",
        label: "Client Address",
        value: clientAddress,
        setValue: setClientAddress,
        width: "100%",
        required: required,
        borderRadius: borderRadius,
      },
    ],
  ];

  return (
    <section className="add-document-content-wrapper">
      <section className="add-document-content">
        <RenderInputs
          data={invoiceInputSections}
          className={"add-document-input-container"}
        ></RenderInputs>
        <div
          className="search-clients"
          style={
            searchData.length != 0
              ? { padding: "10px", border: "1px var(--borderColor) solid" }
              : { padding: 0, border: "none" }
          }
        >
          {searchData?.clients?.map((client) => {
            return (
              <a
                onClick={() => {
                  setSearchData([]);
                  setClientAddress(client.address);
                  setClientName(client.name);
                  setClientNip(client.nip);
                }}
                className="search-client-input"
              >
                {client.name} - {client.nip}
              </a>
            );
          })}
        </div>
        {/* Services */}
        <div
          className="add-document-input-container"
          style={{ justifyContent: "center", flexDirection: "column" }}
        >
          {services.map((service, index) => {
            return (
              <div
                key={index}
                className="add-document-input-container"
                style={{ padding: "0px 15%" }}
              >
                <RenderInputs
                  className="add-document-input-container"
                  data={[
                    [
                      {
                        type: "text",
                        width: "100%",
                        label: "Service",
                        value: service.name,
                        setValue: (val) => {
                          const updated = [...services];
                          updated[index].name = val;
                          setServices(updated);
                        },
                        borderRadius: "10px",
                      },
                      {
                        type: "text",
                        width: "100%",
                        label: "Price",
                        value: service.price,
                        setValue: (val) => {
                          const updated = [...services];
                          updated[index].price = val;
                          setServices(updated);
                        },
                        borderRadius: "10px",
                      },
                      {
                        type: "button",
                        width: "20%",
                        borderRadius: "10px",
                        onClick: () => {
                          const updated = [...services];
                          updated.splice(index, 1);
                          setServices(updated);
                        },
                        children: <X size={20} />,
                      },
                    ],
                  ]}
                />
              </div>
            );
          })}
          <Input
            type="button"
            width="fit-content"
            borderRadius="10px"
            onClick={() => {
              setServices((prev) => {
                return [...prev, { name: "", price: "" }];
              });
            }}
          >
            <Plus size={20} /> Add Service
          </Input>
        </div>
      </section>
    </section>
  );
}
