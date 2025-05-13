import { useState } from "react";
import { useUser } from "../contexts/UserContext";

export function useOcr({ token }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { API_URL } = useUser();

  async function ocrFile(file) {
    if (token) {
      setLoading(true);
      setError(null);

      try {
        // console.log('Trying to ocr file')
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_URL}/ocr/file`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const result = await response.json();
        console.log(result, "- result useOcr");
        setData(result);
        setLoading(false);
        setError(null);
      } catch (err) {
        setTimeout(() => {
          setError(err);
          setLoading(false);
        }, 1000);
      }
    }
  }

  return { ocrFile, data, loading, error };
}
