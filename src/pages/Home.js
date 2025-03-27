import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import api from '../services/api';
import ArtifactList from '../components/ArtifactList';

const Home = () => {
  const [artifacts, setArtifacts] = useState([]);
  const [filteredArtifacts, setFilteredArtifacts] = useState([]); // Thêm state để lọc
  const [loading, setLoading] = useState(false); // Thêm loading

  useEffect(() => {
    const fetchArtifacts = async () => {
      setLoading(true);
      try {
        const { data, error } = await api.from('artifacts').select('*'); // Sửa api.get thành Supabase syntax
        if (error) throw error;
        setArtifacts(data);
        setFilteredArtifacts(data); // Ban đầu hiển thị tất cả
      } catch (error) {
        console.error('Error fetching artifacts:', error);
      }
      setLoading(false);
    };
    fetchArtifacts();
  }, []); // Xóa dependency [searchTerm] để chỉ fetch một lần

  const handleSearch = (searchTerm) => {
    setLoading(true);
    if (!searchTerm) {
      setFilteredArtifacts(artifacts); // Trở về danh sách gốc nếu không có từ khóa
    } else {
      const lowerCaseTerm = searchTerm.toLowerCase();
      const filtered = artifacts.filter(
        (artifact) =>
          artifact.name.toLowerCase().includes(lowerCaseTerm) ||
          (artifact.description && artifact.description.toLowerCase().includes(lowerCaseTerm))
      );
      setFilteredArtifacts(filtered);
    }
    setLoading(false); // Không cần delay vì không fetch lại từ server
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <ArtifactList artifacts={filteredArtifacts} loading={loading} /> {/* Truyền thêm loading */}
    </div>
  );
};

export default Home;