const MESSAGES = {
  NotAllowedError: 'ไม่ได้รับอนุญาตให้เข้าถึงกล้อง กรุณาอนุญาตการใช้กล้องในตั้งค่าเบราว์เซอร์',
  NotFoundError: 'ไม่พบกล้องบนอุปกรณ์นี้',
  NotReadableError: 'ไม่สามารถเข้าถึงกล้องได้ อาจมีแอปอื่นใช้งานกล้องอยู่',
  OverconstrainedError: 'ไม่พบกล้องหน้าที่ตรงกับเงื่อนไขที่ต้องการ',
  SecurityError: 'ต้องเปิดผ่าน HTTPS หรือ localhost เท่านั้นถึงจะใช้กล้องได้',
}

function ErrorScreen({ error, onRetry, onBack }) {
  const name = error?.name || 'UnknownError'
  const friendlyMessage = MESSAGES[name] || 'ไม่สามารถเปิดกล้องได้'

  return (
    <div className="error-screen">
      <div className="error-icon">!</div>
      <p className="error-label">{friendlyMessage}</p>
      <code className="error-detail">
        {name}
        {error?.message ? `: ${error.message}` : ''}
      </code>
      <div className="error-actions">
        <button type="button" onClick={onRetry}>
          ลองอีกครั้ง
        </button>
        <button type="button" className="secondary" onClick={onBack}>
          กลับ
        </button>
      </div>
    </div>
  )
}

export default ErrorScreen
