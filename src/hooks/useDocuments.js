import { useState } from "react";
import { useUser } from "../contexts/UserContext";

export function useDocuments({ token, type, page, search, sort, filters }) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { API_URL } = useUser();

  async function fetchDocs() {
    if (token) {
      setLoading(true);
      setError(null);

      try {
        // console.log('Trying to fetch docs')
        const url = new URL(
          `${API_URL}/${
            type == "invoices"
              ? "invoices"
              : type == "clients"
              ? "clients"
              : type
          }/all`
        );
        url.searchParams.append("page", page || null);
        url.searchParams.append("search", search || "");
        url.searchParams.append("sort_date", sort?.date || null);
        url.searchParams.append("filter_status", filters?.status || null);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        console.log(result, "- result useDocuments");
        setData(result);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.log(error);
        setError(error);
        setLoading(false);
      }
    }
  }

  async function fetchDocument(type, id) {
    if (token) {
      setLoading(true);
      setError(null);

      try {
        const url = new URL(
          `${API_URL}/${
            type == "invoice" ? "invoices" : type == "client" && "clients"
          }/${id}`
        );

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        setData(result);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.log(error);
        setError(error);
        setLoading(false);
      }
    }
  }

  async function addPayment(id, amount) {
    if (token && amount != 0) {
      setLoading(true);
      setError(null);

      try {
        const url = new URL(`${API_URL}/${"invoices/add-payment"}`);

        const response = await fetch(url, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount, id }),
        });
        const result = await response.json();
        setData(result);
        setLoading(false);
        console.log(result);
        setError(null);
      } catch (error) {
        console.log(error);
        setError(error);
        setLoading(false);
      }
    }
  }

  async function serachForClients(name) {
    if (token) {
      setLoading(true);
      setError(null);

      try {
        const url = new URL(`${API_URL}/search/clients/all`);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        });
        const result = await response.json();
        setData(result);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.log(error);
        setError(error);
        setLoading(false);
      }
    }
  }

  return {
    fetchDocs,
    serachForClients,
    addPayment,
    fetchDocument,
    data,
    total,
    loading,
    error,
  };
}
