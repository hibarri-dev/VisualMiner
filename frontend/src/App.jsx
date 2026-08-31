import React from 'react'
import AppLayout from './components/layout/AppLayout'
import Viewport from './components/views/Viewport'
import { MineDataProvider } from './context/MineDataContext'

export default function App() {
  return (
    <MineDataProvider>
      <AppLayout>
        {viewportProps => <Viewport {...viewportProps} />}
      </AppLayout>
    </MineDataProvider>
  )
}
