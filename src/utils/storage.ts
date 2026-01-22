import { ReportData, SavedFile } from '../types';

const STORAGE_KEY = 'finmaster_history_v2';

export const getSavedFiles = (): SavedFile[] => {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    return JSON.parse(json) as SavedFile[];
  } catch (e) {
    console.error('Failed to load history', e);
    return [];
  }
};

export const saveFile = (name: string, data: ReportData): boolean => {
  try {
    const files = getSavedFiles();
    const newFile: SavedFile = {
      id: Date.now().toString(),
      name: name || `Laporan Tanpa Judul`,
      timestamp: Date.now(),
      data: data
    };
    
    // Add to beginning of array
    const updatedFiles = [newFile, ...files];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFiles));
    return true;
  } catch (e) {
    console.error('Failed to save file', e);
    return false;
  }
};

export const deleteFile = (id: string): SavedFile[] => {
  const files = getSavedFiles();
  const updated = files.filter(f => f.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

// Legacy support cleanup
export const clearLegacyStorage = () => {
  localStorage.removeItem('finmaster_data_v1');
};