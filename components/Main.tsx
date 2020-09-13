import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { SpinnerCircular } from 'spinners-react'

const spinnerStyle: CSSProperties = {
  position: 'absolute',
  top: '50%',
  right: '50%',
  zIndex: 10000,
  background: 'rgba(255,255,255,0.95)',
  padding: '10px',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  border: '3px solid rgba(155,155,155,0.95)',
}
const spinnerSpanStyle: CSSProperties = {
  padding: '4px 0',
}
const spinningImgStyle: CSSProperties = {
  animation: 'rotation 4s infinite linear',
  borderRadius: '50%',
  backgroundImage: 'url(/favicon.ico)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundOrigin: 'content-box',
  backgroundPosition: '5px 12px',
}

interface Record {
  id: string
  cuit: string
  amount: string
}

const Main: React.FC = () => {
  const [records, setRecords] = useState<Array<Record>>([])
  const [loading, setLoading] = useState<boolean>(false)

  const getRecords = async () => {
    setLoading(true)
    const res = await fetch('/api/amountsbycuit')
    const newData = await res.json()
    setRecords(newData)
    setLoading(false)
  }

  useEffect(() => {
    getRecords()
  }, [])

  return (
    <>
      {loading ? (
        <div style={spinnerStyle}>
          <SpinnerCircular style={spinningImgStyle} thickness={200} color="#444" secondaryColor="#FFF" />
          <span style={spinnerSpanStyle}>Cargando</span>
          <span style={spinnerSpanStyle}>data boravisual</span>
        </div>
      ) : null}
      {records.map((r) => (
        <div key={r.id}>
          <span>{r.cuit}</span>
          <span>{r.amount}</span>
        </div>
      ))}
    </>
  )
}

export default Main
