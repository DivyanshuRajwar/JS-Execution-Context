function StackTerminal({ CallStackUpdate }) {
  return (
    <div className='w-[60%] h-full border rounded-lg flex flex-col justify-between items-center'>
      <h2 className="text-white text-lg mt-2 font-semibold">Stack Terminal</h2>
      <div className="w-full h-[88%] bg-[#212121] border rounded-xl p-2 text-white">
        {Object.entries(CallStackUpdate).map(([key, value], index) => (
          <p key={index}>{`-> ${value}`}</p>
        ))}
      </div>
    </div>
  );
}


export default StackTerminal