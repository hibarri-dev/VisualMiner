import React from 'react'
import AppLayout from './components/layout/AppLayout'

export default function App() {
  return (
    <AppLayout>
      {({ activeTab, activeSubTab, currentRole, onOpenModal }) => {
        // Modular viewport switcher ready for teammates
        return null // defaults to DefaultSlotView in AppLayout
      }}
    </AppLayout>
  )
}
