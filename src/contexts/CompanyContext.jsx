import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";

const CompanyContext = createContext();

export function CompanyProvider({ children }) {
  const { token, API_URL } = useUser();
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const callApi = async ({ url, method, body }) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}${url}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (url != "/myCompany") {
          const errMsg = responseData.message || "Server error";
          setMessage({ message: errMsg, type: responseData.type || "error" });
          console.log({ message: errMsg, type: responseData.type || "error" });
        }
        return { ok: false };
      }

      if (url != "/myCompany") {
        const successMsg = responseData.message || "Operation successful";
        setMessage({
          message: successMsg,
          type: responseData.type || "message",
        });
        console.log({
          message: successMsg,
          type: responseData.type || "message",
        });
      }

      return { ok: true, data: responseData };
    } catch (err) {
      setMessage({ message: err.message || "Network error", type: "error" });
      return { ok: false };
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyData = async () => {
    if (!token) return;
    const { ok, data: result } = await callApi({
      url: "/myCompany",
      method: "POST",
    });
    if (ok) {
      setData(result);
      setTotal(result.total);
    }
  };

  const newUnit = async (unitData) => {
    const { ok } = await callApi({
      url: "/unit/new",
      method: "POST",
      body: unitData,
    });
    if (ok) await fetchCompanyData();
  };

  const moveUnit = async (unitData) => {
    const { ok } = await callApi({
      url: "/unit/move",
      method: "PATCH",
      body: unitData,
    });
    if (ok) await fetchCompanyData();
  };

  const removeUnit = async (unitData) => {
    const { ok } = await callApi({
      url: "/unit/remove",
      method: "PATCH",
      body: unitData,
    });
    if (ok) await fetchCompanyData();
  };

  const promoteUnit = async (unitData) => {
    const { ok } = await callApi({
      url: "/unit/promote",
      method: "PATCH",
      body: unitData,
    });
    if (ok) await fetchCompanyData();
  };

  const leaveCompany = async (data) => {
    const { ok } = await callApi({
      url: "/unit/leave",
      method: "POST",
      body: data,
    });
    if (ok) await fetchCompanyData();
  };

  

  useEffect(() => {
    fetchCompanyData();
  }, [token]);

  return (
    <CompanyContext.Provider
      value={{
        data,
        total,
        loading,
        message,
        fetchCompanyData,
        newUnit,
        moveUnit,
        removeUnit,
        promoteUnit,
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
