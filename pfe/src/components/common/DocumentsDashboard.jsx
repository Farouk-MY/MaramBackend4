import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrash, FaUpload, FaFileAlt, FaFilePdf, FaFileCode, FaFileCsv } from 'react-icons/fa';

const DocumentsDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: '',
    description: '',
    document_type: 'pdf',
    file: null
  });

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(response.data.documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDocument({ ...newDocument, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewDocument({ ...newDocument, file: e.target.files[0] });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newDocument.file) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('name', newDocument.name);
    formData.append('description', newDocument.description);
    formData.append('document_type', newDocument.document_type);
    formData.append('file', newDocument.file);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/documents`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Document uploaded successfully');
      setUploadModalOpen(false);
      setNewDocument({
        name: '',
        description: '',
        document_type: 'pdf',
        file: null
      });
      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error(error.response?.data?.detail || 'Failed to upload document');
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/documents/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Document deleted successfully');
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const getDocumentIcon = (documentType) => {
    switch (documentType) {
      case 'pdf':
        return <FaFilePdf className="text-danger" />;
      case 'json':
        return <FaFileCode className="text-primary" />;
      case 'csv':
        return <FaFileCsv className="text-success" />;
      case 'text':
        return <FaFileAlt className="text-secondary" />;
      default:
        return <FaFileAlt className="text-secondary" />;
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Document Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => setUploadModalOpen(true)}
        >
          <FaUpload className="me-2" /> Upload Document
        </button>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Type</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No documents found. Upload some documents to use with the chatbot.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id || doc._id}>
                    <td>
                      {getDocumentIcon(doc.document_type)}
                      <span className="ms-2">{doc.name}</span>
                    </td>
                    <td>{doc.description}</td>
                    <td>{doc.document_type}</td>
                    <td>{new Date(doc.created_at).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(doc.id || doc._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload Document</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setUploadModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpload}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={newDocument.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={newDocument.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="document_type" className="form-label">Document Type</label>
                    <select
                      className="form-select"
                      id="document_type"
                      name="document_type"
                      value={newDocument.document_type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="pdf">PDF</option>
                      <option value="json">JSON</option>
                      <option value="csv">CSV</option>
                      <option value="text">Text</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="file" className="form-label">File</label>
                    <input
                      type="file"
                      className="form-control"
                      id="file"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setUploadModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">Upload</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsDashboard;