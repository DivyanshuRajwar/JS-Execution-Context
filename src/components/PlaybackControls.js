import React, { useEffect, useState } from "react";
import Button from "./Button";
import ExecuteEngine from "./ExecuteEngine";

function PlaybackControls({setControlAction}) {
//   const [controlAction, setControlAction] = useState(null);


  return (
    <div className="h-full w-[15%] border rounded-lg ml-2 flex flex-col pt-4 gap-4 items-center bg-[#212121]">
      <Button label="Run"  onClick={() => setControlAction("Run")} />  
      <Button label="Pause" onClick={() => setControlAction("Pause")} />
      <Button label="Continue" onClick={() => setControlAction("Continue")} />
      <Button label="Reset" onClick={() => setControlAction("Reset")} />
    </div>
  );
}

export default PlaybackControls;
