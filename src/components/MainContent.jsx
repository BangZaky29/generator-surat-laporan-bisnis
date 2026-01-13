import FormSection from './FormSection'
import PreviewSection from './PreviewSection'

export default function MainContent({
  activeTab,
  formData,
  onFormChange,
  onDailySalesChange,
  onMonthlySalesChange,
  onMaterialChange,
  onAddMaterialRow,
  onRemoveMaterialRow,
  isMobile,
  isFormView,
  isPreviewOnly,
}) {
  return (
    <div
      className={`flex-1 flex min-h-0 ${
        isMobile ? 'flex-col' : 'flex-row'
      }`}
    >
      {/* ================= FORM ================= */}
      {!isPreviewOnly && (
        <div
          className={`min-h-0 ${
            isMobile
              ? 'w-full bg-light-gray overflow-y-auto'
              : 'w-1/2 bg-light-gray overflow-y-auto'
          }`}
        >
          <FormSection
            activeTab={activeTab}
            formData={formData}
            onFormChange={onFormChange}
            onDailySalesChange={onDailySalesChange}
            onMonthlySalesChange={onMonthlySalesChange}
            onMaterialChange={onMaterialChange}
            onAddMaterialRow={onAddMaterialRow}
            onRemoveMaterialRow={onRemoveMaterialRow}
            isMobile={isMobile}
          />
        </div>
      )}

      {/* ================= PREVIEW ================= */}
      {!isFormView && (
        <div
          className={`min-h-0 ${
            isMobile
              ? 'w-full bg-light-gray overflow-y-auto'
              : 'w-1/2 bg-light-gray overflow-y-auto flex justify-center'
          }`}
        >
          <div className={`${isMobile ? 'w-full' : 'w-full flex justify-center'} py-4`}>
            <PreviewSection
              activeTab={activeTab}
              formData={formData}
              isMobile={isMobile}
            />
          </div>
        </div>
      )}

    </div>
  )
}
