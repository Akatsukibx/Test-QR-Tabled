import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

const SAMPLE_BOOKING = JSON.stringify(
  {
    bookingId: 'BK-2026-0721-001',
    roomName: 'ห้องประชุม 101',
    guestName: 'สมชาย ใจดี',
    date: '2026-07-21',
    startTime: '14:00',
    endTime: '15:00',
  },
  null,
  2,
)

function TestQrGenerator({ onClose }) {
  const [text, setText] = useState(SAMPLE_BOOKING)
  const [dataUrl, setDataUrl] = useState('')

  useEffect(() => {
    QRCode.toDataURL(text || ' ', { width: 280, margin: 2 })
      .then(setDataUrl)
      .catch(() => setDataUrl(''))
  }, [text])

  return (
    <div className="generator-screen">
      <h2>สร้าง QR Code ทดสอบ</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ข้อความหรือ JSON สำหรับ QR"
        rows={7}
      />
      <button
        type="button"
        className="secondary"
        onClick={() => setText(SAMPLE_BOOKING)}
      >
        โหลดตัวอย่างข้อมูลจอง
      </button>
      {dataUrl && <img src={dataUrl} alt="QR code" className="generated-qr" />}
      <button type="button" onClick={onClose}>
        ปิด
      </button>
    </div>
  )
}

export default TestQrGenerator
