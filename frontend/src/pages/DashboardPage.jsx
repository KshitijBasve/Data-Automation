import { useEffect, useState } from 'react';
import DatasetTable from '../components/DatasetTable';
import FileUpload from '../components/FileUpload';
import { deleteDataset, getDatasets, uploadFile } from '../services/api';

export default function DashboardPage() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchDatasets = async () => {
    const response = await getDatasets();
    setDatasets(response.data);
  };

  useEffect(() => {
    fetchDatasets();
    const interval = setInterval(fetchDatasets, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpload = async ({ file, datasetName }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', datasetName);

    try {
      setLoading(true);
      setMessage('');
      await uploadFile(formData);
      setMessage('File uploaded successfully. Processing started.');
      await fetchDatasets();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (datasetId) => {
    await deleteDataset(datasetId);
    fetchDatasets();
  };

  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-6 p-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Automated Data Entry Platform</h1>
        <p className="mt-2 text-slate-400">Upload raw files, validate data, insert to MongoDB, and export clean datasets.</p>
      </header>

      {message && (
        <div className="rounded-md border border-sky-400/40 bg-sky-500/10 px-4 py-3 text-sm text-sky-200">
          {message}
        </div>
      )}

      <FileUpload onSubmit={handleUpload} loading={loading} />
      <DatasetTable datasets={datasets} onDelete={handleDelete} />
    </div>
  );
}
