import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("BASE_URL =", BASE_URL);

export default function App() {
  const [items, setItems] = useState([]);
  const [region, setRegion] = useState("하남");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchComplexes() {
    setLoading(true);
    setError("");
    try {
      const url = `${BASE_URL}/complexes?region=${encodeURIComponent(region)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(data.items ?? []);
    } catch (e) {
      setError(e.message ?? "fetch failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComplexes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>살집찾기</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="지역 (예: 하남)"
          style={{ padding: 8, width: 240 }}
        />
        <button onClick={fetchComplexes} style={{ padding: "8px 12px" }}>
          조회
        </button>
      </div>

      {loading && <p>로딩 중...</p>}
      {error && <p style={{ color: "red" }}>에러: {error}</p>}

      <ul>
        {items.map((x) => (
          <li key={x.id} style={{ marginBottom: 8 }}>
            <div><b>{x.name}</b></div>
            <div>{x.region}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              ({x.lat}, {x.lng})
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}