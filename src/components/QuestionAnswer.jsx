import Answer from "./Answers";

const QuestionAnswer = ({ item, index }) => {
  return (
    <div
      key={index}
      className={`flex ${item.type === "q" ? "justify-end" : "justify-start"} mb-2`}
    >
      {item.type === "q" ? (
        // User bubble
        <div
          className="rounded-xl max-w-[70%] break-words px-3 py-2 bg-gray-100 text-black dark:bg-gray-300 dark:text-black flex items-center"
          style={{ minHeight: "48px" }} // Removed maxHeight & overflow
        >
          <Answer
            ans={item.text.replace(/^\*+|\n/g, "").trim()}
            totalResult={1}
            index={index}
            type={item.type}
          />
        </div>
      ) : (
        // Assistant bubble
        <div
          className="rounded-xl max-w-[70%] p-3 bg-gray-200 text-black dark:bg-zinc-700 dark:text-white flex flex-col justify-center"
          style={{ minHeight: "48px" }} // Removed maxHeight & overflow
        >
          {Array.isArray(item.text)
            ? item.text.map((ansItem, ansIndex) => (
                <div key={ansIndex}>
                  <Answer
                    ans={ansItem.replace(/^\*+|\n/g, "").trim()}
                    totalResult={item.text.length}
                    index={ansIndex}
                    type={item.type}
                  />
                </div>
              ))
            : (
                <Answer
                  ans={item.text.replace(/^\*+|\n/g, "").trim()}
                  totalResult={1}
                  type={item.type}
                  index={0}
                />
              )}
        </div>
      )}
    </div>
  );
};

export default QuestionAnswer;
