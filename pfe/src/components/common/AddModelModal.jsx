import React, { useState, useRef, useEffect } from "react";
import { Modal, Alert, OverlayTrigger, Tooltip, Spinner } from "react-bootstrap";
import { Bot, CloudUpload, Download, Plus } from "lucide-react";
import axios from "axios";

const AddModelModal = ({ show, onHide, theme = "dark", isAdmin = false, onModelAdded }) => {
  // State for form data
  const [modelData, setModelData] = useState({
    name: "",
    description: "",
    model_type: "json",
    category: "health",
  });

  // State for file handling
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fileInputRef = useRef(null);
  const isDarkMode = theme === "dark";

  // Reset form when modal is opened
  useEffect(() => {
    if (show) {
      resetForm();
    }
  }, [show]);

  // Theme colors
  const themeColors = {
    background: isDarkMode ? "var(--color-dark)" : "#ffffff",
    cardBg: isDarkMode ? "rgba(30, 35, 45, 0.7)" : "#f8f9fa",
    text: isDarkMode ? "#e0e6ed" : "#212529",
    bodyText: isDarkMode ? "rgba(160, 174, 192, 0.85)" : "#6c757d",
    input: isDarkMode ? "rgba(44, 51, 63, 0.5)" : "#f8f9fa",
    inputBorder: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#ced4da",
    gradientPrimary: "linear-gradient(135deg, #4a90e2 0%, #357abd 100%)",
    gradientSuccess: "linear-gradient(135deg, #42e695 0%, #3bb078 100%)",
    primaryGlow: "0 0 10px rgba(74, 144, 226, 0.5)",
    successBg: isDarkMode ? "rgba(66, 230, 149, 0.1)" : "rgba(66, 230, 149, 0.1)",
    successBorder: isDarkMode ? "rgba(66, 230, 149, 0.2)" : "rgba(66, 230, 149, 0.2)",
    dangerLightBg: isDarkMode ? "rgba(255, 59, 48, 0.1)" : "rgba(255, 59, 48, 0.1)",
    dangerLightBorder: isDarkMode ? "rgba(255, 59, 48, 0.2)" : "rgba(255, 59, 48, 0.2)",
    dangerText: isDarkMode ? "#ff6b6b" : "#dc3545",
    border: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#dee2e6",
    uploadAreaBg: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(13, 110, 253, 0.05)",
    dragBgActive: isDarkMode ? "rgba(74, 144, 226, 0.1)" : "rgba(13, 110, 253, 0.1)",
    buttonHover: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(13, 110, 253, 0.2)",
    tooltipBackground: isDarkMode ? "#2c333f" : "#343a40",
    modalRadius: "12px",
    modalTitleSize: "1.5rem",
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError("");
    setFileUploaded(false);
    setSelectedFile(null);

    if (!file) {
      setFileName("");
      return;
    }

    const fileExtension = file.name.split(".").pop().toLowerCase();
    const validExtensions = {
      json: ["json"],
      csv: ["csv"],
      text: ["txt", "text"],
    };

    const isValidJson = validExtensions.json.includes(fileExtension);
    const isValidCsv = validExtensions.csv.includes(fileExtension);
    const isValidText = validExtensions.text.includes(fileExtension);

    if (!isValidJson && !isValidCsv && !isValidText) {
      setFileError("Please upload a JSON, CSV, or TEXT file");
      setFileName("");
      e.target.value = null;
      return;
    }

    let detectedType = "json";
    if (isValidCsv) detectedType = "csv";
    if (isValidText) detectedType = "text";

    setModelData((prev) => ({
      ...prev,
      model_type: detectedType,
    }));
    setFileName(file.name);
    setSelectedFile(file);
    setFileUploaded(true);
  };

  // Handle file drop
  const handleFileDrop = (e) => {
    e.preventDefault();
    e.currentTarget.style.background = themeColors.uploadAreaBg;
    e.currentTarget.style.borderColor = themeColors.border;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;

        const event = new Event("change", { bubbles: true });
        fileInputRef.current.dispatchEvent(event);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);

    if (!selectedFile) {
      setSubmitError("Please upload a model file");
      return;
    }

    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    const validExtensions = {
      json: ["json"],
      csv: ["csv"],
      text: ["txt", "text"],
    };

    if (!validExtensions[modelData.model_type].includes(fileExtension)) {
      setSubmitError(
          `File type doesn't match selected model type. Please select a ${modelData.model_type.toUpperCase()} file.`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const formData = new FormData();
      formData.append("name", modelData.name);
      formData.append("description", modelData.description);
      formData.append("model_type", modelData.model_type);
      formData.append("category", modelData.category);
      formData.append("file", selectedFile);

      const response = await axios.post(
          "http://localhost:8000/api/v1/models/",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
      );

      console.log("Model created successfully:", response.data);
      setSubmitSuccess(true);

      if (onModelAdded) {
        onModelAdded(response.data);
      }

      setTimeout(() => {
        resetForm();
        onHide();
      }, 1000);
    } catch (error) {
      console.error("Error creating model:", error);
      setSubmitError(
          error.response?.data?.detail ||
          "An error occurred while uploading the model. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset the form to initial state
  const resetForm = () => {
    setModelData({
      name: "",
      description: "",
      model_type: "json",
      category: "health",
    });
    setSelectedFile(null);
    setFileUploaded(false);
    setFileName("");
    setFileError("");
    setSubmitError("");
    setSubmitSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const customStyles = `
    ::placeholder {
      color: ${isDarkMode ? "rgba(160, 174, 192, 0.5)" : "rgba(108, 117, 125, 0.65)"} !important;
      opacity: 1;
    }
    .modal-content {
      border-radius: ${themeColors.modalRadius};
    }
    .form-control, .form-select {
      transition: all 0.3s ease;
    }
    .form-control:focus, .form-select:focus {
      box-shadow: ${themeColors.primaryGlow};
      border-color: var(--color-primary);
    }
    .btn-primary-action:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(74, 144, 226, 0.4);
    }
    .upload-area:hover {
      border-color: var(--color-primary);
      background: ${themeColors.dragBgActive};
    }
  `;

  return (
      <Modal
          show={show}
          onHide={onHide}
          centered
          size="lg"
          contentClassName="border-0"
          dialogClassName="modal-blur"
          backdropClassName={isDarkMode ? "modal-backdrop-dark" : ""}
      >
        <style>{customStyles}</style>
        <div
            className="modal-content border-0 shadow-lg"
            style={{
              background: themeColors.background,
              color: themeColors.text,
            }}
        >
          <Modal.Header className="border-0 pb-0 pt-4 px-4">
            <div className="d-flex align-items-center w-100">
              <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: themeColors.gradientPrimary,
                    boxShadow: themeColors.primaryGlow,
                  }}
              >
                <Bot className="text-white" size={24} />
              </div>
              <div className="flex-grow-1">
                <Modal.Title
                    style={{
                      color: themeColors.text,
                      fontSize: themeColors.modalTitleSize,
                    }}
                    className="fw-bold mb-0"
                >
                  Add New AI Model
                </Modal.Title>
                <p
                    style={{ color: themeColors.bodyText }}
                    className="mb-0 fs-6 mt-1"
                >
                  Configure and upload your model
                </p>
              </div>
              <button
                  type="button"
                  className="btn btn-icon bg-transparent border-0"
                  onClick={onHide}
                  aria-label="Close"
                  style={{
                    color: themeColors.bodyText,
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                      (e.currentTarget.style.background = isDarkMode
                          ? "rgba(255, 255, 255, 0.1)"
                          : "#e9ecef")
                  }
                  onMouseOut={(e) =>
                      (e.currentTarget.style.background = "transparent")
                  }
              >
                <i className="fa-solid fa-xmark fs-5"></i>
              </button>
            </div>
          </Modal.Header>

          <Modal.Body className="p-4">
            {submitError && (
                <Alert variant="danger" className="mb-4 rounded-3">
                  <i className="fa-solid fa-circle-exclamation me-2"></i>
                  {submitError}
                </Alert>
            )}

            {submitSuccess && (
                <Alert variant="success" className="mb-4 rounded-3">
                  <i className="fa-solid fa-circle-check me-2"></i>
                  Model created successfully!
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                    htmlFor="modelName"
                    className="fw-medium mb-2 d-flex align-items-center"
                    style={{ color: themeColors.text }}
                >
                  <i className="fa-solid fa-tag me-2 text-primary"></i>
                  Model Name
                </label>
                <input
                    type="text"
                    className="form-control border-0 py-3 px-4 rounded-3"
                    id="modelName"
                    value={modelData.name}
                    onChange={(e) =>
                        setModelData({ ...modelData, name: e.target.value })
                    }
                    required
                    style={{
                      background: themeColors.input,
                      color: themeColors.text,
                      border: `1px solid ${themeColors.inputBorder}`,
                    }}
                    placeholder="Enter model name"
                />
              </div>

              <div className="mb-4">
                <label
                    htmlFor="modelDescription"
                    className="fw-medium mb-2 d-flex align-items-center"
                    style={{ color: themeColors.text }}
                >
                  <i className="fa-solid fa-align-left me-2 text-primary"></i>
                  Description
                </label>
                <textarea
                    className="form-control border-0 py-3 px-4 rounded-3"
                    id="modelDescription"
                    rows="3"
                    placeholder="Describe what this model does and its use case"
                    value={modelData.description}
                    onChange={(e) =>
                        setModelData({ ...modelData, description: e.target.value })
                    }
                    required
                    style={{
                      background: themeColors.input,
                      color: themeColors.text,
                      border: `1px solid ${themeColors.inputBorder}`,
                    }}
                />
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label
                      htmlFor="modelType"
                      className="fw-medium mb-2 d-flex align-items-center"
                      style={{ color: themeColors.text }}
                  >
                    <i className="fa-solid fa-cube me-2 text-primary"></i>
                    Model Type
                  </label>
                  <select
                      className="form-select border-0 py-3 px-4 rounded-3"
                      id="modelType"
                      value={modelData.model_type}
                      onChange={(e) =>
                          setModelData({ ...modelData, model_type: e.target.value })
                      }
                      required
                      style={{
                        background: themeColors.input,
                        color: themeColors.text,
                        border: `1px solid ${themeColors.inputBorder}`,
                      }}
                  >
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                    <option value="text">Text</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label
                      htmlFor="modelCategory"
                      className="fw-medium mb-2 d-flex align-items-center"
                      style={{ color: themeColors.text }}
                  >
                    <i className="fa-solid fa-tags me-2 text-primary"></i>
                    Category
                  </label>
                  <select
                      className="form-select border-0 py-3 px-4 rounded-3"
                      id="modelCategory"
                      value={modelData.category}
                      onChange={(e) =>
                          setModelData({ ...modelData, category: e.target.value })
                      }
                      required
                      style={{
                        background: themeColors.input,
                        color: themeColors.text,
                        border: `1px solid ${themeColors.inputBorder}`,
                      }}
                  >
                    <option value="health">Health</option>
                    <option value="art">Art</option>
                    <option value="technology">Technology</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="football">Football</option>
                    <option value="sport">Sport</option>
                  </select>
                </div>
              </div>

              <div
                  className="p-4 rounded-3 mb-4"
                  style={{
                    background: themeColors.cardBg,
                    border: `1px solid ${themeColors.inputBorder}`,
                  }}
              >
                <div className="d-flex align-items-center mb-3">
                  <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "40px",
                        height: "40px",
                        background: themeColors.gradientPrimary,
                      }}
                  >
                    <Download className="text-white" size={20} />
                  </div>
                  <div>
                    <h5
                        className="fw-bold mb-0"
                        style={{ color: themeColors.text }}
                    >
                      Upload Model File
                    </h5>
                    <p
                        className="mb-0 mt-1"
                        style={{ color: themeColors.bodyText }}
                    >
                      <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip style={{ background: themeColors.tooltipBackground }}>
                              Supported file formats: .json for JSON, .csv for CSV, .txt/.text for Text
                            </Tooltip>
                          }
                      >
                      <span>
                        <i className="fa-solid fa-circle-info me-1 text-primary"></i>
                        File format should match model type
                      </span>
                      </OverlayTrigger>
                    </p>
                  </div>
                </div>

                {!fileUploaded ? (
                    <div
                        className="upload-area p-4 rounded-3 text-center"
                        style={{
                          border: `2px dashed ${themeColors.border}`,
                          background: themeColors.uploadAreaBg,
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.currentTarget.style.background = themeColors.dragBgActive;
                          e.currentTarget.style.borderColor = "var(--color-primary)";
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.currentTarget.style.background = themeColors.uploadAreaBg;
                          e.currentTarget.style.borderColor = themeColors.border;
                        }}
                        onDrop={handleFileDrop}
                    >
                      <CloudUpload className="text-primary mb-3" size={32} />
                      <h6
                          className="fw-medium mb-2"
                          style={{ color: themeColors.text }}
                      >
                        Drag & Drop your file here
                      </h6>
                      <p
                          style={{ color: themeColors.bodyText }}
                          className="mb-3"
                      >
                        Upload a model file (JSON, CSV, or TEXT)
                      </p>
                      <button
                          type="button"
                          className="btn btn-primary-action py-2 px-4 rounded-pill"
                          style={{
                            background: themeColors.gradientPrimary,
                            color: "white",
                          }}
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      >
                        <i className="fa-solid fa-folder-open me-2"></i>
                        Browse Files
                      </button>
                      <input
                          ref={fileInputRef}
                          type="file"
                          className="d-none"
                          accept=".json,.csv,.txt,.text"
                          onChange={handleFileChange}
                      />
                    </div>
                ) : (
                    <div
                        className="p-3 rounded-3"
                        style={{
                          background: themeColors.successBg,
                          border: `1px solid ${themeColors.successBorder}`,
                        }}
                    >
                      <div className="d-flex align-items-center">
                        <i className="fa-solid fa-file-circle-check text-success fs-4 me-3"></i>
                        <div className="flex-grow-1">
                          <h6
                              className="mb-1 fw-medium"
                              style={{ color: themeColors.text }}
                          >
                            {fileName}
                          </h6>
                          <div className="d-flex flex-wrap gap-2">
                        <span className="badge bg-success">
                          {modelData.model_type.toUpperCase()}
                        </span>
                            <span className="badge bg-success">
                          {modelData.category}
                        </span>
                          </div>
                        </div>
                        <button
                            type="button"
                            className="btn btn-sm"
                            style={{
                              background: themeColors.dangerLightBg,
                              color: themeColors.dangerText,
                            }}
                            onClick={() => {
                              setFileUploaded(false);
                              setFileName("");
                              setSelectedFile(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = null;
                              }
                            }}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    </div>
                )}

                {fileError && (
                    <Alert variant="danger" className="mt-3 py-2 rounded-3">
                      <i className="fa-solid fa-circle-exclamation me-2"></i>
                      {fileError}
                    </Alert>
                )}
              </div>

              <Modal.Footer className="border-0 px-0 py-0">
                <button
                    type="button"
                    className="btn py-2 px-4 rounded-pill"
                    style={{
                      background: "transparent",
                      color: themeColors.bodyText,
                      border: `1px solid ${themeColors.inputBorder}`,
                    }}
                    onClick={onHide}
                    disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                    type="submit"
                    className="btn py-2 px-4 rounded-pill d-flex align-items-center"
                    style={{
                      background: themeColors.gradientPrimary,
                      color: "white",
                    }}
                    disabled={isSubmitting || submitSuccess}
                >
                  {isSubmitting ? (
                      <>
                        <Spinner
                            animation="border"
                            size="sm"
                            className="me-2"
                            role="status"
                            aria-hidden="true"
                        />
                        Uploading...
                      </>
                  ) : submitSuccess ? (
                      <>
                        <i className="fa-solid fa-check me-2"></i>
                        Added Successfully
                      </>
                  ) : (
                      <>
                        <Plus className="me-2" size={20} />
                        Add Model
                      </>
                  )}
                </button>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </div>
      </Modal>
  );
};

export default AddModelModal;