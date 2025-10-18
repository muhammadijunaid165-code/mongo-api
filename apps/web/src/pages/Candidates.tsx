import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Candidates(){
  const [applications,setApplications]=useState<any[]>([])
  const [jobId,setJobId]=useState('')

  async function load(){
    const {data}=await axios.get(`/api/applications/job/${jobId}`, { headers: auth() })
    setApplications(data)
  }
  function auth(){ return { Authorization: `Bearer ${localStorage.getItem('token')}` } }

  return (
    <div className='p-6 space-y-4'>
      <h1 className='text-2xl font-bold'>Applicants</h1>
      <div className='bg-white p-4 rounded shadow space-y-2'>
        <input className='border p-2 w-80' placeholder='Job ID' value={jobId} onChange={e=>setJobId(e.target.value)} />
        <button onClick={load} className='bg-black text-white px-4 py-2 rounded'>Load</button>
      </div>
      <ul className='space-y-2'>
        {applications.map(a=> (
          <li key={a._id} className='bg-white p-4 rounded shadow'>
            <div className='font-semibold'>{a.userId?.name} — Match {a.matchScore}%</div>
            <div className='text-sm text-gray-600'>{a.userId?.email}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
