import { useEffect, useState } from "react";
import RenderInputs from "../../../../components/RenderInputs";
import Input from "../../../../components/Input";
import { useDocuments } from "../../../../hooks/useDocuments";
import { useMemo } from "react";
import { useUser } from "../../../../contexts/UserContext";

export default function RequestForm({ requestData, setRequestData }) {
  const borderRadius = "10px";
  const required = true;

  const { token } = useUser();
  const { fetchDocs, data } = useDocuments({ token, type: "items" });

  useEffect(() => {
    fetchDocs();
  }, []);

  useEffect(() => {
    console.log(requestData);
  }, [requestData]);

  const filteredData = useMemo(() => {
    return data?.data?.filter(
      (d) => !requestData.some((r) => Number(r.item) === Number(d.id))
    );
  }, [data, requestData]);

  const addNewRequest = () => {
    setRequestData((prev) => [...prev, { item: null, quantity: "" }]);
  };

  const removeRequest = (index) => {
    setRequestData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (index, key, value) => {
    // Jeśli zmieniamy "item", sprawdzamy czy już jest wybrany
    if (key === "item") {
      const alreadyExists = requestData.some(
        (r, i) => i !== index && r.item === value
      );
      if (alreadyExists) {
        alert("Ten przedmiot został już dodany. Wybierz inny.");
        return;
      }
    }

    const updated = [...requestData];
    updated[index][key] = value;
    setRequestData(updated);
  };

  const clientInputs = requestData?.map((request, index) => {
    const selectedItemsExceptCurrent = requestData
      .filter((_, i) => i !== index)
      .map((r) => Number(r.item));

    const options =
      data?.data
        ?.filter((item) => {
          return (
            !selectedItemsExceptCurrent.includes(Number(item.id)) ||
            Number(item.id) === Number(request.item)
          );
        })
        .map((item) => ({ value: item.id, label: item.name })) || [];

    return [
      {
        type: "select",
        required,
        width: "100%",
        borderRadius,
        label: "Item",
        value: request.item ?? "",
        options,
        setValue: (e) => handleChange(index, "item", e),
      },
      {
        type: "text",
        required,
        width: "100%",
        borderRadius,
        label: "Quantity",
        value: request.quantity,
        setValue: (e) => handleChange(index, "quantity", e),
      },
      {
        type: "button",
        required,
        width: "20%",
        borderRadius,
        label: "Remove",
        children: "-",
        onClick: () => removeRequest(index),
      },
    ];
  });

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
          onClick={addNewRequest}
        >
          +
        </Input>
      </section>
    </section>
  );
}
