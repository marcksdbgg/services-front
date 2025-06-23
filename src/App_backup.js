import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './App.css';

const API_GATEWAY_URL = process.env.REACT_APP_API_GATEWAY_URL;

function App() {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const filesPerPage = 10;

  const onDrop = useCallback(acceptedFiles => {
    const newFiles = acceptedFiles.map(file => ({
      id: `file_${Date.now()}_${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      status: 'queued',
      error: null,
      response: null,
      file: file,
      uploadedAt: null,
    }));
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, []);tate, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './App.css';

const API_GATEWAY_URL = process.env.REACT_APP_API_GATEWAY_URL;

function App() {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      id: `file_${Date.now()}_${Math.random()}`,
      status: 'queued',
      error: null,
      response: null,
    }));
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    // Tipos permitidos: PDF, DOCX, TXT, HTML, Markdown
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'text/html': ['.html', '.htm'],
    },
  });

  const handleUpload = async () => {
    if (!API_GATEWAY_URL) {
      alert("Error de configuración: La URL del API Gateway no está definida. Por favor, configura REACT_APP_API_GATEWAY_URL en tu archivo .env.");
      return;
    }

    const filesToUpload = files.filter(f => f.status === 'queued');
    if (filesToUpload.length === 0) return;

    setIsUploading(true);

    const uploadPromises = filesToUpload.map(fileObj => {
      setFiles(current => current.map(f => f.id === fileObj.id ? { ...f, status: 'uploading' } : f));
      
      const formData = new FormData();
      formData.append('file', fileObj.file);

      return axios.post(`${API_GATEWAY_URL}/api/v1/ingest/upload`, formData, {
        headers: {
          'X-Company-ID': 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        },
      })
      .then(response => {
        setFiles(current => current.map(f =>
          f.id === fileObj.id ? { 
            ...f, 
            status: 'success', 
            response: response.data,
            uploadedAt: new Date().toLocaleString()
          } : f
        ));
      })
      .catch(error => {
        const errorMessage = error.response?.data?.detail || error.message || 'Error desconocido';
        setFiles(current => current.map(f =>
          f.id === fileObj.id ? { ...f, status: 'error', error: errorMessage } : f
        ));
      });
    });

    await Promise.all(uploadPromises);
    setIsUploading(false);
  };

  const queuedFilesCount = files.filter(f => f.status === 'queued').length;
  const successFilesCount = files.filter(f => f.status === 'success').length;
  const errorFilesCount = files.filter(f => f.status === 'error').length;
  
  const humanFileSize = (size) => {
    if (!size || size === 0) return '0 B';
    if (typeof size !== 'number' || isNaN(size)) return 'Tamaño desconocido';
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / Math.pow(1024, i)).toFixed(2)} ${['B', 'KB', 'MB', 'GB'][i]}`;
  };

  const getFileIcon = (type) => {
    if (type?.includes('pdf')) return '📄';
    if (type?.includes('word') || type?.includes('docx')) return '📝';
    if (type?.includes('text')) return '📄';
    if (type?.includes('html')) return '🌐';
    if (type?.includes('markdown')) return '📋';
    return '📄';
  };

  const clearFiles = () => {
    setFiles([]);
    setCurrentPage(1);
  };

  const removeFile = (fileId) => {
    setFiles(current => current.filter(f => f.id !== fileId));
  };

  // Filtrado y paginación
  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      if (filterStatus === 'all') return true;
      return file.status === filterStatus;
    });
  }, [files, filterStatus]);

  const totalPages = Math.ceil(filteredFiles.length / filesPerPage);
  const startIndex = (currentPage - 1) * filesPerPage;
  const currentFiles = filteredFiles.slice(startIndex, startIndex + filesPerPage);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ateneo - Carga de Documentos</h1>
        <p>Arrastra archivos aquí para iniciar el pipeline de datos en Kafka y Flink.</p>
      </header>

      <div className="upload-section">
        <div {...getRootProps({ className: `dropzone ${isDragActive ? 'dropzone-active' : ''} ${isDragReject ? 'dropzone-reject' : ''}` })}>
          <input {...getInputProps()} />
          <div className="dropzone-content">
            <div className="dropzone-icon">📁</div>
            {isDragReject ? (
              <p>Tipo de archivo no soportado. Solo se permiten: PDF, DOCX, TXT, HTML, Markdown</p>
            ) : isDragActive ? (
              <p>¡Suelta los archivos aquí!</p>
            ) : (
              <>
                <p><strong>Arrastra archivos aquí o haz clic para seleccionar</strong></p>
                <p className="dropzone-hint">Archivos soportados: PDF, DOCX, TXT, HTML, Markdown</p>
              </>
            )}
          </div>
        </div>
        
        <div className="upload-controls">
          <button className="upload-button" onClick={handleUpload} disabled={isUploading || queuedFilesCount === 0}>
            {isUploading ? 'Subiendo...' : `Subir ${queuedFilesCount} Archivo(s)`}
          </button>
          {files.length > 0 && (
            <button className="clear-button" onClick={clearFiles} disabled={isUploading}>
              Limpiar Todo
            </button>
          )}
        </div>

        {files.length > 0 && (
          <div className="stats-summary">
            <div className="stat-item">
              <span className="stat-number">{files.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{queuedFilesCount}</span>
              <span className="stat-label">En Cola</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{successFilesCount}</span>
              <span className="stat-label">Enviados</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{errorFilesCount}</span>
              <span className="stat-label">Errores</span>
            </div>
          </div>
        )}
      </div>
      
      {files.length > 0 && (
        <div className="file-list-container">
          <div className="file-list-header">
            <h2>Archivos en esta sesión ({filteredFiles.length})</h2>
            <div className="filter-controls">
              <select 
                value={filterStatus} 
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="status-filter"
              >
                <option value="all">Todos los estados</option>
                <option value="queued">En Cola</option>
                <option value="uploading">Subiendo</option>
                <option value="success">Enviados</option>
                <option value="error">Con Errores</option>
              </select>
            </div>
          </div>

          <ul className="file-list">
            {currentFiles.map(file => (
              <li key={file.id} className="file-item">
                <div className="file-icon">
                  {getFileIcon(file.type)}
                </div>
                <div className="file-info">
                  <div className="file-name" title={file.name}>{file.name}</div>
                  <div className="file-details">
                    <span>{humanFileSize(file.size)}</span>
                    {file.uploadedAt && <span> • Subido: {file.uploadedAt}</span>}
                    {file.type && <span> • {file.type}</span>}
                  </div>
                  {file.status === 'error' && <div className="error-message">{file.error}</div>}
                  {file.status === 'success' && file.response && (
                    <div className="success-message">
                      Procesado exitosamente
                    </div>
                  )}
                </div>
                <div className="file-actions">
                  <span className={`file-status status-${file.status}`}>
                    {file.status === 'error' ? 'Error' : 
                     file.status === 'success' ? 'Enviado' : 
                     file.status === 'uploading' ? 'Subiendo' : 'En Cola'}
                  </span>
                  {(file.status === 'queued' || file.status === 'error') && (
                    <button 
                      className="remove-button" 
                      onClick={() => removeFile(file.id)}
                      title="Eliminar archivo"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
                className="pagination-button"
              >
                ← Anterior
              </button>
              
              <span className="pagination-info">
                Página {currentPage} de {totalPages}
              </span>
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;