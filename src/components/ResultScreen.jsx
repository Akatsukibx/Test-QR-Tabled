import { useEffect } from 'react'

const AUTO_RETURN_MS = 2500

function ResultScreen({ result, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, AUTO_RETURN_MS)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div className="result-screen">
      <div className="result-icon">✓</div>
      <p className="result-label">สแกนสำเร็จ</p>
      <code className="result-text">{result}</code>
    </div>
  )
}

export default ResultScreen
