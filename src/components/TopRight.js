import React, { useEffect } from 'react'
import ExecutionContext from './ExecutionContext'
import PlaybackControls from './PlaybackControls'

function TopRight({setControlAction, memoryBlock,  phase,codeExecution, FunctionCall,resetFunctionCall , updatedMemory , isPausedRef,setCallStackUpdate,setLogs,setConsoleUpdate,functionName , setCallStackterminal,controlAction}) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-between  ">
      <div className=' w-full flex  '>
        <h2 className="text-xl font-bold mt-2 ml-[200px] ">Execution Context (Phase {phase}) </h2>
        <h2 className="text-xl font-bold mt-2 ml-[380px] ">Playback </h2>

      </div>
        <div className="w-full  h-[85%] flex   ">
            <ExecutionContext 
              memoryBlock={memoryBlock}
              phase={phase} 
              codeExecution={codeExecution}
              FunctionCall={FunctionCall}
              resetFunctionCall={resetFunctionCall}
              updatedMemory={updatedMemory}
              isPausedRef={isPausedRef}
              setCallStackUpdate={setCallStackUpdate}
              setLogs={setLogs}
              setConsoleUpdate={setConsoleUpdate}
              functionName={functionName}
              setCallStackterminal={setCallStackterminal}
              controlAction={controlAction}
           />
            <PlaybackControls setControlAction={setControlAction} />

        </div>
    </div>
  )
}

export default TopRight