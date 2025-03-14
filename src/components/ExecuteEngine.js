import { useEffect, useState, useCallback, useRef, memo } from "react";

function ExecuteEngine({
  code,
  setLogs,
  controlAction,
  memoryBlock,
  setMemoryBlock,
  setCallStackUpdate,
  phase,
  setPhase,
  setConsoleUpdate,
  setCodeExecution,
  setFunctionCall,
  setUpdatedMemory,
  isPausedRef,
  setFunctionName,
  setCallStackterminal
}) {
  const [executionInProgress, setExecutionInProgress] = useState(false);
  

  const delay = (ms) => {
    return new Promise((resolve) => {
      const checkPause = () => {
        if (!isPausedRef.current) {
          setTimeout(resolve, ms);
        } else {
          setTimeout(checkPause, 500);
        }
      };
      checkPause();
    });
  };
  function evalExpression(expression, memory) {
    try {
      let safeExpression = expression.replace(/\b[a-zA-Z_]\w*\b/g, (match) => {
        if (memory.global.variables.hasOwnProperty(match)) {
          let variableData = memory.global.variables[match];

          if (variableData.value === "TDZ") {
            throw new Error(
              `ReferenceError: Cannot access '${match}' before initialization`
            );
          }
          return variableData.value;
        }
        return `undefined`; // Variable is not defined
      });

      return new Function(`"use strict"; return (${safeExpression})`)();
    } catch (error) {
      return error.message; // Return error message instead of throwing
    }
  }

  const executeCode = useCallback(async () => {
    if (executionInProgress) return;
    setExecutionInProgress(true);
    isPausedRef.current = false;
    // const callStack = { GEC: "Global execution context is created and pushed" };
    if (phase === 1) {
      setLogs([]);
      // setMemoryBlock({});
      setCallStackUpdate((prev) => [...prev, "GEC"]); 

      setCallStackterminal((prev) => ({
        ...prev,
        [Date.now()]: "Global execution context is created and pushed"
      }));
      
      const logs = [];
      logs.push("Code Execution Started...");
      setLogs([...logs]);
      await delay(2000);

      logs.push("🔹 Phase 1: Memory Allocation");
      setLogs([...logs]);
      await delay(2000);

      const lines = code.split("\n"); // Splitting the code into lines

      for (let i = 0; i < lines.length; i++) {
        let trimmedLine = lines[i].trim();
        while (isPausedRef.current) await delay(500); // Pause if needed
        // ✅ Handling variable declarations
        if (
          trimmedLine.startsWith("var") ||
          trimmedLine.startsWith("let") ||
          trimmedLine.startsWith("const")
        ) {
          const varType = trimmedLine.startsWith("var ")
            ? "var"
            : trimmedLine.startsWith("let ")
            ? "let"
            : "const";

          const varName = trimmedLine.split(" ")[1]?.split("=")[0]?.trim();

          if (varName) {
            memoryBlock.global.variables[varName] = {
              type: varType,
              value: varType === "var" ? "undefined" : "TDZ",
            };
            setMemoryBlock({ ...memoryBlock }); // Update state with the latest object

            logs.push(`  - Allocated memory for variable:  ${varName}`);
            setLogs([...logs]);


            // ✅ Correct way to update `updatedMemory` without overwriting
            setUpdatedMemory((prev) => ({
              ...prev, // Keep existing values
              [varName]: memoryBlock.global.variables[varName], // Add new variable
            }));

            await delay(2000); // Simulate step-by-step execution
          }
        } else if (trimmedLine.startsWith("function")) {
          const funcName = trimmedLine.split(" ")[1]?.split("(")[0]?.trim();
          if (funcName) {
            let funcBody = "";
            let braceCount = 0;
            let startIndex = i;

            // Collect full function body (multi-line)
            while (i < lines.length) {
              funcBody += lines[i] + "\n";

              // Track opening and closing braces
              braceCount += (lines[i].match(/{/g) || []).length;
              braceCount -= (lines[i].match(/}/g) || []).length;

              if (braceCount === 0) {
                break; // Stop when function body closes
              }
              i++; // Move to next line
            }

            memoryBlock.global.functions[funcName] = {
              type: "Function",
              body: funcBody.trim(),
            };
            setMemoryBlock({ ...memoryBlock });
            setUpdatedMemory((prev) => ({
              ...prev, // Keep existing values
              [funcName]: memoryBlock.global.functions[funcName], // Add new variable
            }));

            logs.push(`  - Allocated memory for function: ${funcName}`);
            setLogs([...logs]);

            await delay(2000);
          }
        }
      }
      logs.push(
        "🔹Phase 1 Completed."
      ); 
      logs.push(
         `Press "Continue" to proceed to Phase 2.`
      ); 
      setLogs([...logs]);
      isPausedRef.current = true;
      setPhase(2);
    }
    if (phase === 2) {
      const codeExeLogs = [];
      setLogs((prevLogs) => [
        ...prevLogs,
        "🔹 Phase 2: Code Execution",
      ]);
      await delay(2000);

      const lines = code.split("\n");
      for (let i = 0; i < lines.length; i++) {
        let trimmedLine = lines[i].trim();
        while (isPausedRef.current) await delay(500);
      
        if (!trimmedLine || trimmedLine.startsWith("//")) continue;
        const funcCallMatch = trimmedLine.match(/^([a-zA-Z_$][\w$]*)\s*\(/);
        if (trimmedLine.startsWith("function")) {
          const funcName = trimmedLine.split(" ")[1]?.split("(")[0]?.trim();
          setLogs((prevLogs) => [
            ...prevLogs,
            `  - Skipping function declaration: ${funcName}`,
          ]);
      
          // ✅ Jump to the last line of the function
          let braceCount = 0;
          while (i < lines.length) {
            if (lines[i].includes("{")) braceCount++;
            if (lines[i].includes("}")) braceCount--;
            if (braceCount === 0) break;
            i++; // Move to the last line of the function
          }
          await delay(2000)
          continue;
        } else if (funcCallMatch) {
          const funcName = funcCallMatch[1];
          
          if (memoryBlock.global?.functions?.[funcName]) {
            setLogs((prevLogs) => [
              ...prevLogs,
              `  - Function call detected: ${funcName}()`,
            ]);
            codeExeLogs.push(`${funcName}()`);
            
            setCodeExecution([...codeExeLogs]);
            setFunctionName(funcName);
            setCallStackterminal((prev) => ({
              ...prev,
              [Date.now()]: "Function execution context is created and pushed"
            }));      
            setFunctionCall(true);
            await delay(2000);
            continue;
          } else {
            setLogs((prevLogs) => [
              ...prevLogs,
              `Error: Function ${funcName} is not defined`,
            ]);
          }
        } else if (trimmedLine.startsWith("console.")) {
          codeExeLogs.push(trimmedLine);
          const consoleMatch = trimmedLine.match(/console\.(log|warn|error)\((.*)\);?$/);
          if (consoleMatch) {
            const consoleType = consoleMatch[1]; // log, warn, error
            let consoleExpression = consoleMatch[2].trim();
      
            try {
              let expressions = consoleExpression.split(/,(?=(?:[^"']*["'][^"']*["'])*[^"']*$)/g);
      
              let evaluatedOutputs = expressions.map((exp) => {
                exp = exp.trim();
                if ((exp.startsWith('"') && exp.endsWith('"')) ||
                    (exp.startsWith("'") && exp.endsWith("'"))) {
                  return exp.slice(1, -1);
                } else if (exp.startsWith("`") && exp.endsWith("`")) {
                  return exp.slice(1, -1);
                } else if (!isNaN(exp)) {
                  return Number(exp);
                } else {
                  try {
                    if (/[+\-*/%<>!=&|^]/.test(exp)) {
                      return evalExpression(exp, memoryBlock); // ✅ Evaluate expressions
                    } else {
                      let variableData = memoryBlock?.global?.variables?.[exp.trim()];
                      if (!variableData) return `${exp} is not defined`;
                      if (variableData.value === "TDZ")
                        return `ReferenceError: Cannot access ${exp} before initialization`;
                      return variableData.value;
                    }
                  } catch (error) {
                    return "Error: Invalid expression";
                  }
                }
              });
      
              setConsoleUpdate((prevConsole) => [
                ...prevConsole,
                `-> ${evaluatedOutputs.join(" ")}`,
              ]);
              setLogs((prevLogs) => [
                ...prevLogs,
                // `Console ${consoleType}: ${evaluatedOutputs.join(" ")}`,
                `  - Console Output: ${evaluatedOutputs.join(" ")}`,
              ]);
            } catch (error) {
              setLogs((prevLogs) => [
                ...prevLogs,
                `- Error in console.${consoleType}: ${error.message}`,
              ]);
            }
            // await delay(2000);
          }
        } else if (/^(var|let|const)\s+[a-zA-Z_$][\w$]*\s*=/.test(trimmedLine)) {
          const declarationMatch = trimmedLine.match(/(var|let|const)\s+([a-zA-Z_$][\w$]*)\s*=\s*(.+?);?$/);
          codeExeLogs.push(trimmedLine);
          if (declarationMatch) {
            const varName = declarationMatch[2].trim();
            let valueExpression = declarationMatch[3].replace(/;$/, "").trim();
      
            try {
              let evaluatedValue = evalExpression(valueExpression, memoryBlock);
              
              // ✅ Create a new copy of memoryBlock
              const updatedMemoryBlock = { ...memoryBlock };
            
              // ✅ Update the variable while preserving type
              updatedMemoryBlock.global.variables = { 
                ...updatedMemoryBlock.global.variables,
                [varName]: { 
                  ...(updatedMemoryBlock.global.variables[varName] || { type: "let" }), // Preserve `type`
                  value: evaluatedValue 
                }
              };
              setUpdatedMemory((prev) => ({
                ...prev, // Preserve existing state
                [varName]: { 
                  ...(prev[varName] || { type: "let" }), // Preserve type if it exists
                  value: evaluatedValue, // Update value
                }
              }));
              
              setLogs((prevLogs) => [
                ...prevLogs,
                `  - Assigned value to variable: ${varName} = ${evaluatedValue}`,
              ]);
            
              setMemoryBlock(updatedMemoryBlock);
              
            } catch (error) {
              setLogs((prevLogs) => [
                ...prevLogs,
                `  - Error in evaluating ${varName}: ${error.message}`,
              ]);
            }
             
          } else {
            setLogs((prevLogs) => [
              ...prevLogs,
              `  - Syntax error in variable declaration: ${trimmedLine}`,
            ]);
          }
        }
        setCodeExecution([...codeExeLogs]);
        await delay(2000)
      }
      

      setLogs((prevLogs) => [
        ...prevLogs,
        "🔹 Phase 2 Completed.",
      ]);
      await delay(1000)
      setLogs((prevLogs) => [
        ...prevLogs,
        `🔚 End of Program. Code Execution Finished.`,
      ]);
      setCallStackterminal((prev) => ({
        ...prev,
        [Date.now()]: "Global Execution Context is popped"
      }));
      setCallStackUpdate((prev) => prev.slice(0, -1)); 
    }
    
    setExecutionInProgress(false);
  }, [
    code,
    executionInProgress,
    phase,
    setLogs,
    setMemoryBlock,
    setCallStackUpdate,
  ]);

  useEffect(() => {
    if (controlAction === "Run" && !executionInProgress) {
      isPausedRef.current = false;
      executeCode();
    }
    if (controlAction === "Pause") {
      isPausedRef.current = true;
    }
    if (controlAction === "Continue") {
      isPausedRef.current = false;
      executeCode();
    }
    if (controlAction === "Reset") {
      setLogs([]);
      setConsoleUpdate([]);
      setCodeExecution([]);
      setMemoryBlock([]);
      setCallStackUpdate((prev) => [...prev, "GEC"]); 
      setUpdatedMemory([]);
      isPausedRef.current = false;
      setExecutionInProgress(false);
      setPhase(1);
    }
  }, [controlAction]);

  return null;
}
export default ExecuteEngine;
