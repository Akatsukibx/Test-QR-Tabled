import { useState } from 'react'
import IdleScreen from './components/IdleScreen'
import ScannerScreen from './components/ScannerScreen'
import ResultScreen from './components/ResultScreen'
import TestQrGenerator from './components/TestQrGenerator'
import './App.css'

const VIEW = {
  IDLE: 'idle',
  SCANNING: 'scanning',
  RESULT: 'result',
  GENERATOR: 'generator',
}

function App() {
  const [view, setView] = useState(VIEW.IDLE)
  const [scanResult, setScanResult] = useState('')

  const handleScanSuccess = (text) => {
    setScanResult(text)
    setView(VIEW.RESULT)
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
        />
      )}
      {view === VIEW.RESULT && (
        <ResultScreen result={scanResult} onDone={() => setView(VIEW.IDLE)} />
      )}
      {view === VIEW.GENERATOR && (
        <TestQrGenerator onClose={() => setView(VIEW.IDLE)} />
      )}
    </div>
  )
}

export default App
