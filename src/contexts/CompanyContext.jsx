import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";

const CompanyContext = createContext();

export function CompanyProvider({ children }) {
  const { token, API_URL } = useUser();
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompanyData = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/myCompany`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      setData(result);
      setTotal(result.total);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, [token]);

  const newUnit = async (unitData) => {
    setLoading(true);
    await fetch(`${API_URL}/unit/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(unitData),
    });
    fetchCompanyData();
    setLoading(false);
  };

  const moveUnit = async (unitData) => {
    setLoading(true);
    await fetch(`${API_URL}/unit/move`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(unitData),
    });
    fetchCompanyData();
    setLoading(false);
  };

  const removeUnit = async (unitData) => {
    setLoading(true);

    await fetch(`${API_URL}/unit/remove`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(unitData),
    });
    fetchCompanyData();
    setLoading(false);
  };

  const leaveCompany = async (data) => {
    setLoading(true);

    await fetch(`${API_URL}/unit/leave`, {
      method: "PATCH", // Zakładam że to PATCH a nie UPDATE
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    fetchCompanyData();
    setLoading(false);
  };

  return (
    <CompanyContext.Provider
      value={{
        data,
        total,
        loading,
        error,
        fetchCompanyData,
        newUnit,
        moveUnit,
        removeUnit,
        leaveCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  return useContext(CompanyContext);
}
