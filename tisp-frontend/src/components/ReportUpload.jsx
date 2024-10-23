// src/components/ReportUpload.jsx

import React, { useState } from 'react';

const ReportUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('report', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('File uploaded successfully.');
      } else {
        setMessage('File upload failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred during file upload.');
    }
  };

  return (
    <div>
      <h2>Upload Report</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ReportUpload;
