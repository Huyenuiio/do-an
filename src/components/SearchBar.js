import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import ArtifactDetail from './ArtifactDetail';
import { Html5Qrcode } from 'html5-qrcode';
import './SearchBar.css';

// Initialize Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL, 
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const scannerRef = useRef(null);

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleScan = async (decodedText, decodedResult) => {
    if (decodedText) {
      const scannedId = decodedText;
      console.log("Đã quét mã QR, ID:", scannedId);
      setSearchTerm(scannedId);

      try {
        const { data, error } = await supabase
          .from('artifacts')
          .select('*')
          .eq('id', scannedId)
          .single();

        if (error) {
          console.error('Lỗi khi tìm nạp chi tiết hiện vật:', error);
          return;
        }

        setSelectedArtifact(data);
      } catch (error) {
        console.error('Lỗi không mong muốn:', error);
      }

      setShowScanner(false);
    }
  };

  const handleScanError = (errorMessage) => {
    console.error("Lỗi khi quét mã QR:", errorMessage);
  };

  const handleCloseDetail = () => {
    setSelectedArtifact(null);
  };

  useEffect(() => {
    if (showScanner && scannerRef.current) {
      const scanner = new Html5Qrcode(scannerRef.current.id);

      scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        handleScan,
        handleScanError
      );

      return () => {
        scanner.stop().then(
          () => {
            console.log("Scanner stopped successfully");
          },
          (err) => {
            console.error("Error stopping scanner:", err);
          }
        );
      };
    }
  }, [showScanner]);

  // Nếu đã chọn hiện vật, hiển thị chi tiết hiện vật với nút "Quay lại danh sách"
  if (selectedArtifact) {
    return (
      <div>
        <button 
          onClick={handleCloseDetail}
          className="back-button"
        >
          Quay lại danh sách
        </button>
        <ArtifactDetail artifact={selectedArtifact} />
      </div>
    );
  }

  return (
    <div className="searchbar-container">
      <div className="searchbar-input-group">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm hiện vật..."
          className="searchbar-input"
        />
        <button
          onClick={handleSearch}
          className="searchbar-button searchbar-search-button"
        >
          Tìm
        </button>
        <button
          onClick={() => setShowScanner(!showScanner)}
          className="searchbar-button searchbar-scanner-button"
        >
          {showScanner ? 'Đóng QR' : 'Quét QR'}
        </button>
      </div>

      {showScanner && (
        <div className="scanner-container">
          <div 
            ref={scannerRef} 
            id="qr-reader"
          ></div>
          <p className="scanner-instruction">Đặt mã QR vào ô quét</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;