import { useState, useEffect, useRef } from 'react';
import {
  Container, Card, Button, Table, Spinner, Form, Alert, Badge, Modal, Row, Col
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faDatabase,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faRefresh,
  faFileAlt,
  faUpload,
  faDownload,
  faChartLine,
  faEye
} from '@fortawesome/free-solid-svg-icons';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

function ModelsDashboard({ showUserDashboard, selectedUser = 'All Users' }) {
  // State management
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showModelModal, setShowModelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentModel, setCurrentModel] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [modelTypeOptions] = useState(['json', 'csv', 'text']);
  const [categoryOptions] = useState(['NLP', 'Computer Vision', 'Recommendation', 'Classification', 'Regression', 'Other']);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    model_type: 'json',
    file: null
  });

  // Get token from localStorage
  const getToken = () => localStorage.getItem('token');

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Fetch models from the API
  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${API_BASE_URL}/models`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to fetch models');
      }

      const data = await response.json();
      setModels(data.models || []);

      setSuccessMessage('Models loaded successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching models:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchModels();
  }, []);

  // Filter models based on search term
  const filteredModels = models.filter(model =>
      model.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        file: file
      });
    }
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      model_type: 'json',
      file: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setCurrentModel(null);
  };

  // Open model modal for create/edit
  const openModalForCreate = () => {
    resetForm();
    setShowModelModal(true);
  };

  const openModalForEdit = (model) => {
    setCurrentModel(model);
    setFormData({
      name: model.name || '',
      description: model.description || '',
      category: model.category || '',
      model_type: model.model_type || 'json',
      file: null // Can't pre-populate file input
    });
    setShowModelModal(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (model) => {
    setCurrentModel(model);
    setShowDeleteModal(true);
  };

  // Handle model create/update
  const handleModelSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setUploading(true);
      const token = getToken();

      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Create FormData object for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('model_type', formData.model_type);

      // Only append file if we're creating a new model or if a file is selected for update
      if (!currentModel || formData.file) {
        if (!formData.file && !currentModel) {
          throw new Error('Please select a file to upload');
        }

        if (formData.file) {
          formDataToSend.append('file', formData.file);
        }
      }

      const url = currentModel
          ? `${API_BASE_URL}/models/${currentModel._id}`
          : `${API_BASE_URL}/models`;

      const method = currentModel ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type header when sending FormData
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to ${currentModel ? 'update' : 'create'} model`);
      }

      setSuccessMessage(`Model ${currentModel ? 'updated' : 'created'} successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);

      setShowModelModal(false);
      fetchModels();
      resetForm();
    } catch (err) {
      setError(err.message);
      console.error('Error saving model:', err);
    } finally {
      setUploading(false);
    }
  };

  // Handle model deletion
  const handleDeleteModel = async () => {
    try {
      setError(null);
      const token = getToken();

      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${API_BASE_URL}/models/${currentModel._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to delete model');
      }

      setSuccessMessage('Model deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);

      setShowDeleteModal(false);
      fetchModels();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting model:', err);
    }
  };

  // Handle model download
  const handleDownloadModel = async (modelId) => {
    try {
      const token = getToken();

      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Create headers with authorization
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // Create a download link and simulate a click
      const link = document.createElement('a');
      link.href = `${API_BASE_URL}/models/${modelId}/download`;
      link.setAttribute('download', '');

      // Create a hidden iframe to handle the download
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      // Use fetch to get the file with proper headers
      const response = await fetch(`${API_BASE_URL}/models/${modelId}/download`, {
        headers: headers
      });

      if (!response.ok) {
        throw new Error('Failed to download model');
      }

      // Get the blob data
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Set the link href to the blob URL
      link.href = url;

      // Trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      document.body.removeChild(iframe);

    } catch (err) {
      setError('Failed to download model: ' + err.message);
      console.error('Error downloading model:', err);
    }
  };

  // Get model type icon
  const getModelTypeIcon = (modelType) => {
    const icons = {
      'json': faDatabase,
      'csv': faChartLine,
      'text': faFileAlt
    };

    return icons[modelType] || faDatabase;
  };

  // Get model type badge color
  const getModelTypeBadgeColor = (modelType) => {
    const colors = {
      'json': 'info',
      'csv': 'success',
      'text': 'warning'
    };

    return colors[modelType] || 'secondary';
  };

  return (
      <Container fluid className="px-4 py-3">
        {/* Header with navigation */}
        <div className="d-flex align-items-center mb-4">
          <Button
              variant="outline-secondary"
              className="me-3"
              onClick={showUserDashboard}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Back to Users
          </Button>
          <div>
            <h2 className="fs-4 fw-bold mb-1">
              Models Dashboard {selectedUser && selectedUser !== 'All Users' && <span>for {selectedUser}</span>}
            </h2>
            <p className="text-muted mb-0">Manage AI models and configurations</p>
          </div>
        </div>

        {/* Error and success alerts */}
        {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <div className="d-flex align-items-center">
                <div className="fw-bold me-2">Error:</div>
                {error}
              </div>
            </Alert>
        )}

        {successMessage && (
            <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
              <div className="d-flex align-items-center">
                <div className="fw-bold me-2">Success:</div>
                {successMessage}
              </div>
            </Alert>
        )}

        {/* Search and action buttons */}
        <div className="d-flex mb-4 gap-2">
          <div className="position-relative flex-grow-1">
            <Form.Control
                type="text"
                placeholder="Search models by name, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ps-4"
            />
            <FontAwesomeIcon
                icon={faSearch}
                className="position-absolute text-muted"
                style={{ left: '10px', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>
          <Button
              variant="primary"
              onClick={openModalForCreate}
              className="d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add Model
          </Button>
          <Button
              variant="outline-secondary"
              onClick={fetchModels}
              title="Refresh"
              className="d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px', padding: '0' }}
          >
            <FontAwesomeIcon icon={faRefresh} />
          </Button>
        </div>

        {/* Models table or loading spinner */}
        {loading ? (
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center py-5">
                <Spinner animation="border" variant="primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-3 text-muted">Loading model data...</p>
              </Card.Body>
            </Card>
        ) : (
            <Card className="shadow-sm border-0 bg-white">
              <Card.Body className="p-0">
                <Table hover responsive className="mb-0 align-middle">
                  <thead>
                  <tr className="bg-light">
                    <th style={{ minWidth: '240px' }} className="border-0 px-4 py-3">Model Name</th>
                    <th className="border-0 px-4 py-3">Description</th>
                    <th className="border-0 px-4 py-3">Category</th>
                    <th className="border-0 px-4 py-3">Model Type</th>
                    <th className="border-0 px-4 py-3 text-center">Created</th>
                    <th className="border-0 px-4 py-3 text-end">Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {filteredModels.length > 0 ? (
                      filteredModels.map(model => (
                          <tr key={model._id}>
                            <td className="px-4 py-3">
                              <div className="d-flex align-items-center">
                                <div
                                    className="avatar rounded-circle p-2 d-flex align-items-center justify-content-center me-3"
                                    style={{
                                      width: '46px',
                                      height: '46px',
                                      background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
                                      color: 'white',
                                      boxShadow: '0 2px 10px rgba(108, 92, 231, 0.2)'
                                    }}
                                >
                                  <FontAwesomeIcon icon={getModelTypeIcon(model.model_type)} />
                                </div>
                                <div>
                                  <div className="fw-bold">{model.name}</div>
                                  <div className="text-muted small">ID: {model._id.substring(0, 8)}...</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {model.description && model.description.length > 80
                                  ? `${model.description.substring(0, 80)}...`
                                  : model.description}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                  bg="primary"
                                  className="fw-medium rounded-pill px-3 py-2"
                              >
                                {model.category}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                  bg={`${getModelTypeBadgeColor(model.model_type)}-subtle`}
                                  text={getModelTypeBadgeColor(model.model_type)}
                                  className="fw-medium rounded-pill px-3 py-2 text-uppercase"
                              >
                                {model.model_type}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="d-flex flex-column">
                                <span>{new Date(model.created_at).toLocaleDateString()}</span>
                                <small className="text-muted">{new Date(model.created_at).toLocaleTimeString()}</small>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-end">
                              <div className="d-flex justify-content-end gap-2">
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    title="View Model Details"
                                    className="rounded-circle"
                                    style={{ width: '36px', height: '36px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    onClick={() => handleDownloadModel(model._id)}
                                >
                                  <FontAwesomeIcon icon={faDownload} />
                                </Button>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    title="Edit Model"
                                    className="rounded-circle"
                                    style={{ width: '36px', height: '36px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    onClick={() => openModalForEdit(model)}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    title="Delete Model"
                                    className="rounded-circle"
                                    style={{ width: '36px', height: '36px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    onClick={() => openDeleteModal(model)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <div className="d-flex flex-column align-items-center">
                            <FontAwesomeIcon
                                icon={faDatabase}
                                size="2x"
                                className="text-muted mb-3"
                                style={{ opacity: 0.5 }}
                            />
                            <h5 className="mb-1">No Models Found</h5>
                            <p className="text-muted">
                              {searchTerm
                                  ? 'No models match your search criteria'
                                  : 'No models have been created yet'
                              }
                            </p>
                            {searchTerm ? (
                                <Button variant="link" onClick={() => setSearchTerm('')}>
                                  Clear search
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    onClick={openModalForCreate}
                                    className="mt-2"
                                >
                                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                                  Add First Model
                                </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </Table>
              </Card.Body>
              <Card.Footer className="bg-white border-top px-4 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-muted small">
                    Showing {filteredModels.length} of {models.length} models
                  </div>
                </div>
              </Card.Footer>
            </Card>
        )}

        {/* Model Form Modal (Add/Edit) */}
        <Modal
            show={showModelModal}
            onHide={() => setShowModelModal(false)}
            centered
            size="lg"
            backdrop="static"
        >
          <Modal.Header
              closeButton
              className="border-0 pb-0"
              style={{
                background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
                borderRadius: '8px 8px 0 0'
              }}
          >
            <Modal.Title className="w-100">
              <div className="d-flex align-items-center py-2">
                <div
                    className="rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      width: '50px',
                      height: '50px',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                    }}
                >
                  <FontAwesomeIcon icon={currentModel ? faEdit : faPlus} size="lg" />
                </div>
                <div>
                  <h4 className="mb-0" style={{ color: 'white', fontWeight: '600' }}>
                    {currentModel ? 'Edit Model' : 'Add New Model'}
                  </h4>
                  <small style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                    {currentModel ? 'Update model details' : 'Create a new AI model'}
                  </small>
                </div>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleModelSubmit}>
            <Modal.Body className="px-4 py-4">
              <Row>
                <Col md={12}>
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Body className="p-4">
                      <h6 className="mb-3 fw-bold text-primary">
                        <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                        Model Information
                      </h6>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-medium">Model Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter model name"
                                className="rounded-3"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-medium">Category</Form.Label>
                            <Form.Select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                                className="rounded-3"
                            >
                              <option value="">Select a category</option>
                              {categoryOptions.map(category => (
                                  <option key={category} value={category}>{category}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            placeholder="Provide a detailed description of the model"
                            className="rounded-3"
                        />
                      </Form.Group>
                    </Card.Body>
                  </Card>

                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Body className="p-4">
                      <h6 className="mb-3 fw-bold text-success">
                        <FontAwesomeIcon icon={faUpload} className="me-2" />
                        Model File
                      </h6>
                      <Row className="align-items-end">
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-medium">Model Type</Form.Label>
                            <Form.Select
                                name="model_type"
                                value={formData.model_type}
                                onChange={handleInputChange}
                                required
                                className="rounded-3"
                            >
                              {modelTypeOptions.map(type => (
                                  <option key={type} value={type}>{type.toUpperCase()}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={8}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-medium">
                              Upload File {!currentModel && <span className="text-danger">*</span>}
                            </Form.Label>
                            <div className="input-group">
                              <Form.Control
                                  type="file"
                                  ref={fileInputRef}
                                  onChange={handleFileChange}
                                  required={!currentModel}
                                  className="rounded-start"
                                  accept={`.${formData.model_type}`}
                              />
                              <Button
                                  variant="outline-secondary"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="d-flex align-items-center"
                              >
                                <FontAwesomeIcon icon={faUpload} />
                              </Button>
                            </div>
                            <Form.Text className="text-muted">
                              {formData.file ?
                                  `Selected file: ${formData.file.name} (${formatFileSize(formData.file.size)})` :
                                  currentModel ? 'Leave empty to keep current file' : 'Please select a file to upload'}
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Alert variant="info" className="mb-0 mt-2">
                        <FontAwesomeIcon icon={faEye} className="me-2" />
                        <small>
                          Make sure your {formData.model_type.toUpperCase()} file is properly formatted.
                          {formData.model_type === 'json' && ' The system will validate JSON syntax.'}
                          {formData.model_type === 'csv' && ' CSV files should have proper headers and data.'}
                          {formData.model_type === 'text' && ' Text files should follow the expected format.'}
                        </small>
                      </Alert>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer className="border-0 px-4 pb-4 pt-0">
              <Button
                  variant="light"
                  onClick={() => setShowModelModal(false)}
                  disabled={uploading}
                  className="rounded-3 px-4"
              >
                Cancel
              </Button>
              <Button
                  variant="primary"
                  type="submit"
                  disabled={uploading}
                  className="rounded-3 px-4 d-flex align-items-center"
              >
                {uploading ? (
                    <>
                      <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                      />
                      <span>{currentModel ? 'Updating...' : 'Creating...'}</span>
                    </>
                ) : (
                    <>
                      <FontAwesomeIcon
                          icon={currentModel ? faEdit : faPlus}
                          className="me-2"
                      />
                      {currentModel ? 'Update Model' : 'Create Model'}
                    </>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            centered
            size="sm"
        >
          <Modal.Header
              closeButton
              style={{
                backgroundColor: '#FFF5F5',
                borderBottom: '1px solid #FED7D7'
              }}
          >
            <Modal.Title>
              <div className="d-flex align-items-center text-danger">
                <div className="rounded-circle bg-danger bg-opacity-10 p-2 me-2">
                  <FontAwesomeIcon icon={faTrash} />
                </div>
                <span>Delete Model</span>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <p className="mb-2">Are you sure you want to delete this model?</p>
            {currentModel && (
                <div className="p-3 bg-light rounded mb-3">
                  <div className="fw-bold">{currentModel.name}</div>
                  <div className="text-muted small mt-1">ID: {currentModel._id}</div>
                </div>
            )}
            <Alert variant="warning" className="mb-0 py-2">
              <small className="d-block fw-medium">This action cannot be undone and all related data will be permanently removed.</small>
            </Alert>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button
                variant="outline-secondary"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-3"
            >
              Cancel
            </Button>
            <Button
                variant="danger"
                onClick={handleDeleteModel}
                className="rounded-3 d-flex align-items-center"
            >
              <FontAwesomeIcon icon={faTrash} className="me-1" />
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
  );
}

export default ModelsDashboard;