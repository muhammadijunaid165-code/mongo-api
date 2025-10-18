import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Jobs(){
  const [jobs,setJobs]=useState<any[]>([])
  const [title,setTitle]=useState('')
  const [description,setDescription]=useState('')
  const [skills,setSkills]=useState('')

  useEffect(()=>{ load() },[])
  async function load(){
    const {data}=await axios.get('/api/jobs', { headers: auth() })
    setJobs(data)
  }
  function auth(){ return { Authorization: `Bearer ${localStorage.getItem('token')}` } }

  async function createJob(){
    await axios.post('/api/jobs',{title,description,skills:skills.split(',').map(s=>s.trim())},{ headers: auth() })
    setTitle('');setDescription('');setSkills('');
    await load()
  }

  return (
    <div className='p-6 space-y-4'>
      <h1 className='text-2xl font-bold'>Jobs</h1>
      <div className='bg-white p-4 rounded shadow space-y-2'>
        <input className='border p-2 w-full' placeholder='Title' value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className='border p-2 w-full' placeholder='Description' value={description} onChange={e=>setDescription(e.target.value)} />
        <input className='border p-2 w-full' placeholder='Skills (comma separated)' value={skills} onChange={e=>setSkills(e.target.value)} />
        <button onClick={createJob} className='bg-black text-white px-4 py-2 rounded'>Create</button>
      </div>
      <ul className='space-y-2'>
        {jobs.map(j=> (
          <li key={j._id} className='bg-white p-4 rounded shadow'>
            <div className='font-semibold'>{j.title}</div>
            <div className='text-sm text-gray-600'>{j.description}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
