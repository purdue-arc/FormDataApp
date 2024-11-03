import React, { useState, useEffect, useMemo } from 'react';
import {
    Search, Filter, Download, Building2, FlaskConical,
    Users, Calendar, PhoneCall, Mail, RefreshCw, AlertCircle, UsersIcon,
    X
} from 'lucide-react';
import result from "../dependentComponents/results";
import './dashboard-styles.css';

function SubmissionModal({ isOpen, onClose, submission, getEntityName, getEntitySize }) {
    if (!isOpen || !submission) return null;

    return (
        <div className="modal-overlay active" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X size={24} />
                </button>

                <h2 className="modal-title">{getEntityName(submission, submission.type)}</h2>

                <div className="modal-details">
                    <div className="modal-section">
                        <h3>Organization Details</h3>
                        <p><strong>Type:</strong> {submission.type.charAt(0).toUpperCase() + submission.type.slice(1)}</p>
                        <p><strong>Size:</strong> {getEntitySize(submission, submission.type)}</p>
                        <p><strong>Participation Type:</strong> {submission.participationType || 'Not Specified'}</p>
                        <p><strong>Number of Representatives:</strong> {submission.numPeople}</p>
                    </div>

                    <div className="modal-section">
                        <h3>Contact Information</h3>
                        <p><strong>Name:</strong> {submission.contactName}</p>
                        <p><strong>Email:</strong> {submission.contactEmail}</p>
                        <p><strong>Phone:</strong> {submission.contactPhoneNumber || 'N/A'}</p>
                    </div>

                    {submission.comments && (
                        <div className="modal-section">
                            <h3>Additional Comments</h3>
                            <p>{submission.comments}</p>
                        </div>
                    )}

                    <div className="modal-section">
                        <h3>Submission Details</h3>
                        <p><strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SubmissionsDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({ labs: [], companies: [], clubs: [] });
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        type: 'all',
        size: 'all',
        participationType: 'all'
    });
    const [sortConfig, setSortConfig] = useState({
        key: 'submittedAt',
        direction: 'desc'
    });
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = async (username, password) => {
        try {
            const credentialsResponse = await result.get('/credentials.json');
            const credentials = credentialsResponse.data;

            if (credentials.user === username && credentials.password === password) {
                localStorage.setItem('secretUsername', username);
                localStorage.setItem('secretPassword', password);
                setIsAuthenticated(true);
            } else {
                alert('Incorrect credentials. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const storedUsername = localStorage.getItem('secretUsername');
            const storedPassword = localStorage.getItem('secretPassword');

            if (storedUsername && storedPassword) {
                try {
                    const credentialsResponse = await result.get('/credentials.json');
                    const credentials = credentialsResponse.data;

                    if (credentials.user === storedUsername && credentials.password === storedPassword) {
                        setIsAuthenticated(true);
                    } else {
                        localStorage.removeItem('secretUsername');
                        localStorage.removeItem('secretPassword');
                    }
                } catch (error) {
                    console.error('Auth check error:', error);
                }
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const [labsResponse, companiesResponse, clubsResponse] = await Promise.all([
                        result.get('/labs.json'),
                        result.get('/companies.json'),
                        result.get('/clubs.json')
                    ]);

                    setData({
                        labs: labsResponse.data ? Object.values(labsResponse.data) : [],
                        companies: companiesResponse.data ? Object.values(companiesResponse.data) : [],
                        clubs: clubsResponse.data ? Object.values(clubsResponse.data) : []
                    });
                } catch (err) {
                    setError('Failed to fetch data. Please try again later.');
                    console.error('Fetch error:', err);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [isAuthenticated]);

    const getEntityName = (item, type) => {
        switch(type) {
            case 'lab': return item.LabName;
            case 'company': return item.companyName;
            case 'club': return item.ClubName;
            default: return '';
        }
    };

    const getEntitySize = (item, type) => {
        switch(type) {
            case 'lab': return item.LabSize;
            case 'company': return item.companySize;
            case 'club': return item.ClubSize;
            default: return '';
        }
    };

    const filteredData = useMemo(() => {
        let combined = [];

        if (filters.type === 'all' || filters.type === 'labs') {
            combined = [...combined, ...data.labs.map(item => ({ ...item, type: 'lab' }))];
        }
        if (filters.type === 'all' || filters.type === 'companies') {
            combined = [...combined, ...data.companies.map(item => ({ ...item, type: 'company' }))];
        }
        if (filters.type === 'all' || filters.type === 'clubs') {
            combined = [...combined, ...data.clubs.map(item => ({ ...item, type: 'club' }))];
        }

        return combined.filter(item => {
            const searchMatch =
                getEntityName(item, item.type)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase());

            const sizeMatch = filters.size === 'all' ||
                getEntitySize(item, item.type) === filters.size;

            const typeMatch = filters.participationType === 'all' ||
                item.participationType?.toLowerCase().includes(filters.participationType.toLowerCase());

            return searchMatch && sizeMatch && typeMatch;
        }).sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (sortConfig.direction === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }, [data, searchTerm, filters, sortConfig]);

    const stats = useMemo(() => ({
        totalSubmissions: filteredData.length,
        totalLabs: data.labs.length,
        totalCompanies: data.companies.length,
        totalClubs: data.clubs.length,
        totalParticipants: filteredData.reduce((acc, item) => acc + parseInt(item.numPeople || 0, 10), 0)
    }), [filteredData, data]);

    const handleCardClick = (submission) => {
        setSelectedSubmission(submission);
        setIsModalOpen(true);
    };

    const handleExportCSV = () => {
        const headers = [
            'Type',
            'Name',
            'Size',
            'Contact Name',
            'Contact Email',
            'Contact Phone',
            'Number of Representatives',
            'Participation Type',
            'Comments',
            'Submitted At'
        ];

        const csvData = filteredData.map(item => [
            item.type,
            getEntityName(item, item.type),
            getEntitySize(item, item.type),
            item.contactName,
            item.contactEmail,
            item.contactPhoneNumber,
            item.numPeople,
            item.participationType,
            item.comments,
            new Date(item.submittedAt).toLocaleString()
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.map(cell => `"${cell || ''}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `rise_submissions_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    if (!isAuthenticated) {
        return (
            <div className="login-container">
                <h1 className="login-title">Login</h1>
                <form
                    className="login-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin(e.target.elements.username.value, e.target.elements.password.value);
                    }}
                >
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">Username:</label>
                        <input type="text" id="username" name="username" className="form-input" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input type="password" id="password" name="password" className="form-input" required />
                    </div>
                    <button type="submit" className="btn">Login</button>
                </form>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="loading-container">
                <RefreshCw className="loading-spinner" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-message">
                <AlertCircle className="error-icon" />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="header-section">
                <h1 className="dashboard-title">RISE Conference Submissions</h1>

                <div className="search-container">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search submissions..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="stats-grid">
                <div className="stats-card">
                    <div className="stats-card-content">
                        <div>
                            <p className="stats-label">Total Submissions</p>
                            <p className="stats-value">{stats.totalSubmissions}</p>
                        </div>
                        <Filter className="icon-base icon-blue" />
                    </div>
                </div>

                <div className="stats-card">
                    <div className="stats-card-content">
                        <div>
                            <p className="stats-label">Labs</p>
                            <p className="stats-value">{stats.totalLabs}</p>
                        </div>
                        <FlaskConical className="icon-base icon-purple" />
                    </div>
                </div>

                <div className="stats-card">
                    <div className="stats-card-content">
                        <div>
                            <p className="stats-label">Companies</p>
                            <p className="stats-value">{stats.totalCompanies}</p>
                        </div>
                        <Building2 className="icon-base icon-green" />
                    </div>
                </div>

                <div className="stats-card">
                    <div className="stats-card-content">
                        <div>
                            <p className="stats-label">Clubs</p>
                            <p className="stats-value">{stats.totalClubs}</p>
                        </div>
                        <UsersIcon className="icon-base icon-orange" />
                    </div>
                </div>
            </div>

            <div className="filters-container">
                <select
                    className="filter-select"
                    value={filters.type}
                    onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
                >
                    <option value="all">All Types</option>
                    <option value="labs">Labs Only</option>
                    <option value="companies">Companies Only</option>
                    <option value="clubs">Clubs Only</option>
                </select>

                <select
                    className="filter-select"
                    value={filters.size}
                    onChange={(e) => setFilters(f => ({ ...f, size: e.target.value }))}
                >
                    <option value="all">All Sizes</option>
                    <option value="micro (<10)">Micro (&lt;10)</option>
                    <option value="small (10-49)">Small (10-49)</option>
                    <option value="medium (100-249)">Medium (100-249)</option>
                    <option value="large (500-999)">Large (500-999)</option>
                    <option value="xlarge (1000+)">XLarge (1000+)</option>
                </select>

                <button
                    className="export-button"
                    onClick={handleExportCSV}
                >
                    <Download className="icon-base" />
                    Export to CSV
                </button>
            </div>

            <div className="submissions-list">
                {filteredData.map((item, index) => (
                    <div
                        key={index}
                        className="submission-card"
                        onClick={() => handleCardClick(item)}
                    >
                        <div className="submission-content">
                            <div className="submission-main">
                                <div className="submission-header">
                                    {item.type === 'lab' && <FlaskConical className="icon-base icon-purple" />}
                                    {item.type === 'company' && <Building2 className="icon-base icon-green" />}
                                    {item.type === 'club' && <UsersIcon className="icon-base icon-orange" />}
                                    <h3 className="submission-title">
                                        {getEntityName(item, item.type).length > 60
                                            ? `${getEntityName(item, item.type).slice(0, 58)}...`
                                            : getEntityName(item, item.type)}
                                    </h3>
                                </div>

                                <div className="submission-details">
                                    <div className="detail-item">
                                        <Users className="detail-icon" />
                                        <span>{getEntitySize(item, item.type)}</span>
                                    </div>

                                    <div className="detail-item">
                                        <Calendar className="detail-icon" />
                                        <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
                                    </div>

                                    <div className="detail-item">
                                        <Mail className="detail-icon" />
                                        <span>{item.contactEmail}</span>
                                    </div>

                                    <div className="detail-item">
                                        <PhoneCall className="detail-icon" />
                                        <span>{item.contactPhoneNumber || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="submission-meta">
                                <span className="badge" title={item.participationType}>
                                    {item.participationType?.slice(0, 20) + (item.participationType?.length > 20 ? '...' : '') || 'Not Specified'}
                                </span>
                                <span className="representatives-count">
                                    {item.numPeople} Representatives
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <SubmissionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                submission={selectedSubmission}
                getEntityName={getEntityName}
                getEntitySize={getEntitySize}
            />
        </div>
    );
}