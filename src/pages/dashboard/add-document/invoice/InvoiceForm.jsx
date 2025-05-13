import { useEffect, useState } from "react";
import Input from "../../../../components/Input";
import { Upload, Plus } from "lucide-react";
import RenderInputs from "../../../../components/RenderInputs";

export default function InvoiceForm({ user, ocrData, setInvoiceData }) {
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
        label: "Client name",
        value: user?.firm_name,
        width: "100%",
        borderRadius: borderRadius,
      },
      {
        type: "text",
        label: "Client name",
        value: user?.firm_nip,
        width: "100%",
        borderRadius: borderRadius,
      },
      {
        type: "text",
        label: "Client name",
        value: user?.firm_address,
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
                <Input
                  type="text"
                  width="100%"
                  label="Service"
                  value={service.name}
                  setValue={(val) => {
                    const updated = [...services];
                    updated[index].name = val;
                    setServices(updated);
                  }}
                  borderRadius="10px"
                />

                <Input
                  type="text"
                  width="100%"
                  label="Price"
                  value={service.price}
                  setValue={(val) => {
                    const updated = [...services];
                    updated[index].price = val;
                    setServices(updated);
                  }}
                  borderRadius="10px"
                />

                <Input
                  type="button"
                  width="20%"
                  borderRadius="10px"
                  onClick={() => {
                    const updated = [...services];
                    updated.splice(index, 1);
                    setServices(updated);
                  }}
                >
                  -
                </Input>
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
