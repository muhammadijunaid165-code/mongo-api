import { useState } from 'react'
import axios from 'axios'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [loading,setLoading]=useState(false)

  async function handleSubmit(e:any){
    e.preventDefault();
    setLoading(true)
    try{
      const {data} = await axios.post('/api/auth/login', {email,password})
      localStorage.setItem('token', data.accessToken)
      window.location.href='/dashboard'
    }finally{ setLoading(false)}
  }
  return (
    <div className='min-h-screen grid place-items-center'>
      <form onSubmit={handleSubmit} className='bg-white p-6 rounded shadow w-96 space-y-3'>
        <h1 className='text-xl font-semibold'>Login</h1>
        <input className='border w-full p-2' placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
        <input className='border w-full p-2' placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
        <button disabled={loading} className='bg-black text-white px-4 py-2 rounded w-full'>{loading? '...' : 'Login'}</button>
      </form>
    </div>
  )
}
