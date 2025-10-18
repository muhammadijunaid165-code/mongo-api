import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import axios from 'axios'

const socket = io('/', { transports: ['websocket'] })

export default function Interview(){
  const [interviewId, setInterviewId] = useState<string>('')
  const [questions, setQuestions] = useState<string[]>([])
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [remaining, setRemaining] = useState(60)
  const startRef = useRef<number>(Date.now())

  useEffect(()=>{
    // anti-copy/screenshot
    const prevent=(e:any)=>e.preventDefault()
    document.addEventListener('copy', prevent)
    document.addEventListener('cut', prevent)
    document.addEventListener('paste', prevent)
    document.addEventListener('contextmenu', prevent)
    document.addEventListener('keydown', (e)=>{
      if ((e.ctrlKey||e.metaKey) && ['c','v','x','s','p'].includes(e.key.toLowerCase())) e.preventDefault()
      if (e.key === 'PrintScreen') e.preventDefault()
    })
    const blurHandler=()=>{ /* could notify backend */ }
    window.addEventListener('blur', blurHandler)

    socket.on('timer', (t:any)=> setRemaining(t.remaining))
    socket.on('interview:next', (p:any)=> { setIndex(p.index); setAnswer(''); startRef.current = Date.now() })
    socket.on('interview:complete', ()=> alert('Interview complete'))
    return ()=>{
      document.removeEventListener('copy', prevent)
      document.removeEventListener('cut', prevent)
      document.removeEventListener('paste', prevent)
      document.removeEventListener('contextmenu', prevent)
      window.removeEventListener('blur', blurHandler)
      socket.disconnect()
    }
  },[])

  async function start(){
    const jobId = prompt('Enter Job ID')
    const {data} = await axios.post('/api/interviews/start', { jobId }, { headers: auth() })
    setInterviewId(data.interviewId)
    setQuestions(data.questions)
    socket.connect()
    socket.emit('interview:join', { id: data.interviewId })
    startRef.current = Date.now()
  }
  function auth(){ return { Authorization: `Bearer ${localStorage.getItem('token')}` } }

  async function submitAnswer(){
    const timeTakenSec = Math.min(60, Math.round((Date.now()-startRef.current)/1000))
    socket.emit('interview:answer', { answer, timeTakenSec })
  }

  return (
    <div className='p-6 max-w-3xl mx-auto'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Secure Interview</h1>
        <div className='text-xl font-mono'>⏳ {remaining}s</div>
      </div>
      {!interviewId && <button onClick={start} className='mt-4 bg-black text-white px-4 py-2 rounded'>Start</button>}
      {interviewId && (
        <div className='mt-6 space-y-4 relative'>
          {/* Watermark */}
          <div className='pointer-events-none select-none fixed inset-0 opacity-10 -z-10 grid place-items-center'>
            <div className='text-6xl font-bold rotate-45'>AI Recruit • Confidential</div>
          </div>
          <div className='bg-white p-6 rounded shadow'>
            <div className='font-semibold mb-2'>Q{index+1}. {questions[index]}</div>
            <textarea value={answer} onChange={e=>setAnswer(e.target.value)} className='border w-full p-2 h-40' />
            <div className='flex justify-end'>
              <button onClick={submitAnswer} className='mt-3 bg-blue-600 text-white px-4 py-2 rounded'>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
