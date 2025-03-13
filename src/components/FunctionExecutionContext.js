import { closeHoverTooltips } from "@codemirror/view";
import { React, useEffect, useState, useRef } from "react";

const FunctionExecutionContext = ({
  setLogs,
  setConsoleUpdate,
  updatedMemory,
  functionName,
  setOnComplete,
}) => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const [functionMemory, setFunctionMemory] = useState({});
  const functionMemoryRef = useRef({});
  const [phase, setPhase] = useState(1);
  const [code, setCode] = useState();
  const [isCodeReady, setIsCodeReady] = useState(false);
  const [codeExecution, setCodeExecution] = useState([]);

  function evalExpression(expression, functionMemory) {
    try {
      // Trim whitespace and remove trailing semicolons
      expression = expression.trim().replace(/;$/, "");
      // Check if expression is a simple value (number, string, boolean)
      if (/^(\d+(\.\d+)?|true|false|null|'[^']*'|"[^"]*")$/.test(expression)) {
        return eval(expression); // Directly return primitive values
      }

      // Replace variables with their values from functionMemory
      let safeExpression = expression.replace(/\b[a-zA-Z_]\w*\b/g, (match) => {
        if (functionMemory.hasOwnProperty(match)) {
          let variableData = functionMemory[match];

          // Handle TDZ (Temporal Dead Zone) properly
          if (variableData.value === "TDZ") {
            throw new Error(
              `ReferenceError: Cannot access '${match}' before initialization`
            );
          }

          return variableData.value;
        }

        throw new Error(`ReferenceError: '${match}' is not defined`);
      });

      // Evaluate the final expression safely
      return new Function(`"use strict"; return (${safeExpression})`)();
    } catch (error) {
      return error.message; // Return error message instead of throwing
    }
  }
  //code
  useEffect(() => {
    let fullCode = updatedMemory[functionName]?.body?.toString() || "";
    let match = fullCode.match(/\{([\s\S]*)\}/); // Extract function body inside {}
    let functionBody = match ? match[1].trim() : "";

    setCode(functionBody);
    setIsCodeReady(true); // Set flag after code is updated
  }, [functionName, updatedMemory]);
  //phase1
  useEffect(() => {
    if (isCodeReady) {
      executePhaseOne();
    }
  }, [isCodeReady]);
  //phase 2
  useEffect(() => {
    if (phase === 2) {
      executePhaseTwo();
    }
  }, [phase]);

  const executePhaseOne = async () => {
    const lines = code.split("\n");
    setLogs((prevLogs) => [
      ...prevLogs,
      `-- ${functionName} : Execution Started...`,
    ]);
    await delay(1000);
    setLogs((prevLogs) => [
      ...prevLogs,
      `-- Phase 1 of ${functionName}: Memory Allocation`,
    ]);
    await delay(1000);
    for (let i = 0; i < lines.length; i++) {
      let trimmedLine = lines[i].trim();

      if (/^(var|let|const)\s+[a-zA-Z_$][\w$]*\s*=/.test(trimmedLine)) {
        const varType = trimmedLine.startsWith("var ")
          ? "var"
          : trimmedLine.startsWith("let ")
          ? "let"
          : "const";

        const varName = trimmedLine.split(" ")[1]?.split("=")[0]?.trim();

        if (varName) {
          functionMemory[varName] = {
            type: varType,
            value: varType === "var" ? "undefined" : "TDZ",
          };
          setFunctionMemory({ ...functionMemory }); // Sync UI
          setLogs((prevLogs) => [
            ...prevLogs,
            `-- Allocated memory for variable: ${varName}`,
          ]);
        }
      } else if (trimmedLine.startsWith("function")) {
        const funcName = trimmedLine.split(" ")[1]?.split("(")[0]?.trim();

        if (funcName) {
          let funcBody = "";
          let braceCount = 0;

          while (i < lines.length) {
            funcBody += lines[i] + "\n";
            braceCount += (lines[i].match(/{/g) || []).length;
            braceCount -= (lines[i].match(/}/g) || []).length;

            if (braceCount === 0) break;
            i++;
          }

          functionMemory[funcName] = {
            type: "Function",
            body: funcBody.trim(),
          };

          setFunctionMemory({ ...functionMemory });
          setLogs((prevLogs) => [
            ...prevLogs,
            `-- Allocated memory for Function : ${funcName}`,
          ]);
        }
      }

      await delay(2000);
    }
    setLogs((prevLogs) => [...prevLogs, `-- Phase 1 Completed.`]);
    await delay(1000);
    setPhase(2);
  };

  const executePhaseTwo = async () => {
    const lines = code.split("\n");
    let codeExeLogs = [];
    let updatedFunctionMemory = { ...functionMemory }; // Clone memory for updates
  
    setLogs((prevLogs) => [
      ...prevLogs,
      `Phase 2 of ${functionName}: Code Execution Started`,
    ]);
  
    for (let i = 0; i < lines.length; i++) {
      let trimmedLine = lines[i].trim();
      if (!trimmedLine || trimmedLine.startsWith("//")) continue;
  
      setCodeExecution((prevCode) => [...prevCode, trimmedLine]);
  
      const funcCallMatch = trimmedLine.match(/^([a-zA-Z_$][\w$]*)\s*\(/);
  
      if (trimmedLine.startsWith("function")) {
        let braceCount = 0;
        while (i < lines.length) {
          if (lines[i].includes("{")) braceCount++;
          if (lines[i].includes("}")) braceCount--;
          if (braceCount === 0) break;
          i++; // Move to function end
        }
        setLogs((prevLogs) => [...prevLogs, `-- Skipping function declaration`]);
        await delay(2000);
        continue;
      } else if (/^(var|let|const)\s+[a-zA-Z_$][\w$]*\s*(=.*)?/.test(trimmedLine)) {
        codeExeLogs.push(trimmedLine);
  
        const declarationMatch = trimmedLine.match(
          /(var|let|const)\s+([a-zA-Z_$][\w$]*)(\s*=\s*(.+))?;?$/  
        );
  
        if (declarationMatch) {
          const varType = declarationMatch[1];
          const varName = declarationMatch[2].trim();
          let valueExpression = declarationMatch[4]?.trim();
          let newValue;
  
          if (valueExpression) {
            try {
              newValue = evalExpression(valueExpression, updatedFunctionMemory);
            } catch (error) {
              console.error("Error evaluating expression:", error);
              newValue = undefined;
            }
          } else {
            newValue = varType === "var" ? undefined : "TDZ";
          }
  
          // ✅ Correctly update the function memory
          updatedFunctionMemory[varName] = { type: varType, value: newValue };
  
          setFunctionMemory({ ...updatedFunctionMemory }); // Update state
          setLogs((prevLogs) => [
            ...prevLogs,
            `-- Assigned value to variable: ${varName} = ${newValue}`,
          ]);
        }
      } else if (funcCallMatch) {
        const funcName = funcCallMatch[1];
        if (updatedFunctionMemory[funcName]) {
          codeExeLogs.push(`${funcName}()`);
          setLogs((prevLogs) => [
            ...prevLogs,
            `-- Function call detected: ${funcName}`,
          ]);
          await delay(2000);
          continue;
        }
      } else if (trimmedLine.startsWith("console.")) {
        const consoleMatch = trimmedLine.match(/console\.(log|warn|error)\((.*)\);?$/);
  
        if (consoleMatch) {
          const consoleType = consoleMatch[1];
          let consoleExpression = consoleMatch[2].trim();
  
          try {
            let expressions = consoleExpression.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
            let evaluatedOutputs = expressions.map((exp) => {
              exp = exp.trim();
  
              if (/^['"`].*['"`]$/.test(exp)) return exp.slice(1, -1); // Remove quotes
              if (exp === "true") return true;
              if (exp === "false") return false;
              if (exp === "null") return null;
              if (!isNaN(exp)) return Number(exp);
  
              try {
                if (/[+\-*/%<>!=&|^]/.test(exp)) {
                  return evalExpression(exp, updatedFunctionMemory);
                }
                let variableData = updatedFunctionMemory[exp.trim()];
                if (!variableData) return `${exp} is not defined`;
                if (variableData.value === "TDZ")
                  return `ReferenceError: Cannot access '${exp}' before initialization`;
                return variableData.value;
              } catch (error) {
                return "Error: Invalid expression";
              }
            });
  
            setConsoleUpdate((prevConsole) => [
              ...prevConsole,
              `-> ${evaluatedOutputs.join(" ")}`,
            ]);
  
            setLogs((prevLogs) => [
              ...prevLogs,
              `-- Console Output: ${evaluatedOutputs.join(" ")}`,
            ]);
          } catch (error) {
            console.error("Console execution error:", error);
          }
        }
      }
  
      await delay(2000);
    }
  
    setLogs((prevLogs) => [...prevLogs, `-- Phase 2 Completed`]);
    await delay(1000);
    setLogs((prevLogs) => [
      ...prevLogs,
      `Function Execution Completed: ${functionName}`,
    ]);
  
    setOnComplete();
  };
  
  return (
    <div className="w-full h-full flex  ">
      {/* Memory Section */}
      <div className="w-[40%] min-h-20 max-h-45 overflow-y-auto  border border-white rounded-l-lg p-4">
        <h2 className="text-white text-lg font-semibold">Memory</h2>
        <hr className="border-gray-500 my-2" />

        <div className="text-gray-300 text-sm w-full min-h-20 max-h-45 overflow-y-auto">
          {Object.keys(functionMemory).length > 0 ? (
            <ul className="list-disc text-sm pl-4">
              {Object.entries(functionMemory).map(([key, value], index) => (
                <li key={index} className="mb-1 list-none text-lg">
                  <span className="text-blue-400">{key}</span>:{" "}
                  <span className="text-yellow-400">{value.value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              No variables or functions stored yet.
            </p>
          )}
        </div>
      </div>

      {/* Code Execution Section */}
      <div className="w-[60%] h-[80%]    border border-white rounded-r-lg p-4">
        <h2 className="text-white text-lg font-semibold">Code Execution</h2>
        <hr className="border-gray-500 my-2" />

        <div className="w-full min-h-20 max-h-45 overflow-y-auto text-gray-300 text-sm custom-editor  ">
          {codeExecution.length > 0 ? (
            <ul className="list-none pl-2">
              {codeExecution.map((log, index) => (
                <li key={index} className="mb-1">
                  <span className="text-green-400">→ {String(log)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No code executed yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FunctionExecutionContext;
