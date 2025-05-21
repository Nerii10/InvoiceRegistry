import { useEffect } from "react";
import RenderInputs from "../../../../components/RenderInputs";
import { useUser } from "../../../../contexts/UserContext";
import { useDocuments } from "../../../../hooks/useDocuments";

export default function OrderForm({ orderData, setOrderData }) {
  const borderRadius = "10px";
  const required = true;

  const { token } = useUser();
  const { fetchDocs, data } = useDocuments({ token, type: "requests" });

  useEffect(() => {
    console.log(data);
  }, [data]);

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
        options: data
          ?.filter((request) => (request.status !== "paid" &&  request.status !== "completed"))
          .map((request) => ({
            value: request.id,
            label: `${request.item_name} - ${Number(request.quantity)}, by ${
              request.requested_by_username
            }`,
          })),
        label: "Request",
        setValue: (e) => {
          setOrderData(e);
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
