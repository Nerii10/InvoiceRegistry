import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";

import { useDocuments } from "./useDocuments";
import { useUser } from "../contexts/UserContext";
import { useCreateDocument } from "./useCreateDocument";

export function useRequest() {
  const { id } = useParams();
  const { token, user, API_URL } = useUser();
  const userId = user?.userId;
  const isLeader = user?.role === "leader";

  // 1) Fetch requestu (raz)
  const {
    fetchDocument,
    data: requestRaw,
    loading: loadingReq,
  } = useDocuments({ token });
  const fetchedRef = useRef(false);
  useEffect(() => {
    if (id && token && !fetchedRef.current) {
      fetchDocument("requests", id);
      fetchedRef.current = true;
    }
  }, [id, token, fetchDocument]);

  // 2) Fetch magazynu + refetch po complete
  const [warehouse, setWarehouse] = useState([]);
  const [loadingWare, setLoadingWare] = useState(false);
  const loadWarehouse = async () => {
    setLoadingWare(true);
    try {
      const res = await fetch(`${API_URL}/warehouse/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setWarehouse(json?.data ?? []);
    } catch (err) {
      console.error("Warehouse fetch err:", err);
    } finally {
      setLoadingWare(false);
    }
  };
  useEffect(() => {
    if (token) loadWarehouse();
  }, [token, API_URL]);

  // 3) completeRequest
  const {
    completeRequest: doComplete,
    data: requestUpdated,
    loading: loadingComplete,
  } = useCreateDocument({ token });

  // 4) Dane i stan ładowania
  const request = requestUpdated ?? requestRaw;
  const loading = loadingReq || loadingWare || loadingComplete;

  // 5) Filtrowanie magazynu wg pozycji z requestu
  const filteredWarehouse = useMemo(() => {
    const items = request?.items ?? [];
    if (!items.length || !warehouse.length) return [];
    const ids = new Set(items.map((it) => Number(it.item_id)));
    return warehouse.filter((w) => ids.has(Number(w.item_id)));
  }, [warehouse, request?.items]);

  // 6) Uprawnienia: lider lub autor requestu
  const canComplete =
    !!request && (isLeader || String(request.requested_by) === String(userId));

  // 7) Funkcja kończąca request i refetch magazynu
  const addFromWarehouse = async () => {
    if (!request?.items?.length) return;

    // walidacja stanów
    const tooLow = request.items.filter((it) => {
      const wh = filteredWarehouse.find(
        (w) => Number(w.item_id) === Number(it.item_id)
      );
      return !wh || parseFloat(it.quantity) > parseFloat(wh.quantity);
    });
    if (tooLow.length) {
      console.warn("Insufficient stock:", tooLow);
      return;
    }

    if (!canComplete) {
      console.warn("Not authorized to complete request");
      return;
    }

    // wykonaj complete
    await doComplete({ id: request.id, items: request.items });
    // po complete odśwież magazyn
    await loadWarehouse();
  };

  return {
    request,
    filteredWarehouse,
    loading,
    addFromWarehouse,
    canComplete,
  };
}
