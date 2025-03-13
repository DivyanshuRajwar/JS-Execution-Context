function StackTerminal({ CallStackUpdate }) {
  const stackTerminal = {...CallStackUpdate}
  return (
    <div className='w-[65%] h-full border rounded-lg flex flex-col justify-between items-center'>
      <h2 className="text-white text-lg mt-2 font-semibold">Stack Terminal</h2>
      <div className="w-full h-[88%] bg-[#212121] border rounded-lg p-2 
      text-lg text-white">
        {Object.entries(stackTerminal).map(([key, value], index) => (
          <p className="text-cyan-400" key={index}>{`-> ${value}`}</p>
        ))}
      </div>
    </div>
  );
}


export default StackTerminal