import { useEffect, useState } from 'react'
import { openRoom } from '../lib/homeAssistant'

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

// Metadata used to control Home Assistant, not meant to be shown to staff.
const HIDDEN_FIELDS = ['haEntities']

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

const ROOM_STATUS = {
  IDLE: 'idle',
  OPENING: 'opening',
  OPENED: 'opened',
  FAILED: 'failed',
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
        ...Object.keys(booking).filter(
          (key) => !FIELD_ORDER.includes(key) && !HIDDEN_FIELDS.includes(key),
        ),
      ]
    : []

  const [roomStatus, setRoomStatus] = useState(
    booking?.haEntities ? ROOM_STATUS.OPENING : ROOM_STATUS.IDLE,
  )
  const [roomError, setRoomError] = useState('')

  useEffect(() => {
    if (!booking?.haEntities) return
    let cancelled = false

    openRoom(booking.haEntities)
      .then(() => {
        if (!cancelled) setRoomStatus(ROOM_STATUS.OPENED)
      })
      .catch((err) => {
        if (cancelled) return
        setRoomStatus(ROOM_STATUS.FAILED)
        setRoomError(err.message || String(err))
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="result-screen">
      <div className="result-icon">✓</div>
      <p className="result-label">ยืนยันการจองสำเร็จ</p>

      {roomStatus === ROOM_STATUS.OPENING && (
        <p className="room-status room-status-pending">กำลังเปิดห้อง...</p>
      )}
      {roomStatus === ROOM_STATUS.OPENED && (
        <p className="room-status room-status-ok">เปิดประตู / ไฟ / แอร์แล้ว</p>
      )}
      {roomStatus === ROOM_STATUS.FAILED && (
        <p className="room-status room-status-error">เปิดห้องอัตโนมัติไม่สำเร็จ: {roomError}</p>
      )}

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
