// C:\codingVibes\nuansasolution\.subpath\generator-surat-laporan-bisnis\src\App.jsx

import { useState, useEffect } from 'react'
import Header from './components/Header'
import Tabs from './components/Tabs'
import MainContent from './components/MainContent'
import ActionBar from './components/ActionBar'
import MobileTabNavigation from './components/MobileTabNavigation'

function App() {
  const today = new Date().toISOString().split('T')[0]
  const [activeTab, setActiveTab] = useState('daily')
  const [formData, setFormData] = useState({
    companyName: 'PT. Berkah Sejahtera',
    reportPeriod: 'January 2026',
    reportDate: today, 
    personResponsible: '',
    city: 'Kabupaten Bogor',     
    dailySales: [
      { day: 'Senin', revenue: 0, transactions: 0 },
      { day: 'Selasa', revenue: 0, transactions: 0 },
      { day: 'Rabu', revenue: 0, transactions: 0 },
      { day: 'Kamis', revenue: 0, transactions: 0 },
      { day: 'Jumat', revenue: 0, transactions: 0 },
      { day: 'Sabtu', revenue: 0, transactions: 0 },
      { day: 'Minggu', revenue: 0, transactions: 0 },
    ],
    monthlySales: [
      { month: 'Januari', total: 0 },
      { month: 'Februari', total: 0 },
      { month: 'Maret', total: 0 },
      { month: 'April', total: 0 },
      { month: 'Mei', total: 0 },
      { month: 'Juni', total: 0 },
      { month: 'Juli', total: 0 },
      { month: 'Agustus', total: 0 },
      { month: 'September', total: 0 },
      { month: 'Oktober', total: 0 },
      { month: 'November', total: 0 },
      { month: 'Desember', total: 0 },
    ],
    materialPurchases: [
      { name: '', quantity: 0, unitPrice: 0 },
    ],
  })

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [mobileView, setMobileView] = useState('form') // 'form' or 'preview'

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDailySalesChange = (index, field, value) => {
    const newData = [...formData.dailySales]
    newData[index][field] = isNaN(value) ? value : Number(value)
    handleFormChange('dailySales', newData)
  }

  const handleMonthlySalesChange = (index, field, value) => {
    const newData = [...formData.monthlySales]
    newData[index][field] = isNaN(value) ? value : Number(value)
    handleFormChange('monthlySales', newData)
  }

  const handleMaterialChange = (index, field, value) => {
    const newData = [...formData.materialPurchases]
    newData[index][field] = isNaN(value) ? value : Number(value)
    handleFormChange('materialPurchases', newData)
  }

  const addMaterialRow = () => {
    handleFormChange('materialPurchases', [
      ...formData.materialPurchases,
      { name: '', quantity: 0, unitPrice: 0 }
    ])
  }

  const removeMaterialRow = (index) => {
    const newData = formData.materialPurchases.filter((_, i) => i !== index)
    handleFormChange('materialPurchases', newData)
  }

  const resetForm = () => {
    setFormData({
      companyName: '',
      reportPeriod: '',
      reportDate: today, 
      personResponsible: '',
      city: 'Kabupaten Bogor',     
      dailySales: [
        { day: 'Senin', revenue: 0, transactions: 0 },
        { day: 'Selasa', revenue: 0, transactions: 0 },
        { day: 'Rabu', revenue: 0, transactions: 0 },
        { day: 'Kamis', revenue: 0, transactions: 0 },
        { day: 'Jumat', revenue: 0, transactions: 0 },
        { day: 'Sabtu', revenue: 0, transactions: 0 },
        { day: 'Minggu', revenue: 0, transactions: 0 },
      ],
      monthlySales: [
        { month: 'Januari', total: 0 },
        { month: 'Februari', total: 0 },
        { month: 'Maret', total: 0 },
        { month: 'April', total: 0 },
        { month: 'Mei', total: 0 },
        { month: 'Juni', total: 0 },
        { month: 'Juli', total: 0 },
        { month: 'Agustus', total: 0 },
        { month: 'September', total: 0 },
        { month: 'Oktober', total: 0 },
        { month: 'November', total: 0 },
        { month: 'Desember', total: 0 },
      ],
      materialPurchases: [
        { name: '', quantity: 0, unitPrice: 0 },
      ],
    })
  }

  return (
  <div className="h-screen flex flex-col bg-white">
    <Header />
    <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
    
    {isMobile ? (
      <>
        {/* Mobile View Tabs */}
        <MobileTabNavigation 
          currentView={mobileView} 
          onViewChange={setMobileView}
        />

        {/* Mobile Content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {mobileView === 'form' ? (
            <MainContent
              activeTab={activeTab}
              formData={formData}
              onFormChange={handleFormChange}
              onDailySalesChange={handleDailySalesChange}
              onMonthlySalesChange={handleMonthlySalesChange}
              onMaterialChange={handleMaterialChange}
              onAddMaterialRow={addMaterialRow}
              onRemoveMaterialRow={removeMaterialRow}
              isMobile={true}
              isFormView={true}
            />
          ) : (
            <MainContent
              activeTab={activeTab}
              formData={formData}
              onFormChange={handleFormChange}
              onDailySalesChange={handleDailySalesChange}
              onMonthlySalesChange={handleMonthlySalesChange}
              onMaterialChange={handleMaterialChange}
              onAddMaterialRow={addMaterialRow}
              onRemoveMaterialRow={removeMaterialRow}
              isMobile={true}
              isFormView={false}
              isPreviewOnly={true}
          />


          )}
        </div>
      </>
    ) : (
      // DESKTOP LAYOUT - Bagian yang diperbaiki:
      <div className="flex-1 flex overflow-hidden bg-white">
        <MainContent
          activeTab={activeTab}
          formData={formData}
          onFormChange={handleFormChange}
          onDailySalesChange={handleDailySalesChange}
          onMonthlySalesChange={handleMonthlySalesChange}
          onMaterialChange={handleMaterialChange}
          onAddMaterialRow={addMaterialRow}
          onRemoveMaterialRow={removeMaterialRow}
          isMobile={false}
        />
      </div>
    )}

    <ActionBar
      formData={formData}
      activeTab={activeTab}
      onReset={resetForm}
      isMobile={isMobile}
    />
  </div>
)
}

export default App