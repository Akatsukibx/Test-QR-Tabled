import { useState } from 'react'
import IdleScreen from './components/IdleScreen'
import ScannerScreen from './components/ScannerScreen'
import ResultScreen from './components/ResultScreen'
import ErrorScreen from './components/ErrorScreen'
import TestQrGenerator from './components/TestQrGenerator'
import './App.css'

const VIEW = {
  IDLE: 'idle',
  SCANNING: 'scanning',
  RESULT: 'result',
  ERROR: 'error',
  GENERATOR: 'generator',
}

function App() {
  const [view, setView] = useState(VIEW.IDLE)
  const [scanResult, setScanResult] = useState('')
  const [scanError, setScanError] = useState(null)

  const handleScanSuccess = (text) => {
    setScanResult(text)
    setView(VIEW.RESULT)
  }

  const handleScanError = (error) => {
    setScanError(error)
    setView(VIEW.ERROR)
  }

  return (
    <div className="app">
      {view === VIEW.IDLE && (
        <IdleScreen
          onTap={() => setView(VIEW.SCANNING)}
          onOpenGenerator={() => setView(VIEW.GENERATOR)}
        />
      )}
      {view === VIEW.SCANNING && (
        <ScannerScreen
          onResult={handleScanSuccess}
          onCancel={() => setView(VIEW.IDLE)}
          onError={handleScanError}
        />
      )}
      {view === VIEW.RESULT && (
        <ResultScreen result={scanResult} onDone={() => setView(VIEW.IDLE)} />
      )}
      {view === VIEW.ERROR && (
        <ErrorScreen
          error={scanError}
          onRetry={() => setView(VIEW.SCANNING)}
          onBack={() => setView(VIEW.IDLE)}
        />
      )}
      {view === VIEW.GENERATOR && (
        <TestQrGenerator onClose={() => setView(VIEW.IDLE)} />
      )}
    </div>
  )
}

export default App
