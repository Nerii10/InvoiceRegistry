import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "../Styles/Invoice.css";

export default function Invoice({ Token }) {
  const { id } = useParams();
  const [Invoice, setInvoice] = useState();
  const [Loading, setLoading] = useState();
  const [Error, setError] = useState();
  const ApiUrl = "http://localhost:3000";

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pl-PL", {
      timeZone: "Europe/Warsaw",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  async function getInvoice() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${ApiUrl}/invoices/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setInvoice(result);
        console.log(result);
      } else {
        setError("Failed to fetch invoices");
      }
    } catch (err) {
      setError("An error occurred while fetching invoices.", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (Token) {
      getInvoice();
    }
  }, [Token]);

  return (
    <div className="invoice-container">
      <div className="invoice">
        <div className="invoice-main-data">
          <h1 style={{ margin: 0 }}>Invoice</h1>
          <p>{Invoice?.invoice_number}</p>
        </div>

        <div className="invoice-second-data">
          <div className="invoice-second-data-sender">
            <h2>Seller</h2>
            <p>{Invoice?.sender_name}</p>
            <p>{Invoice?.sender_address}</p>
            <p>{Invoice?.sender_nip}</p>
          </div>

          <div className="invoice-second-data-receiver">
            <h2>Buyer</h2>
            <p>{Invoice?.receiver_name}</p>
            <p>{Invoice?.receiver_address}</p>
            <p>{Invoice?.receiver_nip}</p>
          </div>
        </div>

        <div className="invoice-third-data">
          {Invoice?.services.map((service) => {
            return (
              <>
                <div className="invoice-third-data-service">
                  <p>{service.name}</p>
                  <p>{service.price}zł</p>
                </div>
              </>
            );
          })}
        </div>

        <div className="invoice-third-data-data">
          <p>Issue date: {formatDate(Invoice?.issue_date)}</p>
          <p>Due date: {formatDate(Invoice?.due_date)}</p>
        </div>
      </div>
    </div>
  );
}
