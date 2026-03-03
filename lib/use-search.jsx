import { useEffect, useRef, useState } from "react";

export default function useSearch({
  query,
  fetcher,
  minChars = 2,
  debounceMs = 300,
  enabled = true,
}) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const trimmed = (query || "").trim();

    // Empty
    if (!trimmed) {
      requestIdRef.current++;
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    // Less than minimum
    if (trimmed.length < minChars) {
      requestIdRef.current++;
      setResults([]);
      setOpen(true);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      const currentId = ++requestIdRef.current;
      setLoading(true);
      setOpen(true);

      try {
        const data = await fetcher(trimmed);

        if (currentId !== requestIdRef.current) return;

        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        if (currentId !== requestIdRef.current) return;
        setResults([]);
      } finally {
        if (currentId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, fetcher, minChars, debounceMs, enabled]);

  const reset = () => {
    requestIdRef.current++;
    setResults([]);
    setOpen(false);
    setLoading(false);
  };

  return {
    results,
    loading,
    open,
    setOpen,
    reset,
    minChars,
  };
}