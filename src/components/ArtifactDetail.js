import React from 'react';
import './ArtifactDetail.css';

const ArtifactDetail = ({ artifact }) => {
  return (
    <div className="artifact-detail">
      <h2 className="artifact-title">{artifact.name}</h2>

      {artifact.media?.images?.[0] && (
        <img
          className="artifact-image"
          src={artifact.media.images[0]}
          alt={artifact.name}
        />
      )}

      <p className="artifact-description">
        <strong>Mô tả:</strong> {artifact.description}
      </p>

      <p className="artifact-info">
        <strong>Kích thước:</strong> {artifact.size.width} x {artifact.size.height} x {artifact.size.depth}
      </p>

      <p className="artifact-info">
        <strong>Ghi chú:</strong> {artifact.notes}
      </p>

      {artifact.media?.videos?.length > 0 && (
        <video controls className="artifact-video">
          <source src={artifact.media.videos[0]} type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ video.
        </video>
      )}
    </div>
  );
};

export default ArtifactDetail;