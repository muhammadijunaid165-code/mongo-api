export default function Dashboard(){
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Recruiter Dashboard</h1>
      <div className='grid grid-cols-3 gap-4'>
        <div className='bg-white p-4 rounded shadow'>Match Distribution</div>
        <div className='bg-white p-4 rounded shadow'>Top Matches</div>
        <div className='bg-white p-4 rounded shadow'>AI Uptime</div>
      </div>
    </div>
  )
}