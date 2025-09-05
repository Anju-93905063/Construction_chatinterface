function RecentSearch({ recentHistory, setRecentHistory, setSelectedHistory }) {
  const clearHistory = () => {
    localStorage.clear();
    setRecentHistory([]);
  };

  const clearSelectedHistory = (selectedItem) => {
    let history = JSON.parse(localStorage.getItem("history"));
    history = history.filter((item) => item !== selectedItem);
    setRecentHistory(history);
    localStorage.setItem("history", JSON.stringify(history));
  };

  return (
    <>
      <div className="col-span-1 dark:bg-zinc-900 bg-gray-100 pt-3 h-full">
        {/* Header */}
        <h1 className="text-xl dark:text-white text-zinc-800 flex items-center justify-between px-4">
          <span>Recent Search</span>
          <button
            onClick={clearHistory}
            className="cursor-pointer hover:scale-110 transition-transform"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="currentColor"
              className="text-red-500 dark:text-red-400"
            >
              <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
            </svg>
          </button>
        </h1>

        {/* History Items */}
        <ul className="text-left overflow-auto mt-3 px-2 space-y-2">
          {recentHistory &&
            recentHistory.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between 
                  bg-white dark:bg-zinc-800 
                  text-zinc-800 dark:text-zinc-300
                  px-4 py-2 rounded-lg shadow-sm cursor-pointer 
                  hover:bg-gray-200 dark:hover:bg-zinc-700"
              >
                <li
                  onClick={() => setSelectedHistory(item)}
                  className="flex-1 truncate"
                >
                  {item}
                </li>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelectedHistory(item);
                  }}
                  className="ml-3 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="18px"
                    viewBox="0 -960 960 960"
                    width="18px"
                    fill="currentColor"
                  >
                    <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                  </svg>
                </button>
              </div>
            ))}
        </ul>
      </div>
    </>
  );
}

export default RecentSearch;
