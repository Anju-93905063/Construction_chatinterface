import { useEffect, useRef, useState } from "react";
import "./App.css";
import { URL } from "./constants";
import RecentSearch from "./components/RecentSearch";
import QuestionAnswer from "./components/QuestionAnswer";
import { Moon, Sun } from "lucide-react";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history"))
  );
  const [selectedHistory, setSelectedHistory] = useState("");
  const scrollToAns = useRef();
  const [loader, setLoader] = useState(false);

  // ✅ Dark/Light theme state
  const [darkMode, setDarkMode] = useState("dark");

  useEffect(() => {
    if (darkMode === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [darkMode]);

  // ✅ Toggle theme function
  const toggleTheme = () => {
    setDarkMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // ✅ Ask Question function
  const askQuestion = async () => {
    if (!question && !selectedHistory) return false;

    // ✅ System Prompt
    const systemPrompt = `
You are a Construction Assistant.  
Answer the questions that is related to only constructions.  

👋 If the user greets you, politely greet them back and remind them politely and professionally.  

⚠️ If the user asks about anything unrelated to construction, respond only with:  
"I can only answer about construction-related queries."  

Always stay professional and focused on construction.
`;

    // ✅ Save history (only if user typed a new question)
    if (question) {
      if (localStorage.getItem("history")) {
        let history = JSON.parse(localStorage.getItem("history"));
        history = history.slice(0, 19);
        history = [question, ...history];
        history = history.map(
          (item) => item.charAt(0).toUpperCase() + item.slice(1).trim()
        );
        history = [...new Set(history)];
        localStorage.setItem("history", JSON.stringify(history));
        setRecentHistory(history);
      } else {
        localStorage.setItem("history", JSON.stringify([question]));
        setRecentHistory([question]);
      }
    }

    const payloadData = question ? question : selectedHistory;
    const payload = {
      contents: [
        {
          parts: [{ text: systemPrompt + "\nUser: " + payloadData }],
        },
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
      { type: "q", text: question ? question : selectedHistory },
      { type: "a", text: dataString },
    ]);
    setQuestion("");

    setTimeout(() => {
      if (scrollToAns.current) {
        scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
      }
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
      <div className="flex h-screen">
        {/* ✅ Sidebar */}
        <div className="w-1/5 h-full fixed top-0 left-0 border-r border-zinc-300 dark:border-zinc-700 overflow-y-auto 
          bg-lightgrey-100 dark:bg-zinc-900">
          
          <RecentSearch
            recentHistory={recentHistory}
            setRecentHistory={setRecentHistory}
            setSelectedHistory={setSelectedHistory}
          />
        </div>

        {/* ✅ Chat Section */}
        <div className="ml-[20%] w-[80%] flex flex-col relative bg-white dark:bg-zinc-800">
          {/* Header with Toggle */}
          <div className="flex justify-between items-center p-4">
            <h1 className="text-4xl text-center bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-emerald-700 dark:from-pink-600 dark:to-violet-700">
              👷 Construction Assistant
            </h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full 
             bg-zinc-200 text-zinc-800 
             dark:bg-zinc-700 dark:text-yellow-300 
             hover:bg-zinc-300 dark:hover:bg-zinc-600"
            >
              {darkMode === "dark" ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>

          {/* Scrollable Chat */}
          <div
            ref={scrollToAns}
            className="flex-1 overflow-y-auto px-4 pb-24 dark:text-zinc-300 text-zinc-800"
          >
            <ul>
              {result.map((item, index) => (
                <QuestionAnswer key={index} item={item} index={index} />
              ))}
            </ul>
          </div>

          {/* Fixed Input Box */}
   <div
  className={`w-[80%] px-2 py-1 pr-5 
    flex h-16 items-center fixed bottom-0 left-[20%] 
    ${darkMode === "light" 
      ? "bg-white text-black border-t border-gray-300" 
      : "bg-zinc-800 text-white border-t border-zinc-700"
    }`}
>
  <input
    type="text"
    value={question}
    onKeyDown={isEnter}
    onChange={(event) => setQuestion(event.target.value)}
    className="w-full h-full p-3 outline-none"
    placeholder="Ask about construction (cement, steel, bricks, etc.)"
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
