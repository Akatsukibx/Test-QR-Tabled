import { useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

const SCANNER_ID = 'qr-scanner-region'

function ScannerScreen({ onResult, onCancel }) {
  const onResultRef = useRef(onResult)
  const onCancelRef = useRef(onCancel)
  onResultRef.current = onResult
  onCancelRef.current = onCancel

  useEffect(() => {
    const scanner = new Html5Qrcode(SCANNER_ID)
    let hasResult = false
    let cancelled = false

    scanner
      .start(
        { facingMode: 'user' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          if (hasResult) return
          hasResult = true
          scanner.stop().catch(() => {})
          onResultRef.current(decodedText)
        },
        () => {},
      )
      .catch(() => {
        if (!cancelled) onCancelRef.current()
      })

    return () => {
      cancelled = true
      if (scanner.isScanning) {
        scanner.stop().catch(() => {})
      }
    }
  }, [])

  return (
    <div className="scanner-screen">
      <div id={SCANNER_ID} className="qr-scanner-region" />
      <p className="scanner-hint">วาง QR Code ให้อยู่ในกรอบ</p>
      <button type="button" className="cancel-button" onClick={onCancel}>
        ยกเลิก
      </button>
    </div>
  )
}

export default ScannerScreen
