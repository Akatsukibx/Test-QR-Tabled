import { useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

const SCANNER_ID = 'qr-scanner-region'
const QR_BOX_SIZE = 260

function ScannerScreen({ onResult, onCancel }) {
  const onResultRef = useRef(onResult)
  const onCancelRef = useRef(onCancel)
  onResultRef.current = onResult
  onCancelRef.current = onCancel

  useEffect(() => {
    let cancelled = false
    let hasResult = false
    const scanner = new Html5Qrcode(SCANNER_ID)

    const startPromise = scanner.start(
      { facingMode: 'user' },
      { fps: 10, qrbox: { width: QR_BOX_SIZE, height: QR_BOX_SIZE } },
      (decodedText) => {
        if (hasResult || cancelled) return
        hasResult = true
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => {})
        onResultRef.current(decodedText)
      },
      () => {},
    )

    startPromise.catch(() => {
      if (!cancelled) onCancelRef.current()
    })

    return () => {
      cancelled = true
      startPromise
        .then(() => scanner.stop())
        .then(() => scanner.clear())
        .catch(() => {})
    }
  }, [])

  return (
    <div className="scanner-screen">
      <div id={SCANNER_ID} className="qr-video-layer" />

      <div className="scanner-overlay">
        <button
          type="button"
          className="scanner-back"
          onClick={onCancel}
          aria-label="ยกเลิก"
        >
          ‹
        </button>

        <div className="viewfinder">
          <span className="corner corner-tl" />
          <span className="corner corner-tr" />
          <span className="corner corner-bl" />
          <span className="corner corner-br" />
        </div>

        <p className="scanner-hint">วาง QR Code ให้อยู่ในกรอบ</p>
      </div>
    </div>
  )
}

export default ScannerScreen
