import React, { useState } from 'react';

const Team = () => {
  const [loading, setLoading] = useState(false);

  const downloadData = async (status) => {
    setLoading(true);

    try {
      const response = await fetch(`http://143.110.190.154:8000/download_personal-info/${status}`);
      const csvData = await response.text();

      // Create a Blob from the CSV data
      const blob = new Blob([csvData], { type: 'text/csv' });

      // Create a link element to trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `personal_info_${status}.csv`;
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Remove the link element
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="inline-block float-right space-x-2">
        <button
          className={`btn btn-sm normal-case btn-primary ${loading && 'disabled'}`}
          onClick={() => downloadData('unpaid')}
        >
          {loading ? 'Downloading...' : 'Download Unpaid'}
        </button>
        <button
          className={`btn btn-sm normal-case btn-success ${loading && 'disabled'}`}
          onClick={() => downloadData('paid')}
        >
          {loading ? 'Downloading...' : 'Download Paid'}
        </button>
        <button
          className={`btn btn-sm normal-case btn-secondary ${loading && 'disabled'}`}
          onClick={() => downloadData('all')}
        >
          {loading ? 'Downloading...' : 'Download All'}
        </button>
      </div>
    </>
  );
};

export default Team;
