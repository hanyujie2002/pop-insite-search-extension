import { useEffect, useState } from 'react'

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
  <div className="p-4 w-72">
    <p className="ml-1 text-sm text-gray-500 mb-2">In site search with Google</p>
    <input
      type="text"
      value={query}
      autoFocus
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Enter search query"
      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
    />
    <button 
      onClick={handleSearch} 
      className="w-full mt-3 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring"
    >
      Search
    </button>
  </div>
);

}

export default App;
