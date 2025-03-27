// src/components/ArtifactList.js
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './ArtifactList.css';
import ArtifactDetail from './ArtifactDetail.js';

// Initialize Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL, 
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const ArtifactList = ({ artifacts, loading }) => {
  // State to manage selected artifact
  const [selectedArtifact, setSelectedArtifact] = useState(null);

  // Function to handle artifact click and fetch details
  const handleArtifactClick = async (artifactId) => {
    try {
      // Fetch detailed artifact information from Supabase
      const { data, error } = await supabase
        .from('artifacts')
        .select('*')
        .eq('id', artifactId)
        .single();

      if (error) {
        console.error('Lỗi khi tìm nạp chi tiết hiện vật:', error);
        return;
      }

      // Set the selected artifact to display in detail view
      setSelectedArtifact(data);
    } catch (error) {
      console.error('Lỗi không mong muốn:', error);
    }
  };

  // Close detail view and return to list
  const handleCloseDetail = () => {
    setSelectedArtifact(null);
  };

  // If an artifact is selected, show its details
  if (selectedArtifact) {
    return (
      <div>
   <button 
  onClick={handleCloseDetail}
  style={{
    margin: '10px',
    padding: '10px 15px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontFamily: "'Quicksand', sans-serif",
    fontWeight: 500
  }}
>
  Quay lại danh sách
</button>
        <ArtifactDetail artifact={selectedArtifact} />
      </div>
    );
  }

  // Render artifact list
  return (
    <div className="artifact-container">
      <h1 className="artifact-header">Danh sách hiện vật</h1>
      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="artifact-list">
          {artifacts.length > 0 ? (
            artifacts.map(artifact => (
              <div 
                key={artifact.id} 
                className="artifact-item"
                onClick={() => handleArtifactClick(artifact.id)}
                style={{ cursor: 'pointer' }}
              >
                {artifact.media?.images?.[0] && (
                  <img 
                    src={artifact.media.images[0]} 
                    alt={artifact.name} 
                    className="artifact-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                )}
                <div className="artifact-name">{artifact.name}</div>
                {/* <div className="artifact-description">{artifact.description}</div> */}
                {/* {artifact.size && (
                  <div className="artifact-size">
                    Kích thước: {artifact.size.width} × {artifact.size.height} × {artifact.size.depth}
                  </div>
                )} */}
                {/* {artifact.notes && <div className="artifact-description">Ghi chú: {artifact.notes}</div>} */}
              </div>
            ))
          ) : (
            <div className="no-artifacts">Không tìm thấy hiện vật nào.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArtifactList;