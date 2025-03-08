import React from 'react'
import ExecutionContext from './ExecutionContext'
import PlaybackControls from './PlaybackControls'

function TopRight({setControlAction, memoryBlock,  phase,codeExecution, FunctionCall,resetFunctionCall , updatedMemory}) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-between  ">
      <div className=' w-full flex  '>
        <h2 className="text-xl font-bold mt-2 ml-[240px] ">Execution Context</h2>
        <h2 className="text-xl font-bold mt-2 ml-[450px] ">Playback </h2>

      </div>
        <div className="w-full  h-[85%] flex   ">
            <ExecutionContext memoryBlock={memoryBlock}   phase={phase} codeExecution={codeExecution} FunctionCall={FunctionCall} resetFunctionCall={resetFunctionCall} updatedMemory={updatedMemory} />
            <PlaybackControls setControlAction={setControlAction} />

        </div>
    </div>
  )
}

export default TopRight