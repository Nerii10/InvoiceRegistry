import { useEffect } from "react";
import RenderInputs from "../../../../components/RenderInputs";

export default function ItemForm({ setItemData, itemData }) {
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
        value: itemData?.name,
        setValue: (e) => {
          setItemData((prev) => ({ ...prev, name: e }));
        },
      },
      {
        type: "number",
        required: required,
        width: "100%",
        borderRadius,
        label: "Net Price",
        value: itemData?.netPrice,
        setValue: (e) => {
          setItemData((prev) => ({ ...prev, netPrice: e }));
        },
      },
    ],
    [
      {
        type: "text",
        required: required,
        width: "100%",
        borderRadius,
        label: "Description",
        value: itemData?.desc,
        setValue: (e) => {
          setItemData((prev) => ({ ...prev, desc: e }));
        },
      },
      {
        type: "number",
        required: required,
        width: "100%",
        borderRadius,
        label: "Gross Price",
        value: itemData?.grossPrice,
        setValue: (e) => {
          setItemData((prev) => ({ ...prev, grossPrice: e }));
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
