import { useEffect } from "react";
import RenderInputs from "../../../../components/RenderInputs";

export default function ClientForm({ ocrData, clientData, setClientData }) {
  const borderRadius = "10px";
  const required = true;
  const clientInputs = [
    [
      {
        type: "text",
        required: required,
        width: "100%",
        borderRadius,
        label: "Name",
        value: clientData?.name,
        setValue: (e) => {
          setClientData((prev) => ({ ...prev, name: e }));
        },
      },
      {
        type: "text",
        required: required,
        width: "100%",
        value: clientData?.address,
        borderRadius,
        label: "Address",
        setValue: (e) => {
          setClientData((prev) => ({ ...prev, address: e }));
        },
      },
      {
        type: "text",
        required: required,
        width: "100%",
        value: clientData?.nip,
        borderRadius,
        label: "NIP",
        setValue: (e) => {
          setClientData((prev) => ({ ...prev, nip: e }));
        },
      },
    ],
  ];

  useEffect(() => {
    setClientData((prev) => ({ ...prev, name: ocrData.clientName ?? "" }));
    setClientData((prev) => ({ ...prev, nip: ocrData.clientNip ?? "" }));
    setClientData((prev) => ({ ...prev, address: ocrData.clientAddress ?? "" }));
  }, [ocrData]);

  return (
    <section className="add-document-content-wrapper">
      <section className="add-document-content">
        <RenderInputs
          data={clientInputs}
          className={"add-document-input-container"}
        ></RenderInputs>
      </section>
    </section>
  );
}
