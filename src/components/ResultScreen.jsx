import { useEffect } from 'react'

const AUTO_RETURN_MS = 60000

const FIELD_LABELS = {
  bookingId: 'รหัสการจอง',
  roomName: 'ห้อง',
  guestName: 'ผู้จอง',
  purpose: 'หัวข้อ',
  date: 'วันที่',
  startTime: 'เวลาเริ่ม',
  endTime: 'เวลาสิ้นสุด',
  attendees: 'จำนวนผู้เข้าร่วม',
}

const FIELD_ORDER = [
  'roomName',
  'guestName',
  'purpose',
  'date',
  'startTime',
  'endTime',
  'attendees',
  'bookingId',
]

function parseBooking(raw) {
  try {
    const data = JSON.parse(raw)
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return data
    }
  } catch {
    // Not JSON — caller falls back to showing the raw scanned text.
  }
  return null
}

function ResultScreen({ result, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, AUTO_RETURN_MS)
    return () => clearTimeout(timer)
  }, [onDone])

  const booking = parseBooking(result)
  const orderedKeys = booking
    ? [
        ...FIELD_ORDER.filter((key) => key in booking),
        ...Object.keys(booking).filter((key) => !FIELD_ORDER.includes(key)),
      ]
    : []

  return (
    <div className="result-screen">
      <div className="result-icon">✓</div>
      <p className="result-label">ยืนยันการจองสำเร็จ</p>

      {booking ? (
        <div className="booking-card">
          {orderedKeys.map((key) => (
            <div className="booking-row" key={key}>
              <span className="booking-key">{FIELD_LABELS[key] || key}</span>
              <span className="booking-value">{String(booking[key])}</span>
            </div>
          ))}
        </div>
      ) : (
        <code className="result-text">{result}</code>
      )}

      <button type="button" className="result-done" onClick={onDone}>
        เสร็จสิ้น
      </button>
    </div>
  )
}

export default ResultScreen
