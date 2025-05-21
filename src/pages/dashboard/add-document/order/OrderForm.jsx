import { useEffect, useState } from "react";
import RenderInputs from "../../../../components/RenderInputs";
import { useUser } from "../../../../contexts/UserContext";
import { useDocuments } from "../../../../hooks/useDocuments";

export default function OrderForm({ orderData, setOrderData }) {
  const borderRadius = "10px";
  const required = true;

  const { token } = useUser();
  const { fetchDocs, data } = useDocuments({ token, type: "requests" });
  const [selectedRequestItems, setSelectedRequestItems] = useState([]);
  const [requestId, setRequestId] = useState(null);

  useEffect(() => {
    fetchDocs();
  }, []);

  useEffect(() => {
    const selected = data.find((r) => r.id === Number(requestId));
    if (selected && Array.isArray(selected.items)) {
      const itemsWithPrice = selected.items.map((item) => ({
        ...item,
        price: item.price || "",
      }));
      setSelectedRequestItems(itemsWithPrice);
    } else {
      setSelectedRequestItems([]);
    }
  }, [requestId, data]);

  useEffect(() => {
    if (requestId !== null) {
      setOrderData({
        requestId,
        list: selectedRequestItems,
      });
    }
  }, [requestId, selectedRequestItems]);

  const clientInputs = [
    [
      {
        type: "select",
        required,
        width: "100%",
        borderRadius,
        options: data
          ?.filter(
            (request) =>
              request.status !== "paid" && request.status !== "completed"
          )
          .map((request) => ({
            value: request.id,
            label: `${request.requested_by_username}, ${request.items.length} items`,
          })),
        label: "Request",
        setValue: (id) => {
          setRequestId(id);
        },
      },
    ],
  ];

  const itemInputs = selectedRequestItems.map((item, index) => [
    {
      type: "text",
      label: "Item ID",
      value: item.item_name,
    },
    {
      type: "text",
      label: "Price",
      value: item.price,
      required: true,
      setValue: (val) => {
        setSelectedRequestItems((prev) => {
          const updated = [...prev];
          updated[index] = { ...updated[index], price: val };
          return updated;
        });
      },
    },
  ]);

  return (
    <section className="add-document-content-wrapper">
      <section className="add-document-content">
        <RenderInputs
          data={clientInputs}
          className={"add-document-input-container"}
        />
        {itemInputs.length > 0 && (
          <RenderInputs
            data={itemInputs}
            className={"add-document-input-container"}
          />
        )}
      </section>
    </section>
  );
}
