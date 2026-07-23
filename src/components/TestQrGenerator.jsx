import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

const ROOMS = [
  {
    name: 'ห้องประชุมใหญ่ ชั้น 1',
    haEntities: {
      lock: 'lock.hall_1_door',
      light: 'light.hall_1',
      climate: 'climate.hall_1_ac',
    },
  },
  {
    name: 'ห้องประชุม 101',
    haEntities: {
      lock: 'lock.room_101_door',
      light: 'light.room_101',
      climate: 'climate.room_101_ac',
    },
  },
  {
    name: 'ห้องประชุม 102',
    haEntities: {
      lock: 'lock.room_102_door',
      light: 'light.room_102',
      climate: 'climate.room_102_ac',
    },
  },
  {
    name: 'ห้องประชุมผู้บริหาร',
    haEntities: {
      lock: 'lock.exec_room_door',
      light: ['light.exec_room_main', 'light.exec_room_lamp'],
      climate: 'climate.exec_room_ac',
    },
  },
  {
    name: 'ห้อง Training A',
    haEntities: {
      lock: 'lock.training_a_door',
      light: 'light.training_a',
      climate: 'climate.training_a_ac',
    },
  },
  {
    name: 'ห้อง Board Room',
    haEntities: {
      lock: 'lock.board_room_door',
      light: ['light.board_room_main', 'light.board_room_lamp'],
      climate: 'climate.board_room_ac',
    },
  },
]

const GUEST_NAMES = [
  'สมชาย ใจดี',
  'สมหญิง รักเรียน',
  'วิชัย มั่นคง',
  'กมลชนก แสงทอง',
  'ณัฐพล เจริญสุข',
  'พิมพ์ชนก อารีย์',
  'ธนกร ศรีสุข',
  'อรวรรณ พงษ์ไพร',
]

const PURPOSES = [
  'ประชุมทีม',
  'สัมภาษณ์งาน',
  'นำเสนอโปรเจกต์',
  'อบรมพนักงาน',
  'ประชุมลูกค้า',
  'ประชุมผู้ถือหุ้น',
]

const START_HOURS = [8, 9, 10, 11, 13, 14, 15, 16]

function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function generateRandomBooking() {
  const bookingDate = new Date()
  bookingDate.setDate(bookingDate.getDate() + randomInt(0, 6))

  const startHour = pick(START_HOURS)
  const durationHours = pick([1, 1, 2])
  const room = pick(ROOMS)

  const booking = {
    bookingId: `BK-${bookingDate.getFullYear()}${pad(bookingDate.getMonth() + 1)}${pad(bookingDate.getDate())}-${randomInt(100, 999)}`,
    roomName: room.name,
    guestName: pick(GUEST_NAMES),
    purpose: pick(PURPOSES),
    date: formatDate(bookingDate),
    startTime: `${pad(startHour)}:00`,
    endTime: `${pad(startHour + durationHours)}:00`,
    attendees: randomInt(2, 20),
    haEntities: room.haEntities,
  }

  return JSON.stringify(booking, null, 2)
}

function TestQrGenerator({ onClose }) {
  const [text, setText] = useState(generateRandomBooking)
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
        rows={9}
      />
      <button
        type="button"
        className="secondary"
        onClick={() => setText(generateRandomBooking())}
      >
        สุ่มข้อมูลจอง
      </button>
      {dataUrl && <img src={dataUrl} alt="QR code" className="generated-qr" />}
      <button type="button" onClick={onClose}>
        ปิด
      </button>
    </div>
  )
}

export default TestQrGenerator
