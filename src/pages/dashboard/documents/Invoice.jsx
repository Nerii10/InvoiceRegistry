import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useDocuments } from "../../../hooks/useDocuments";
import { useUser } from "../../../contexts/UserContext";
import DashboardPageWrapper from "../DashboardPageWrapper";
import "../../../styles/Invoice.css";
import Input from "../../../components/Input";
import Loader from "../../../components/Loader";
import { Check, X, ClockAlert } from "lucide-react";
import RenderInputs from "../../../components/RenderInputs";

export function InvoiceData({ token, fetchDocument, data }) {
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchDocument("invoice", id);
    }
  }, [token]);

  const paid =
    data?.payments?.reduce(
      (sum, value) => Number(sum) + Number(value.amount),
      0
    ) ?? 0;

  return { invoiceData: { ...data, paid } };
}

export function InvoiceStatus({ invoiceData, token, addPayment }) {
  const [value, setValue] = useState();
  return (
    <form
      className="invoice_status"
      onSubmit={(e) => {
        e.preventDefault();
        addPayment(invoiceData.id, value);
      }}
    >
      <section className="invoice_status_payment">
        <p style={{ margin: 0 }}>
          {invoiceData.paid} PLN / {invoiceData.amount} PLN
        </p>
        <section
          className="invoice_status_payment_display"
          style={{
            "--completion-percent": `${
              (invoiceData.amount == 0
                ? 1
                : invoiceData.paid / invoiceData.amount) * 100
            }%`,
          }}
        ></section>
      </section>

      <section className="invoice_status_inputs">
        <Input
          type="number"
          max={invoiceData.amount - invoiceData.amount_paid}
          width="100%"
          label="Amount"
          value={value}
          required={true}
          min={0}
          borderRadius="15px"
          setValue={(e) => {
            setValue(e);
          }}
        ></Input>

        <Input
          type="submit"
          width="150px"
          borderRadius="15px"
          onClick={() => {}}
        >
          Add payment
        </Input>

        <Input
          type="submit"
          width="150px"
          borderRadius="15px"
          onClick={() => {
            setValue(invoiceData.amount - invoiceData.amount_paid);
          }}
        >
          Mark as Paid
        </Input>
      </section>
    </form>
  );
}

export function InvoiceStatusIcon({ invoice }) {
  const iconSize = 15;

  if (!invoice) return null;

  if (Number(invoice.amount) === 0) {
    return (
      <p className="invoice-status paid">
        <Check size={iconSize} />
      </p>
    );
  }

  const paid = invoice?.paid || 0;
  const total = Number(invoice.amount) || 0;
  const dueDate = new Date(invoice.due_date);
  const now = new Date();

  if (paid === 0) {
    return (
      <p className="invoice-status pending">
        <ClockAlert size={iconSize} />
      </p>
    );
  }

  if (paid > 0 && paid < total) {
    if (dueDate < now) {
      return (
        <p className="invoice-status late">
          <X size={iconSize} />
        </p>
      );
    } else {
      return (
        <p className="invoice-status pending">
          <ClockAlert size={iconSize} />
        </p>
      );
    }
  }

  if (paid >= total) {
    return (
      <p className="invoice-status paid">
        <Check size={iconSize} />
      </p>
    );
  }

  return null;
}

export default function Invoice() {
  const { token } = useUser();
  const { addPayment, fetchDocument, data, loading } = useDocuments({ token });
  const { invoiceData } = InvoiceData({ token, fetchDocument, data });

  return (
    <DashboardPageWrapper maxWidth={"1250px"}>
      <Loader loading={loading} onlyLoader={true} position={"center"}></Loader>
      <section className="invoice_header">
        <h1>Invoice {invoiceData?.invoice_number}</h1>
        <p>
          <InvoiceStatusIcon invoice={invoiceData}></InvoiceStatusIcon>
        </p>
      </section>
      <section className="invoice_content">
        <section className="invoice_date">
          <p>
            Issue date: {new Date(invoiceData?.issue_date).toLocaleDateString()}
          </p>
          <p>
            Due date: {new Date(invoiceData?.due_date).toLocaleDateString()}
          </p>
        </section>

        <section className="invoice_main">
          <section className="invoice_main_input">
            <h3>From</h3>
            <p>{invoiceData?.receiver_name}</p>
            <p>{invoiceData?.receiver_address}</p>
            <p>{invoiceData?.receiver_nip}</p>
          </section>
          <section className="invoice_main_input">
            <h3>Bill to.</h3>
            <p>{invoiceData?.sender_name}</p>
            <p>{invoiceData?.sender_address}</p>
            <p>{invoiceData?.sender_nip}</p>
          </section>
        </section>

        {invoiceData?.services?.length > 0 && (
          <>
            <section className="invoice_services">
              {invoiceData?.services?.map((service, idx) => (
                <div key={idx} className="invoice_services_input">
                  <p>{service.name}</p>
                  <p>{service.price} PLN</p>
                </div>
              ))}
            </section>
          </>
        )}
        <div className="invoice_services_input">
          <p>Total</p>
          <p>{invoiceData?.amount} PLN</p>
        </div>

        <section className="invoice_main_input">
          <h3>- Payments</h3>
        </section>

        {invoiceData?.services?.length > 0 && (
          <>
            <section className="invoice_services">
              {invoiceData.payments?.map((payment, idx) => (
                <div key={idx} className="invoice_services_input">
                  <p>{payment.username}</p>
                  <p>{new Date(payment.paid_at).toLocaleDateString()}</p>
                  <p>{payment.amount} PLN</p>
                </div>
              ))}
            </section>
            <section className="invoice_services"></section>
          </>
        )}
        <div className="invoice_services_input">
          <p>Total</p>
          <p>{invoiceData.paid || 0} PLN</p>
        </div>
      </section>
      <InvoiceStatus
        invoiceData={invoiceData}
        addPayment={addPayment}
        token={token}
      />
    </DashboardPageWrapper>
  );
}
