import { useState } from "react";
import RenderInputs from "../../../../components/RenderInputs";
import Input from "../../../../components/Input";

export default function ItemForm({ setItemData, itemData }) {
  const borderRadius = "10px";
  const required = true;

  // Dodaj nowy element
  const addNewItem = () => {
    setItemData((prev) => [...prev, { name: "", desc: "" }]);
  };

  // Zmień wartość inputa
  const handleChange = (index, key, value) => {
    const updated = [...itemData];
    updated[index][key] = value;
    setItemData(updated);
  };

  // Usuń element
  const removeItem = (index) => {
    setItemData((prev) => prev.filter((_, i) => i !== index));
  };

  const clientInputs = itemData?.map((item, index) => [
    {
      type: "text",
      required,
      width: "100%",
      borderRadius,
      label: "Name",
      value: item.name,
      setValue: (e) => handleChange(index, "name", e),
    },
    {
      type: "text",
      required,
      width: "100%",
      borderRadius,
      label: "Description",
      value: item.desc,
      setValue: (e) => handleChange(index, "desc", e),
    },
    {
      type: "button",
      width: "20%",
      borderRadius,
      children: "-",
      onClick: () => removeItem(index),
    },
  ]);

  return (
    <section className="add-document-content-wrapper">
      <section className="add-document-content">
        <RenderInputs
          data={clientInputs}
          className="add-document-input-container"
        />
        <Input
          type="button"
          width="100%"
          borderRadius={borderRadius}
          onClick={addNewItem}
        >
          +
        </Input>
      </section>
    </section>
  );
}
