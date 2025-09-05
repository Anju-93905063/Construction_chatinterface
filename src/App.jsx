import { useEffect, useRef, useState } from "react";
import "./App.css";
import { URL } from "./constants";
import RecentSearch from "./components/RecentSearch";
import QuestionAnswer from "./components/QuestionAnswer";
import { Moon, Sun, Menu } from "lucide-react";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const [selectedHistory, setSelectedHistory] = useState("");
  const scrollToAns = useRef();
  const [loader, setLoader] = useState(false);

  const [darkMode, setDarkMode] = useState("dark");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => (prev === "dark" ? "light" : "dark"));
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const askQuestion = async () => {
    if (!question && !selectedHistory) return false;

    const systemPrompt = `
You are a Construction Assistant.  
Answer questions related only to construction.  

👋 If the user greets you, politely greet them back.  
⚠️ For unrelated queries, respond: "I can only answer about construction-related queries."
`;

    if (question) {
      const history = JSON.parse(localStorage.getItem("history") || "[]");
      const newHistory = [question, ...history.slice(0, 19)]
        .map((item) => item.charAt(0).toUpperCase() + item.slice(1).trim())
        .filter((v, i, a) => a.indexOf(v) === i);
      localStorage.setItem("history", JSON.stringify(newHistory));
      setRecentHistory(newHistory);
    }

    const payloadData = question || selectedHistory;
    const payload = {
      contents: [
        { parts: [{ text: systemPrompt + "\nUser: " + payloadData }] }
      ],
    };

    setLoader(true);
    let response = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    response = await response.json();
    let dataString = response.candidates[0].content.parts[0].text;
    dataString = dataString.split("* ").map((item) => item.trim());

    setResult((prev) => [
      ...prev,
      { type: "q", text: payloadData },
      { type: "a", text: dataString },
    ]);
    setQuestion("");

    setTimeout(() => {
      if (scrollToAns.current) scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
    }, 500);

    setLoader(false);
  };

  const isEnter = (event) => {
    if (event.key === "Enter") askQuestion();
  };

  useEffect(() => {
    if (selectedHistory) askQuestion();
  }, [selectedHistory]);

  return (
    <div className={darkMode === "dark" ? "dark" : "light"}>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full border-r border-zinc-300 dark:border-zinc-700
        overflow-y-auto transition-transform duration-300
        ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
        ${darkMode === "dark" ? "bg-zinc-900" : "bg-white"}`}
      >
        <div className={`flex justify-between items-center p-4 border-b
          ${darkMode === "dark" ? "border-zinc-700" : "border-gray-300"} 
          ${darkMode === "dark" ? "bg-zinc-900" : "bg-white"}`}
        >
          <h2 className={`text-lg font-bold
            ${darkMode === "dark" ? "text-zinc-200" : "text-black"}`}>
            Recent Questions
          </h2>
          <button className="md:hidden p-1 text-zinc-800 dark:text-zinc-200" onClick={toggleSidebar}>
            ✕
          </button>
        </div>
        <RecentSearch
          recentHistory={recentHistory}
          setRecentHistory={setRecentHistory}
          setSelectedHistory={setSelectedHistory}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:ml-64 min-h-screen">

        {/* Header */}
        <div className={`flex justify-between items-center p-4
          ${darkMode === "dark" ? "" : "bg-white border-b border-gray-300"}`}>
          <button className="md:hidden p-2 text-zinc-800 dark:text-zinc-200" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>

          <h1 className="text-4xl text-center flex-1 bg-clip-text text-transparent 
            bg-gradient-to-r from-green-700 to-emerald-700 dark:from-pink-600 dark:to-violet-700">
            👷 Hi.. I am a Construction Assistant
          </h1>

          <button onClick={toggleTheme}
            className="p-2 rounded-full bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-white 
              hover:bg-zinc-300 dark:hover:bg-zinc-600"
          >
            {darkMode === "dark" ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col transition-all duration-300 bg-white dark:bg-zinc-800">

          {/* Scrollable Chat */}
          <div ref={scrollToAns} className="flex-1 overflow-y-auto px-4 pb-24 dark:text-zinc-300 text-zinc-800">
            <ul>
              {result.map((item, index) => (
                <QuestionAnswer key={index} item={item} index={index} />
              ))}
            </ul>
          </div>

          {/* Fixed Input */}
          <div className={`px-2 py-1 pr-5 flex h-16 items-center fixed bottom-0 left-0 w-full md:ml-64
            ${darkMode === "light" ? "bg-white text-black border-t border-gray-300" : "bg-zinc-800 text-white border-t border-zinc-700"}`}>
            <input
              type="text"
              value={question}
              onKeyDown={isEnter}
              onChange={(event) => setQuestion(event.target.value)}
              className="w-full h-full p-3 outline-none"
              placeholder="Ask about construction related queries.."
            />
            <button
              onClick={askQuestion}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Ask
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
