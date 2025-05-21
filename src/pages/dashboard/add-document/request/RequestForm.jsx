import { useEffect, useState } from "react";
import RenderInputs from "../../../../components/RenderInputs";
import { useDocuments } from "../../../../hooks/useDocuments";
import { useUser } from "../../../../contexts/UserContext";
import { useCreateDocument } from "../../../../hooks/useCreateDocument";

export default function RequestForm({ requestData, setRequestData }) {
  const borderRadius = "10px";
  const required = true;

  const { token } = useUser();
  const { fetchDocs, data } = useDocuments({ token, type: "items" });
  
  useEffect(() => {
    console.log(requestData);
  }, [requestData]);

  useEffect(() => {
    fetchDocs();
  }, []);

  const clientInputs = [
    [
      {
        type: "select",
        required: required,
        width: "100%",
        borderRadius,
        label: "Item",
        options: data.data
          ? data.data.map((item) => ({ value: item.id, label: item.name }))
          : [],
        setValue: (e) => {
          setRequestData((prev) => ({ ...prev, item: e }));
        },
      },
      {
        type: "text",
        required: required,
        width: "100%",
        borderRadius,
        label: "Quantity",
        value: requestData?.quantity,
        setValue: (e) => {
          setRequestData((prev) => ({ ...prev, quantity: e }));
        },
      },
    ],
  ];

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
