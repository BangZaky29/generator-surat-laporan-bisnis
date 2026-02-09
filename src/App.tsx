import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CompanyTypeSelection } from './components/screens/CompanyTypeSelection';
import { CompanyInfo } from './components/screens/CompanyInfo';
import { DataEntry } from './components/screens/DataEntry';
import { ReportPreview } from './components/screens/ReportPreview';
import { StepTransition } from './components/motion/MotionWrapper';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ReportData, Step, CompanyType, SavedFile } from './types';
import { generateDummyData } from './utils/seeder';
import { saveFile } from './utils/storage';
import { SaveModal, LoadModal, AlertModal, SeederModal } from './components/ui/StorageModals';
import SubscriptionGuard from './components/SubscriptionGuard';

// Function to return fresh initial state
const getInitialData = (): ReportData => ({
  companyName: '',
  companyLogo: null,
  logoScale: 100,
  ownerName: '',
  signerPosition: 'Pemilik',
  city: '',
  reportDate: new Date().toISOString().split('T')[0],
  signatureImage: null,
  signatureScale: 100,
  stampImage: null,
  stampScale: 100,
  period: '',
  type: 'jasa',
  incomes: [],
  expenses: [],
  beginningInventory: 0,
  purchases: [],
  endingInventory: 0,
  rawMaterialsBeginning: 0,
  rawMaterialPurchases: [],
  rawMaterialsEnding: 0,
  directLabor: [],
  factoryOverhead: [],
  wipBeginning: 0,
  wipEnding: 0,
  finishedGoodsBeginning: 0,
  finishedGoodsEnding: 0,
});

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('type-selection');
  const [data, setData] = useState<ReportData>(getInitialData());
  const [completedSteps, setCompletedSteps] = useState<Step[]>([]);

  // Modal States
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [isSeederModalOpen, setIsSeederModalOpen] = useState(false);

  // Generic Alert/Confirm State
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    type: 'danger' | 'warning' | 'info';
    title: string;
    message: string;
    confirmText?: string;
    onConfirm?: () => void;
    singleButton?: boolean;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const closeAlert = () => setAlertConfig(prev => ({ ...prev, isOpen: false }));

  const updateData = (newData: Partial<ReportData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const markStepComplete = (step: Step) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
  };

  const handleTypeSelect = (type: CompanyType) => {
    updateData({ type });
    markStepComplete('type-selection');
    setCurrentStep('company-info');
  };

  const handleNextStep = (current: Step, next: Step) => {
    markStepComplete(current);
    setCurrentStep(next);
  };

  const canNavigateTo = (step: Step) => {
    const order: Step[] = ['type-selection', 'company-info', 'data-entry', 'preview'];
    const stepIndex = order.indexOf(step);
    if (stepIndex === 0) return true;
    const prevStep = order[stepIndex - 1];
    return completedSteps.includes(prevStep);
  };

  // --- ACTIONS ---

  const handleReset = () => {
    setAlertConfig({
      isOpen: true,
      type: 'danger',
      title: 'Reset Aplikasi?',
      message: 'Apakah Anda yakin ingin menghapus semua data dan kembali ke halaman awal? Data yang belum disimpan akan hilang permanen.',
      confirmText: 'Ya, Reset Total',
      onConfirm: () => {
        setData(getInitialData());
        setCurrentStep('type-selection');
        setCompletedSteps([]);
      }
    });
  };

  const handleSeeder = () => {
    setIsSeederModalOpen(true);
  };

  const performSeeder = (type: CompanyType) => {
    setIsSeederModalOpen(false);
    const dummy = generateDummyData(type);
    setData(dummy);
    setCompletedSteps(['type-selection', 'company-info', 'data-entry']);
    setCurrentStep('preview');

    setAlertConfig({
      isOpen: true,
      type: 'info',
      title: 'Data Dummy Berhasil Diisi',
      message: `Aplikasi telah diisi dengan data contoh untuk ${type.toUpperCase()}. Silakan cek hasilnya di halaman Preview.`,
      singleButton: true,
      confirmText: 'Oke'
    });
  };

  // Triggered from Tools Menu -> Opens Modal
  const handleSaveRequest = () => {
    setIsSaveModalOpen(true);
  };

  // Triggered from Save Modal
  const performSave = (name: string) => {
    const success = saveFile(name, data);
    if (success) {
      setIsSaveModalOpen(false);
      setAlertConfig({
        isOpen: true,
        type: 'info',
        title: 'Berhasil Disimpan',
        message: 'Data laporan Anda berhasil disimpan ke riwayat browser.',
        singleButton: true,
        confirmText: 'Oke'
      });
    } else {
      setIsSaveModalOpen(false);
      setAlertConfig({
        isOpen: true,
        type: 'danger',
        title: 'Gagal Menyimpan',
        message: 'Terjadi kesalahan saat menyimpan data. Pastikan memori browser tidak penuh.',
        singleButton: true,
        confirmText: 'Tutup'
      });
    }
  };

  // Triggered from Tools Menu -> Opens Modal
  const handleLoadRequest = () => {
    setIsLoadModalOpen(true);
  };

  // Triggered from Load Modal
  const performLoad = (file: SavedFile) => {
    setIsLoadModalOpen(false);
    setAlertConfig({
      isOpen: true,
      type: 'warning',
      title: 'Muat Data Tersimpan?',
      message: `Apakah Anda ingin memuat file "${file.name}"? Data pekerjaan saat ini akan tertimpa.`,
      confirmText: 'Ya, Muat Data',
      onConfirm: () => {
        setData(file.data);
        setCompletedSteps(['type-selection', 'company-info', 'data-entry']);
        setCurrentStep('preview');
      }
    });
  };

  return (
    <SubscriptionGuard featureSlug="laporan-bisnis">
      <>
        <DashboardLayout
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          canNavigate={canNavigateTo}
          onReset={handleReset}
          onSave={handleSaveRequest}
          onLoad={handleLoadRequest}
          onSeeder={handleSeeder}
        >
          <AnimatePresence mode="wait">

            {currentStep === 'type-selection' && (
              <StepTransition key="step1">
                <CompanyTypeSelection onSelect={handleTypeSelect} />
              </StepTransition>
            )}

            {currentStep === 'company-info' && (
              <StepTransition key="step2">
                <CompanyInfo
                  data={data}
                  onUpdate={updateData}
                  onNext={() => handleNextStep('company-info', 'data-entry')}
                  onReset={() => { }}
                />
              </StepTransition>
            )}

            {currentStep === 'data-entry' && (
              <StepTransition key="step3">
                <DataEntry
                  data={data}
                  onUpdate={updateData}
                  onNext={() => handleNextStep('data-entry', 'preview')}
                  onBack={() => setCurrentStep('company-info')}
                />
              </StepTransition>
            )}

            {currentStep === 'preview' && (
              <StepTransition key="step4">
                <ReportPreview
                  data={data}
                  onBack={() => setCurrentStep('data-entry')}
                  onReset={handleReset}
                />
              </StepTransition>
            )}

          </AnimatePresence>
        </DashboardLayout>

        {/* Modals Layer */}
        <SaveModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          onConfirm={performSave}
        />

        <LoadModal
          isOpen={isLoadModalOpen}
          onClose={() => setIsLoadModalOpen(false)}
          onLoad={performLoad}
        />

        <SeederModal
          isOpen={isSeederModalOpen}
          onClose={() => setIsSeederModalOpen(false)}
          onSelect={performSeeder}
        />

        <AlertModal
          isOpen={alertConfig.isOpen}
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          confirmText={alertConfig.confirmText}
          onConfirm={alertConfig.onConfirm}
          onClose={closeAlert}
          singleButton={alertConfig.singleButton}
        />
      </>
    </SubscriptionGuard>
  );
}

export default App;
