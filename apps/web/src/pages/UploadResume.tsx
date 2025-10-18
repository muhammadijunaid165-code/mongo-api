import { useState } from 'react'
import axios from 'axios'

export default function UploadResume(){
  const [file,setFile]=useState<File|null>(null)
  const [uploading,setUploading]=useState(false)
  const [url,setUrl]=useState('')

  function auth(){ return { Authorization: `Bearer ${localStorage.getItem('token')}` } }

  async function upload(){
    if(!file) return
    setUploading(true)
    try{
      const form = new FormData()
      form.append('file', file)
      const {data}=await axios.post('/api/resumes/upload', form, { headers: { ...auth(), 'Content-Type': 'multipart/form-data' } })
      setUrl(data.fileUrl)
    } finally { setUploading(false) }
  }

  return (
    <div className='p-6 space-y-3'>
      <h1 className='text-2xl font-bold'>Upload Resume</h1>
      <input type='file' onChange={e=>setFile(e.target.files?.[0]||null)} />
      <button disabled={uploading} onClick={upload} className='bg-black text-white px-4 py-2 rounded'>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {url && <a className='text-blue-600 underline' href={url} target='_blank'>View Resume</a>}
    </div>
  )
}
