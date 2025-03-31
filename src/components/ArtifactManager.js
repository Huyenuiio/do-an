import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import './ArtifactManager.css';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL, 
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const ArtifactManager = () => {
  const [artifacts, setArtifacts] = useState([]);
  const [newArtifact, setNewArtifact] = useState({
    name: '',
    description: '',
    size: { width: '', height: '', depth: '' },
    media: { images: [''], videos: [''] },
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQR, setCurrentQR] = useState(null);

  // Fetch all artifacts
  const fetchArtifacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('artifacts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setArtifacts(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new artifact
  const addArtifact = async () => {
    if (!newArtifact.name.trim()) {
      setError('Tên hiện vật không được để trống');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('artifacts')
        .insert([{
          name: newArtifact.name,
          description: newArtifact.description,
          size: newArtifact.size,
          media: newArtifact.media,
          notes: newArtifact.notes
        }])
        .select();
      
      if (error) throw error;

      setNewArtifact({
        name: '',
        description: '',
        size: { width: '', height: '', depth: '' },
        media: { images: [''], videos: [''] },
        notes: ''
      });
      
      setArtifacts(prev => [data[0], ...prev]);
    } catch (err) {
      setError(`Lỗi khi thêm hiện vật: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete artifact
  const deleteArtifact = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa hiện vật này?')) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('artifacts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setArtifacts(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(`Lỗi khi xóa hiện vật: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArtifact(prev => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (e) => {
    const { name, value } = e.target;
    setNewArtifact(prev => ({
      ...prev,
      size: { ...prev.size, [name]: value }
    }));
  };

  const handleMediaChange = (type, index, value) => {
    setNewArtifact(prev => {
      const newMedia = { ...prev.media };
      newMedia[type][index] = value;
      return { ...prev, media: newMedia };
    });
  };

  const addMediaField = (type) => {
    setNewArtifact(prev => ({
      ...prev,
      media: {
        ...prev.media,
        [type]: [...prev.media[type], '']
      }
    }));
  };

  const removeMediaField = (type, index) => {
    setNewArtifact(prev => ({
      ...prev,
      media: {
        ...prev.media,
        [type]: prev.media[type].filter((_, i) => i !== index)
      }
    }));
  };

  // Show QR code
  const showQRCode = (id) => {
    setCurrentQR(id);
  };

  // Close QR code
  const closeQRCode = () => {
    setCurrentQR(null);
  };

  useEffect(() => {
    fetchArtifacts();
  }, []);

  return (
    <div className="artifact-manager">
      <h2>Quản lý Hiện vật Bảo tàng</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Add new artifact form */}
      <div className="artifact-form">
        <h3>Thêm hiện vật mới</h3>
        
        <div className="form-group">
          <label>Tên hiện vật *</label>
          <input
            type="text"
            name="name"
            value={newArtifact.name}
            onChange={handleInputChange}
            placeholder="Ví dụ: Tranh Đông Hồ - Đám cưới chuột"
          />
        </div>
        
        <div className="form-group">
          <label>Mô tả</label>
          <textarea
            name="description"
            value={newArtifact.description}
            onChange={handleInputChange}
            placeholder="Mô tả chi tiết về hiện vật"
          />
        </div>
        
        <div className="form-group">
          <label>Kích thước (cm)</label>
          <div className="size-inputs">
            <input
              type="text"
              name="width"
              placeholder="Rộng"
              value={newArtifact.size.width}
              onChange={handleSizeChange}
            />
            <input
              type="text"
              name="height"
              placeholder="Cao"
              value={newArtifact.size.height}
              onChange={handleSizeChange}
            />
            <input
              type="text"
              name="depth"
              placeholder="Dày"
              value={newArtifact.size.depth}
              onChange={handleSizeChange}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Hình ảnh (URL)</label>
          {newArtifact.media.images.map((image, index) => (
            <div key={`image-${index}`} className="media-input">
              <input
                type="text"
                value={image}
                onChange={(e) => handleMediaChange('images', index, e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              {index > 0 && (
                <button 
                  type="button"
                  onClick={() => removeMediaField('images', index)}
                  className="remove-btn"
                >
                  Xóa
                </button>
              )}
            </div>
          ))}
          <button 
            type="button"
            onClick={() => addMediaField('images')}
            className="add-btn"
          >
            + Thêm hình ảnh
          </button>
        </div>
        
        <div className="form-group">
          <label>Video (URL)</label>
          {newArtifact.media.videos.map((video, index) => (
            <div key={`video-${index}`} className="media-input">
              <input
                type="text"
                value={video}
                onChange={(e) => handleMediaChange('videos', index, e.target.value)}
                placeholder="https://example.com/video.mp4"
              />
              {index > 0 && (
                <button 
                  type="button"
                  onClick={() => removeMediaField('videos', index)}
                  className="remove-btn"
                >
                  Xóa
                </button>
              )}
            </div>
          ))}
          <button 
            type="button"
            onClick={() => addMediaField('videos')}
            className="add-btn"
          >
            + Thêm video
          </button>
        </div>
        
        <div className="form-group">
          <label>Ghi chú</label>
          <input
            type="text"
            name="notes"
            value={newArtifact.notes}
            onChange={handleInputChange}
            placeholder="Thông tin bổ sung"
          />
        </div>
        
        <button
          onClick={addArtifact}
          disabled={loading || !newArtifact.name.trim()}
          className="submit-btn"
        >
          {loading ? 'Đang thêm...' : 'Thêm hiện vật'}
        </button>
      </div>
      
      {/* Artifacts list */}
      <div className="artifact-list-2">
        <h3>Danh sách hiện vật ({artifacts.length})</h3>
        
        {loading && artifacts.length === 0 ? (
          <p className="loading-text">Đang tải dữ liệu...</p>
        ) : artifacts.length === 0 ? (
          <p className="empty-text">Chưa có hiện vật nào</p>
        ) : (
          <div className="artifact-grid">
            {artifacts.map(artifact => (
              <div key={artifact.id} className="artifact-card">
                <div className="artifact-header">
                  <div>
                    <h4>{artifact.name}</h4>
                    <div 
                      className="artifact-id"
                      onClick={() => showQRCode(artifact.id)}
                      title="Nhấn để xem mã QR"
                    >
                      <span className="id-label">ID hiện vật:</span>
                      <span className="id-value">{artifact.id}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteArtifact(artifact.id)}
                    disabled={loading}
                    className="delete-btn"
                  >
                    Xóa
                  </button>
                </div>
                
                {artifact.description && (
                  <p className="artifact-description">{artifact.description}</p>
                )}
                
                <div className="artifact-details">
                  <p><strong>Kích thước:</strong> {artifact.size.width} × {artifact.size.height} × {artifact.size.depth} cm</p>
                  
                  {artifact.notes && (
                    <p><strong>Ghi chú:</strong> {artifact.notes}</p>
                  )}
                </div>
                
                {artifact.media.images.length > 0 && (
                  <div className="artifact-media">
                    {artifact.media.images.map((img, idx) => (
                      <img 
                        key={`img-${idx}`}
                        src={img} 
                        alt={`${artifact.name} ${idx + 1}`}
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {currentQR && (
        <div className="qr-modal">
          <div className="qr-modal-content">
            <h3>Mã QR cho hiện vật</h3>
            <div className="qr-code-container">
              <QRCode 
                value={currentQR.toString()}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="qr-id">ID: {currentQR}</p>
            <button 
              onClick={closeQRCode}
              className="close-btn"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtifactManager;