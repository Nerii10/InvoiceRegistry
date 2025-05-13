import { useState } from "react";
import { useUser } from "../contexts/UserContext";

export function useCreateDocument({ token }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const { API_URL } = useUser();

  async function createDocument(document) {
    console.log(document);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/invoices/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(document),
      });

      if (!response.ok) {
        throw new Error(
          "Failed to create invoice. Possible reasons: the invoice already exists, required data is missing, or there is a network issue."
        );
      }

      const result = await response.json();

      setTimeout(() => {
        setData(result);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setTimeout(() => {
        setError(err);
        setLoading(false);
      }, 1000);
    }
  }

  return { createDocument, data, error, setError, loading };
}
