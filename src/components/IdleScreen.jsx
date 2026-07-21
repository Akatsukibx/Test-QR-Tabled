function IdleScreen({ onTap, onOpenGenerator }) {
  return (
    <div className="idle-screen" onClick={onTap}>
      <div className="idle-content">
        <h1>แตะหน้าจอเพื่อสแกน QR Code</h1>
        <p>สแกนเพื่อยืนยันการจองห้อง</p>
      </div>
      <button
        type="button"
        className="generator-link"
        onClick={(e) => {
          e.stopPropagation()
          onOpenGenerator()
        }}
      >
        สร้าง QR ทดสอบ
      </button>
    </div>
  )
}

export default IdleScreen
