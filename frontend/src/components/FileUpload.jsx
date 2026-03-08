import { useRef, useState } from 'react';

const acceptedFileTypes = '.csv,.xlsx,.xls,.pdf,.json,.txt';

export default function FileUpload({ onSubmit, loading }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [datasetName, setDatasetName] = useState('');

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    if (!datasetName) setDatasetName(selectedFile.name.replace(/\.[^/.]+$/, ''));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFileSelect(event.dataTransfer.files[0]);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!file) return;
    onSubmit({ file, datasetName });
  };

  return (
    <form onSubmit={submit} className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white">Upload Data File</h2>
      <p className="mt-2 text-sm text-slate-400">Drag and drop CSV, Excel, PDF, JSON, or TXT files.</p>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="mt-4 cursor-pointer rounded-lg border-2 border-dashed border-sky-500/60 bg-slate-950 p-8 text-center"
      >
        <p className="text-sky-300">{file ? file.name : 'Drop file here or click to browse'}</p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={acceptedFileTypes}
          onChange={(e) => handleFileSelect(e.target.files[0])}
        />
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-sm text-slate-300">Dataset Name</label>
        <input
          value={datasetName}
          onChange={(e) => setDatasetName(e.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          placeholder="Quarterly Leads"
        />
      </div>

      <button
        disabled={loading || !file}
        className="mt-5 rounded-md bg-sky-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
      >
        {loading ? 'Processing...' : 'Upload & Process'}
      </button>
    </form>
  );
}
