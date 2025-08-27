import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const router = useRouter();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      const res = await fetch(`/api/search?q=${query}`);
      const data = await res.json();
      setResults(data);
    }
  };

  return (
    <div className="searchInput sdsdsd">
      <form onSubmit={handleSearch}>
        <div className="wraper">
          <input 
            type="text" 
            placeholder="welke renner zoek je?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="icon">
            <Image 
              src="/images/search-icon.svg" 
              alt="Search"
              width={20}
              height={20}
            />
            {query && (
              <button 
                type="button" 
                className="close"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>
      </form>
      
      {results.length > 0 && (
        <div className="resultBox">
          {results.map(rider => (
            <div 
              key={rider.id} 
              className="result-item"
              onClick={() => router.push(`/riders/${rider.id}`)}
            >
              {rider.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}