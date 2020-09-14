import Modal from 'antd/lib/modal/Modal'
import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { Alert, Tag } from 'antd'
import { ResponsiveBar } from '@nivo/bar'
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
  animation: 'rotation 2s infinite linear',
  borderRadius: '50%',
  backgroundImage: 'url(/favicon.ico)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '50%',
  backgroundOrigin: 'content-box',
  backgroundPosition: '50% 50%',
}

interface Record {
  cuit: string
  amount: number
}

interface RecordDetail {
  index: string
  title: string
  href: string
  detail1: string
  detail2: string
  detail3: string
  title2: string
  entity: string
  subtitle: string
  date: string
  content1: string
  content2: string
  content3: string
  amount: number
}

const Main: React.FC = () => {
  const [records, setRecords] = useState<Array<Record>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [detailCuit, setDetailCuit] = useState<string>('')
  const [detail, setDetail] = useState<Array<RecordDetail>>()

  const getRecords = async () => {
    setLoading(true)
    const res = await fetch('/api/amountsbycuit.py?search')
    const newData = await res.json()
    const d = newData.data
      // .map((d: Record) => ({ ...d, amount: Math.log10(d.amount) }))
      .filter((d: Record) => d.amount > 0 && d.cuit != '0')
      .reverse()
    setRecords(d)
    setLoading(false)
  }

  useEffect(() => {
    getRecords()
  }, [])

  const getDetail = async (cuit: string) => {
    setLoading(true)
    const res = await fetch(`/api/cuit.py?search=${cuit}`)
    const newData = await res.json()
    const d = newData.data
    setDetail(d)
    setLoading(false)
  }

  useEffect(() => {
    if (detailCuit) {
      getDetail(detailCuit)
    }
  }, [detailCuit])

  return (
    <>
      <Alert
        type="warning"
        message="Esta app es todavia una prueba de concepto. La informacion no esta completamente limpia, hay duplicacion de datos y falta parsear la mitad del BORA"
      />
      {loading ? (
        <div style={spinnerStyle}>
          <SpinnerCircular style={spinningImgStyle} thickness={200} color="#444" secondaryColor="#FFF" />
          <span style={spinnerSpanStyle}>Cargando</span>
          <span style={spinnerSpanStyle}>data boravisual</span>
        </div>
      ) : null}
      <Modal visible={!!detailCuit} onCancel={() => setDetailCuit('')} onOk={() => setDetailCuit('')}>
        <div>
          {detailCuit}
          &nbsp;
          <a href={`https://www.cuitonline.com/search.php?q=${detailCuit.replace(/-/g, '')}`} target="_blank">
            mas info...
          </a>
        </div>
        <div>Total: $ {detail?.reduce((prev, detail) => prev + detail.amount, 0)?.toLocaleString()}</div>
        <hr />
        {detail?.map((d, i) => (
          <div key={d.index}>
            <div className="bold">{d.subtitle}</div>
            <div>
              <a href={d.href} target="_blank">
                {d.date.replace('Fecha de publicación ', '')}
              </a>
            </div>
            <div>{d.entity}</div>
            <div>
              <Tag color="green">$ {d.amount.toLocaleString()}</Tag>
            </div>
            <div className="pre">
              <span>{d.content1}:</span>
            </div>
            <div className="light">
              <span>id: {d.content2}</span>
            </div>
            <hr />
          </div>
        ))}
      </Modal>
      <div style={{ height: '10000px' }}>
        <ResponsiveBar
          data={records}
          keys={['amount']}
          indexBy="cuit"
          layout="horizontal"
          enableGridY={false}
          enableGridX={true}
          tooltipFormat={(v) => `$ ${v.toLocaleString()}`}
          labelFormat={(v) => `$ ${v.toLocaleString()}`}
          onClick={(bar) => setDetailCuit(bar.data.cuit.toString())}
          colors={['#ade']}
        />
      </div>
    </>
  )
}

export default Main
