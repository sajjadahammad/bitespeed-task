import { ReactFlowProvider } from '@xyflow/react'
import '@xyflow/react/dist/style.css';
import FlowBuilder from './components/FlowBuilder';

function App() {
  return (
    <ReactFlowProvider>
      <FlowBuilder />
    </ReactFlowProvider>
  )
}

export default App
