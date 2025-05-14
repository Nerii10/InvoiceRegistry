import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";

export function useCompany({ token }) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { API_URL } = useUser();

  async function fetchCompanyData() {
    if (token) {
      if (!data) {
        setLoading(true);
      }

      setError(null);

      try {
        console.log("Trying to fetch company data");
        const url = new URL(`${API_URL}/myCompany`);
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        console.log(result, "- result useCompany");
        setData({ ...result }); 
        setLoading(false);
        setError(null);
        setTotal(result.total);
      } catch (error) {
        console.log(error);
        setError(error);
        setLoading(false);
      }
    }
  }

  async function newUnit(data) {
    try {
      const response = await fetch(`${API_URL}/unit/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create unit");
      }
      fetchCompanyData();
    } catch (err) {
      setTimeout(() => {
        setError(err);
        setLoading(false);
      }, 1000);
    }
  }

  async function moveUnit(data) {
    try {
      const response = await fetch(`${API_URL}/unit/move`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to move user");
      }
      fetchCompanyData();
    } catch (err) {
      console.log(err);
    }
  }

  async function removeUnit(data) {
    try {
      const response = await fetch(`${API_URL}/unit/remove`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to move user");
      }
      fetchCompanyData();
    } catch (err) {
      console.log(err);
    }
  }

  async function leaveCompany(data) {
    console.log("leaving");
    try {
      const response = await fetch(`${API_URL}/unit/leave`, {
        method: "UPDATE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to move user");
      }
      fetchCompanyData();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchCompanyData();
  }, [token]);

  return {
    newUnit,
    moveUnit,
    removeUnit,
    leaveCompany,
    fetchCompanyData,
    data,
    total,
    loading,
    error,
  };
}
