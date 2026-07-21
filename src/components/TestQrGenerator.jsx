import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

function TestQrGenerator({ onClose }) {
  const [text, setText] = useState('BOOKING-ROOM-101-2026-07-21')
  const [dataUrl, setDataUrl] = useState('')

  useEffect(() => {
    QRCode.toDataURL(text || ' ', { width: 280, margin: 2 })
      .then(setDataUrl)
      .catch(() => setDataUrl(''))
  }, [text])

  return (
    <div className="generator-screen">
      <h2>สร้าง QR Code ทดสอบ</h2>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ข้อความสำหรับ QR"
      />
      {dataUrl && <img src={dataUrl} alt="QR code" className="generated-qr" />}
      <button type="button" onClick={onClose}>
        ปิด
      </button>
    </div>
  )
}

export default TestQrGenerator
