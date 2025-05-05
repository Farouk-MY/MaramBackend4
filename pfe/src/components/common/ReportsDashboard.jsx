import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Badge, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faReply,
    faEye,
    faFilter,
    faEnvelope,
    faCheckCircle,
    faClock,
    faPause,
    faChartLine,
    faCalendarAlt,
    faUser,
    faSpinner,
    faSearch,
    faSort,
    faArrowUp,
    faArrowDown
} from '@fortawesome/free-solid-svg-icons';

const ReportsDashboard = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [responseText, setResponseText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('created_at');
    const [sortDirection, setSortDirection] = useState('desc');
    const [statsData, setStatsData] = useState({
        total: 0,
        pending: 0,
        responded: 0,
        inProgress: 0,
        done: 0
    });

    const API_BASE_URL = 'http://localhost:8000/api/v1/contact';

    const statusOptions = {
        'all': 'All Reports',
        'pending': 'Pending',
        'responded': 'Responded',
        'in_progress': 'In Progress',
        'done': 'Done'
    };

    const statusIcons = {
        'pending': faPause,
        'responded': faEnvelope,
        'in_progress': faClock,
        'done': faCheckCircle
    };

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        if (reports.length > 0) {
            calculateStats();
        }
    }, [reports]);

    const calculateStats = () => {
        const stats = {
            total: reports.length,
            pending: reports.filter(r => r.status === 'pending').length,
            responded: reports.filter(r => r.status === 'responded').length,
            inProgress: reports.filter(r => r.status === 'in_progress').length,
            done: reports.filter(r => r.status === 'done').length
        };
        setStatsData(stats);
    };

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/admin/reports`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setReports(response.data);
        } catch (error) {
            toast.error('Failed to fetch reports');
            console.error('Error fetching reports:', error.response?.data || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRespond = (report) => {
        if (!report?.id) {
            toast.error('Invalid report data');
            return;
        }
        setSelectedReport(report);
        setResponseText(report.response || '');
        setShowModal(true);
    };

    const handleViewDetails = (report) => {
        if (!report?.id) {
            toast.error('Invalid report data');
            return;
        }
        setSelectedReport(report);
        setShowDetails(true);
    };

    const handleSubmitResponse = async () => {
        if (!responseText.trim()) {
            toast.error('Response cannot be empty');
            return;
        }

        if (!selectedReport?.id) {
            toast.error('No report selected');
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_BASE_URL}/admin/reports/${selectedReport.id}/respond`,
                { response: responseText },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            toast.success('Response sent successfully');
            setShowModal(false);
            await fetchReports();
        } catch (error) {
            console.error('Error submitting response:', error.response?.data || error.message);
            toast.error(error.response?.data?.detail || 'Failed to send response');
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateReportStatus = async (reportId, newStatus) => {
        if (!reportId) {
            toast.error('Invalid report ID');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${API_BASE_URL}/admin/reports/${reportId}/status`,
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            toast.success(`Status updated to ${newStatus}`);
            await fetchReports();
        } catch (error) {
            console.error('Error updating status:', error.response?.data || error.message);
            toast.error(error.response?.data?.detail || 'Failed to update status');
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-warning text-dark';
            case 'responded': return 'bg-info text-white';
            case 'in_progress': return 'bg-primary text-white';
            case 'done': return 'bg-success text-white';
            default: return 'bg-secondary text-white';
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortReports = (reportsList) => {
        return [...reportsList].sort((a, b) => {
            if (sortField === 'name') {
                const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
                const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
                return sortDirection === 'asc'
                    ? nameA.localeCompare(nameB)
                    : nameB.localeCompare(nameA);
            }

            if (sortField === 'created_at') {
                return sortDirection === 'asc'
                    ? new Date(a.created_at) - new Date(b.created_at)
                    : new Date(b.created_at) - new Date(a.created_at);
            }

            return sortDirection === 'asc'
                ? (a[sortField] > b[sortField] ? 1 : -1)
                : (a[sortField] < b[sortField] ? 1 : -1);
        });
    };

    const filteredReports = reports
        .filter(report => {
            if (statusFilter !== 'all' && report.status !== statusFilter) return false;

            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                return (
                    `${report.first_name} ${report.last_name}`.toLowerCase().includes(searchLower) ||
                    report.email.toLowerCase().includes(searchLower) ||
                    report.message.toLowerCase().includes(searchLower)
                );
            }

            return true;
        });

    const sortedReports = sortReports(filteredReports);

    const getSortIcon = (field) => {
        if (sortField !== field) return <FontAwesomeIcon icon={faSort} className="ms-1 text-muted" />;
        return sortDirection === 'asc'
            ? <FontAwesomeIcon icon={faArrowUp} className="ms-1" />
            : <FontAwesomeIcon icon={faArrowDown} className="ms-1" />;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-4 bg-light">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="m-0 fw-bold text-primary">
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                    Contact Reports Dashboard
                </h2>
                <div className="d-flex gap-2">
                    <Button
                        variant="outline-secondary"
                        onClick={fetchReports}
                        disabled={isLoading}
                    >
                        <FontAwesomeIcon icon={faArrowUp} className="me-1" /> Refresh
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="row mb-4">
                <div className="col-md-3 mb-3 mb-md-0">
                    <Card className="shadow-sm h-100 border-0">
                        <Card.Body className="d-flex align-items-center">
                            <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                                <FontAwesomeIcon icon={faChartLine} className="text-primary fa-2x" />
                            </div>
                            <div>
                                <h6 className="text-muted mb-1">Total Reports</h6>
                                <h3 className="mb-0 fw-bold">{statsData.total}</h3>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-md-3 mb-3 mb-md-0">
                    <Card className="shadow-sm h-100 border-0">
                        <Card.Body className="d-flex align-items-center">
                            <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                                <FontAwesomeIcon icon={faPause} className="text-warning fa-2x" />
                            </div>
                            <div>
                                <h6 className="text-muted mb-1">Pending</h6>
                                <h3 className="mb-0 fw-bold">{statsData.pending}</h3>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-md-3 mb-3 mb-md-0">
                    <Card className="shadow-sm h-100 border-0">
                        <Card.Body className="d-flex align-items-center">
                            <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                                <FontAwesomeIcon icon={faClock} className="text-info fa-2x" />
                            </div>
                            <div>
                                <h6 className="text-muted mb-1">In Progress</h6>
                                <h3 className="mb-0 fw-bold">{statsData.inProgress}</h3>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-md-3">
                    <Card className="shadow-sm h-100 border-0">
                        <Card.Body className="d-flex align-items-center">
                            <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-success fa-2x" />
                            </div>
                            <div>
                                <h6 className="text-muted mb-1">Completed</h6>
                                <h3 className="mb-0 fw-bold">{statsData.done}</h3>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="row mb-4">
                <div className="col-md-6 mb-3 mb-md-0">
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                            <FontAwesomeIcon icon={faSearch} className="text-muted" />
                        </span>
                        <Form.Control
                            type="text"
                            placeholder="Search by name, email or message..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border-start-0"
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="d-flex gap-2 justify-content-md-end">
                        {Object.entries(statusOptions).map(([value, label]) => (
                            <Button
                                key={`filter-btn-${value}`}
                                variant={statusFilter === value ?
                                    (value === 'all' ? 'primary' : `outline-${getStatusBadgeClass(value).split('-')[1]}`) :
                                    (value === 'all' ? 'outline-primary' : `outline-${getStatusBadgeClass(value).split('-')[1]}`)}
                                size="sm"
                                onClick={() => setStatusFilter(value)}
                                className="d-flex align-items-center"
                            >
                                {value !== 'all' && (
                                    <FontAwesomeIcon icon={statusIcons[value]} className="me-1" />
                                )}
                                {label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reports Table */}
            <Card className="shadow-sm border-0">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('name')}>
                                        <span className="d-flex align-items-center">
                                            <FontAwesomeIcon icon={faUser} className="me-2 text-muted" />
                                            Name {getSortIcon('name')}
                                        </span>
                                </th>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('email')}>
                                        <span className="d-flex align-items-center">
                                            <FontAwesomeIcon icon={faEnvelope} className="me-2 text-muted" />
                                            Email {getSortIcon('email')}
                                        </span>
                                </th>
                                <th className="px-4 py-3">Message Preview</th>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('status')}>
                                        <span className="d-flex align-items-center">
                                            Status {getSortIcon('status')}
                                        </span>
                                </th>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('created_at')}>
                                        <span className="d-flex align-items-center">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-muted" />
                                            Date {getSortIcon('created_at')}
                                        </span>
                                </th>
                                <th className="px-4 py-3 text-end">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                                        Loading reports...
                                    </td>
                                </tr>
                            ) : sortedReports.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        No reports found matching your criteria
                                    </td>
                                </tr>
                            ) : (
                                sortedReports.map((report) => (
                                    <tr key={`report-${report.id}`} className="align-middle">
                                        <td className="px-4 py-3 fw-semibold">
                                            {report.first_name} {report.last_name}
                                        </td>
                                        <td className="px-4 py-3">{report.email}</td>
                                        <td className="px-4 py-3 text-muted">
                                            {report.message.length > 50
                                                ? `${report.message.substring(0, 50)}...`
                                                : report.message}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge className={`${getStatusBadgeClass(report.status)} px-3 py-2 rounded-pill fw-normal`}>
                                                <FontAwesomeIcon icon={statusIcons[report.status]} className="me-1" />
                                                {report.status.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="d-flex flex-column">
                                                <small className="text-nowrap">
                                                    {formatDate(report.created_at)}
                                                </small>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="d-flex gap-2 justify-content-end">
                                                <Button
                                                    variant="light"
                                                    size="sm"
                                                    className="d-flex align-items-center"
                                                    onClick={() => handleViewDetails(report)}
                                                >
                                                    <FontAwesomeIcon icon={faEye} />
                                                </Button>
                                                {report.status === 'pending' && (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="d-flex align-items-center"
                                                        onClick={() => handleRespond(report)}
                                                        disabled={isSubmitting}
                                                    >
                                                        <FontAwesomeIcon icon={faReply} />
                                                    </Button>
                                                )}
                                                <Dropdown align="end">
                                                    <Dropdown.Toggle
                                                        variant="light"
                                                        size="sm"
                                                        id={`status-dropdown-${report.id}`}
                                                        className="d-flex align-items-center"
                                                    >
                                                        Status
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {Object.entries({
                                                            'pending': 'Pending',
                                                            'responded': 'Responded',
                                                            'in_progress': 'In Progress',
                                                            'done': 'Done'
                                                        }).map(([value, label]) => (
                                                            <Dropdown.Item
                                                                key={`status-${report.id}-${value}`}
                                                                onClick={() => updateReportStatus(report.id, value)}
                                                                disabled={report.status === value}
                                                                className="d-flex align-items-center"
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={statusIcons[value]}
                                                                    className={`me-2 text-${getStatusBadgeClass(value).split('-')[1]}`}
                                                                />
                                                                {label}
                                                            </Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            {/* Response Modal */}
            <Modal
                show={showModal}
                onHide={() => !isSubmitting && setShowModal(false)}
                centered
                backdrop="static"
            >
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fs-5">
                        <FontAwesomeIcon icon={faReply} className="text-primary me-2" />
                        Respond to {selectedReport?.first_name} {selectedReport?.last_name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4">
                    <Form>
                        <Form.Group className="mb-4">
                            <Form.Label className="text-muted fw-semibold">Original Message</Form.Label>
                            <div className="p-3 bg-light rounded border">
                                {selectedReport?.message || ''}
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted fw-semibold">Your Response</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                placeholder="Enter your response..."
                                disabled={isSubmitting}
                                className="border-0 bg-light"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button
                        variant="light"
                        onClick={() => setShowModal(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmitResponse}
                        disabled={isSubmitting || !responseText.trim()}
                    >
                        {isSubmitting ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faReply} className="me-2" />
                                Send Response
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Details Modal */}
            <Modal
                show={showDetails}
                onHide={() => setShowDetails(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fs-5">Report Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4">
                    {selectedReport && (
                        <>
                            <Card className="border-0 shadow-sm mb-4">
                                <Card.Body>
                                    <div className="row">
                                        <div className="col-md-6 mb-3 mb-md-0">
                                            <div className="d-flex">
                                                <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                                                    <FontAwesomeIcon icon={faUser} className="text-primary" />
                                                </div>
                                                <div>
                                                    <h6 className="fw-bold mb-1">Contact Information</h6>
                                                    <p className="mb-1">{selectedReport.first_name} {selectedReport.last_name}</p>
                                                    <p className="mb-1">{selectedReport.email}</p>
                                                    {selectedReport.phone && <p className="mb-0">{selectedReport.phone}</p>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="d-flex">
                                                <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-info" />
                                                </div>
                                                <div>
                                                    <h6 className="fw-bold mb-1">Status Information</h6>
                                                    <p className="mb-1">
                                                        <Badge className={`${getStatusBadgeClass(selectedReport.status)} px-3 py-2 rounded-pill fw-normal`}>
                                                            <FontAwesomeIcon icon={statusIcons[selectedReport.status]} className="me-2" />
                                                            {selectedReport.status.replace('_', ' ')}
                                                        </Badge>
                                                    </p>
                                                    <p className="mb-1">
                                                        <small>
                                                            <strong>Submitted:</strong> {formatDate(selectedReport.created_at)}
                                                        </small>
                                                    </p>
                                                    {selectedReport.responded_at && (
                                                        <p className="mb-0">
                                                            <small>
                                                                <strong>Responded:</strong> {formatDate(selectedReport.responded_at)}
                                                            </small>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>

                            <div className="mb-4">
                                <h6 className="fw-bold mb-3">Message</h6>
                                <Card className="border-0 shadow-sm">
                                    <Card.Body className="p-4">
                                        {selectedReport.message}
                                    </Card.Body>
                                </Card>
                            </div>

                            {selectedReport.response && (
                                <div className="mb-4">
                                    <h6 className="fw-bold mb-3">Response</h6>
                                    <Card className="border-0 shadow-sm bg-light">
                                        <Card.Body className="p-4">
                                            {selectedReport.response}
                                        </Card.Body>
                                    </Card>
                                </div>
                            )}

                            <div>
                                <h6 className="fw-bold mb-3">Update Status</h6>
                                <div className="d-flex gap-2">
                                    {Object.entries({
                                        'pending': {
                                            variant: 'warning',
                                            label: 'Pending',
                                            icon: faPause
                                        },
                                        'responded': {
                                            variant: 'info',
                                            label: 'Responded',
                                            icon: faEnvelope
                                        },
                                        'in_progress': {
                                            variant: 'primary',
                                            label: 'In Progress',
                                            icon: faClock
                                        },
                                        'done': {
                                            variant: 'success',
                                            label: 'Done',
                                            icon: faCheckCircle
                                        }
                                    }).map(([value, config]) => (
                                        <Button
                                            key={`status-update-${selectedReport.id}-${value}`}
                                            variant={selectedReport.status === value ? config.variant : `outline-${config.variant}`}
                                            onClick={() => updateReportStatus(selectedReport.id, value)}
                                            disabled={selectedReport.status === value}
                                            className="px-3 py-2"
                                        >
                                            <FontAwesomeIcon icon={config.icon} className="me-2" />
                                            {config.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" onClick={() => setShowDetails(false)}>
                        Close
                    </Button>
                    {selectedReport?.status === 'pending' && (
                        <Button variant="primary" onClick={() => {
                            setShowDetails(false);
                            handleRespond(selectedReport);
                        }}>
                            <FontAwesomeIcon icon={faReply} className="me-2" />
                            Respond
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ReportsDashboard;