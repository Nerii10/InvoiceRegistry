import { useNavigate } from "react-router-dom";
import { useRequest } from "../../../hooks/useRequest";
import DashboardPageWrapper from "../DashboardPageWrapper";
import Loader from "../../../components/Loader";
import Input from "../../../components/Input";
import "../../../styles/Invoice.css";

export default function Request() {
  const {
    request,
    filteredWarehouse,
    loading,
    addFromWarehouse,
    canComplete,
  } = useRequest();
  const navigate = useNavigate();

  return (
    <DashboardPageWrapper maxWidth="1250px">
      {/* Loader */}
      <Loader loading={loading} onlyLoader={true} position="center" />

      {/* Brak requestu (po zakończeniu loading) */}
      {!loading && !request && (
        <section style={{ padding: "2rem", textAlign: "center" }}>
          <p>Request not found.</p>
          <Input
            type="button"
            onClick={() => navigate("/dashboard/add-document?request")}
          >
            Create a new Request
          </Input>
        </section>
      )}

      {/* Gdy mamy dane */}
      {request && (
        <>
          <section className="invoice_header">
            <p>{request.requested_by_username}</p>
            <p>
              {request.created_at && new Date(request.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </p>
            <p>{request.status}</p>
          </section>

          <section className="invoice_content">
            <h3>Requested Items</h3>
            {(request.items ?? []).map((item) => (
              <div className="invoice_services_input" key={item.id}>
                <p>{item.item_name}</p>
                <p>{item.quantity}</p>
              </div>
            ))}

            <h3>Warehouse Stock</h3>
            {filteredWarehouse.map((w) => (
              <div className="invoice_services_input" key={w.item_id}>
                <p>{w.name}</p>
                <p>{w.quantity}</p>
              </div>
            ))}
          </section>

          <form
            className="invoice_status"
            onSubmit={(e) => {
              e.preventDefault();
              addFromWarehouse();
            }}
          >
            <section className="invoice_status_inputs">
              <Input
                type="button"
                width="150px"
                borderRadius="15px"
                onClick={() => navigate("/dashboard/add-document?order")}
              >
                Order Items
              </Input>

              <Input
                type="submit"
                width="150px"
                borderRadius="15px"
                disabled={!canComplete || request.status === "completed"}
              >
                Add from Warehouse
              </Input>
            </section>
          </form>
        </>
      )}
    </DashboardPageWrapper>
  );
}
