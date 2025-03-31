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

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const scannerRef = useRef(null);

  // Hide artifact container
  const hideArtifactContainer = () => {
    const container = document.querySelector('.artifact-container');
    if (container) {
      container.style.display = 'none';
    }
  };

  // Show artifact container
  const showArtifactContainer = () => {
    const container = document.querySelector('.artifact-container');
    if (container) {
      container.style.display = 'block';
    }
  };

  // Automatically show artifact container when unmounting
  useEffect(() => {
    return () => {
      showArtifactContainer();
    };
  }, []);

  const handleSearch = async () => {
    try {
      const { data, error } = await supabase
        .from('artifacts')
        .select('*')
        .ilike('name', `%${searchTerm}%`); // Fixed template literal syntax

      if (error) {
        console.error('Error fetching artifact details:', error);
        return;
      }

      if (data.length > 0) {
        hideArtifactContainer();
        setSelectedArtifact(data[0]);
      } else {
        console.log("No artifacts found with the name:", searchTerm);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const handleScan = async (decodedText) => {
    if (decodedText) {
      const scannedId = decodedText;
      console.log("QR code scanned, ID:", scannedId);
      setSearchTerm(scannedId);

      try {
        const { data, error } = await supabase
          .from('artifacts')
          .select('*')
          .eq('id', scannedId)
          .single();

        if (error) {
          console.error('Error fetching artifact details:', error);
          return;
        }

        hideArtifactContainer();
        setSelectedArtifact(data);
      } catch (error) {
        console.error('Unexpected error:', error);
      }

      setShowScanner(false);
    }
  };

  const handleScanError = (errorMessage) => {
    console.error("Error scanning QR code:", errorMessage);
  };

  const handleCloseDetail = () => {
    showArtifactContainer();
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

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (selectedArtifact) {
    return (
      <div>
        <button 
          onClick={handleCloseDetail}
          className="back-button"
        >
          Back to List
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
          onKeyDown={handleInputKeyDown}
          placeholder="Search artifacts..."
          className="searchbar-input"
        />
        <button
          onClick={handleSearch}
          className="searchbar-button searchbar-search-button"
        >
          Search
        </button>
        <button
          onClick={() => setShowScanner(!showScanner)}
          className="searchbar-button searchbar-scanner-button"
        >
          {showScanner ? 'Close QR' : 'Scan QR'}
        </button>
      </div>

      {showScanner && (
        <div className="scanner-container">
          <div 
            ref={scannerRef} 
            id="qr-reader"
          ></div>
          <p className="scanner-instruction">Place QR code in scanning area</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
