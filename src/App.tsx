import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    let currentSiteUrl;
    if (query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let activeTab = tabs[0];
        if (activeTab.url) {
          let url = new URL(activeTab.url);
          currentSiteUrl = url.hostname;

          const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)} site:${currentSiteUrl}`;
          const width = 768;
          const height = 448;

          chrome.windows.create({ url: searchUrl, type: 'popup', width: width, height: height, left: 100, top: 100 });
        } else {
          console.error("URL is undefined.");
        }
      })
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  })

  return (
    <div style={{ padding: '10px', width: '300px' }}>
      <input
        type="text"
        value={query}
        autoFocus
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter search query"
        style={{ width: '100%', padding: '5px' }}
      />
      <button onClick={handleSearch} style={{ padding: '5px 10px', marginTop: '10px' }}>
        Search
      </button>
    </div>
  );
}

export default App;
