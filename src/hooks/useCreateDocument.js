import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useDocuments } from "./useDocuments";

export function useCreateDocument({ token }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [data, setData] = useState(null);
  const { API_URL } = useUser();

  async function createDocument(document) {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_URL}/invoices/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(document),
      });

      const responseData = await response.json();

      if (!response.ok) {
        let responseMessage = "Failed to create invoice.";

        switch (response.status) {
          case 400:
            responseMessage =
              responseData?.message || "Bad Request: Missing or invalid data.";
            break;
          case 404:
            responseMessage =
              responseData?.message || "Not Found: The resource was not found.";
            break;
          case 409:
            responseMessage =
              responseData?.message || "Conflict: Invoice already exists.";
            break;
          case 500:
            responseMessage = responseData?.message || "Internal Server Error.";
            break;
          default:
            responseMessage =
              responseData?.message || "Unexpected error occurred.";
        }

        throw new Error(responseMessage);
      }

      setMessage({ message: "Successfully added invoice", type: "message" });
      setTimeout(() => {
        setData(responseData);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setTimeout(() => {
        setLoading(false);
        setMessage({ message: err.message, type: "error" });
      }, 1000);
    }
  }

  async function addClient(client) {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_URL}/clients/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(client),
      });

      const responseData = await response.json();

      if (!response.ok) {
        let responseMessage = "Failed to create client.";

        throw new Error(responseMessage);
      }

      setMessage({ message: "Successfully added client", type: "message" });
      setTimeout(() => {
        setData(responseData);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setTimeout(() => {
        setLoading(false);
        setMessage({ message: err.message, type: "error" });
      }, 1000);
    }
  }

  async function addItem(item) {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_URL}/items/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });

      const responseData = await response.json();

      if (!response.ok) {
        let responseMessage = responseData?.message;

        throw new Error(responseMessage);
      }

      setMessage({ message: "Successfully added item", type: "message" });
      setTimeout(() => {
        setData(responseData);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setTimeout(() => {
        setLoading(false);
        setMessage({ message: err.message, type: "error" });
      }, 1000);
    }
  }

  async function addRequest(request) {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_URL}/requests/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      });

      const responseData = await response.json();

      if (!response.ok) {
        let responseMessage = responseData?.message;

        throw new Error(responseMessage);
      }

      setMessage({ message: "Successfully added item", type: "message" });
      setTimeout(() => {
        setData(responseData);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setTimeout(() => {
        setLoading(false);
        setMessage({ message: err.message, type: "error" });
      }, 1000);
    }
  }

  async function completeRequest(request) {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_URL}/requests/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      });

      const responseData = await response.json();

      if (!response.ok) {
        let responseMessage = responseData?.message;

        throw new Error(responseMessage);
      }

      setMessage({ message: "Successfully completed request", type: "message" });
      setTimeout(() => {
        setData(responseData);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setTimeout(() => {
        setLoading(false);
        setMessage({ message: err.message, type: "error" });
      }, 1000);
    }
  }

  async function addOrder(order) {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_URL}/orders/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(order),
      });

      const responseData = await response.json();

      if (!response.ok) {
        let responseMessage = responseData?.message;

        throw new Error(responseMessage);
      }

      setMessage({ message: "Successfully added order", type: "message" });
      setTimeout(() => {
        setData(responseData);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setTimeout(() => {
        setLoading(false);
        setMessage({ message: err.message, type: "error" });
      }, 1000);
    }
  }

  return {
    createDocument,
    addRequest,
    addItem,
    addOrder,
    addClient,
    completeRequest,
    setMessage,
    data,
    message,
    loading,
  };
}
