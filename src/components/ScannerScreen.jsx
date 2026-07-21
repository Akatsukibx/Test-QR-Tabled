import { useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

const SCANNER_ID = 'qr-scanner-region'
const QR_BOX_SIZE = 260

const KNOWN_ERROR_NAMES = [
  'NotAllowedError',
  'NotFoundError',
  'NotReadableError',
  'OverconstrainedError',
  'SecurityError',
]

function toErrorObject(err) {
  if (err instanceof Error && KNOWN_ERROR_NAMES.includes(err.name)) return err

  const message = typeof err === 'string' ? err : err?.message || JSON.stringify(err)
  const matchedName = KNOWN_ERROR_NAMES.find((name) => message.includes(name))

  const wrapped = new Error(message)
  wrapped.name = matchedName || err?.name || 'UnknownError'
  return wrapped
}

function ScannerScreen({ onResult, onCancel, onError }) {
  const onResultRef = useRef(onResult)
  const onErrorRef = useRef(onError)
  onResultRef.current = onResult
  onErrorRef.current = onError

  useEffect(() => {
    let cancelled = false
    let hasResult = false

    if (!navigator.mediaDevices?.getUserMedia) {
      onErrorRef.current(
        Object.assign(new Error('เบราว์เซอร์นี้ไม่รองรับการเข้าถึงกล้อง (ต้องเป็น HTTPS หรือ localhost)'), {
          name: 'SecurityError',
        }),
      )
      return
    }

    const scanner = new Html5Qrcode(SCANNER_ID)

    // Ensures the camera stream is only ever stopped once — calling
    // Html5Qrcode.stop() twice concurrently (once from the success handler,
    // once from unmount cleanup) leaves the camera hardware not fully
    // released, so the next scan attempt fails to reacquire it.
    let stopping = null
    const stopScanner = () => {
      if (!stopping) {
        stopping = scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => {})
      }
      return stopping
    }

    const startPromise = scanner.start(
      { facingMode: 'user' },
      { fps: 10, qrbox: { width: QR_BOX_SIZE, height: QR_BOX_SIZE } },
      (decodedText) => {
        if (hasResult || cancelled) return
        hasResult = true
        stopScanner().then(() => onResultRef.current(decodedText))
      },
      () => {},
    )

    startPromise.catch((err) => {
      if (!cancelled) onErrorRef.current(toErrorObject(err))
    })

    return () => {
      cancelled = true
      startPromise.then(() => stopScanner()).catch(() => {})
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
