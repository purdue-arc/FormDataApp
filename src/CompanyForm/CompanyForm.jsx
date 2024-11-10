import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Users, Mail, Phone, MapPin, MessageSquare, UserCheck, Presentation, CheckCircle2 } from 'lucide-react';
import emailjs from "@emailjs/browser";
import result from "../dependentComponents/results";
import '../formStyle.css';
import './CompanyStyle.css';
import SubmissionOverlay from '../SubmissionOverlay/SubmissionOverlay';

class CompanyForm extends React.Component {
  state = {
    companyName: "",
    companySize: "",
    companySizeKey: 0,
    companyAddress: "",
    contactName: "",
    contactEmail: "",
    contactPhoneNumber: "",
    numPeople: "",
    participationType: "",
    comments: "",
    errors: {},
    agreeToTerms: false,
    submissionSuccess: false,
    agreementError: null,
    isLoading: false
  };

  companySizes = [
    { value: "micro (<10)", label: "<10 Employees" },
    { value: "small (10-49)", label: "10-49 Employees" },
    { value: "mediumSmall (50-99)", label: "50-99 Employees" },
    { value: "medium (100-249)", label: "100-249 Employees" },
    { value: "mediumLarge (250-499)", label: "250-499 Employees" },
    { value: "large (500-999)", label: "500-999 Employees" },
    { value: "xlarge (1000+)", label: ">1000 Employees" },
  ];

  participationTypes = [
    { value: "demo", label: "Demo" },
    { value: "presentation", label: "Presentation" },
    { value: "poster", label: "Poster" }
  ];

  validationRules = {
    companyName: { required: true },
    companyAddress: { required: true },
    companySize: { required: true },
    contactName: { required: true },
    contactEmail: {
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    contactPhoneNumber: {},
    numPeople: { required: true },
    participationType: { required: true },
    comments: {}
  };

  // Keep all your existing methods (validateField, handleInputChange, etc.)
  // Just adding the form rendering methods:

  renderFormField = ({ name, label, type = "text", icon: Icon, options = null }) => {
    const error = this.state.errors[name];
    const value = this.state[name];

    return (
        <motion.div
            className="company-form-field"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
          <label className="company-form-label">
            {Icon && <Icon size={16} />}
            {label}
          </label>

          {options ? (
              <select
                  className="company-form-select"
                  value={value}
                  onChange={(e) => this.handleInputChange(name, e)}
              >
                <option value="">Select {label.toLowerCase()}</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                ))}
              </select>
          ) : type === "textarea" ? (
              <textarea
                  className={`company-form-textarea ${error ? 'error' : ''}`}
                  value={value}
                  onChange={(e) => this.handleInputChange(name, e)}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  rows={4}
              />
          ) : (
              <input
                  type={type}
                  className={`company-form-input ${error ? 'error' : ''}`}
                  value={value}
                  onChange={(e) => this.handleInputChange(name, e)}
                  placeholder={`Enter ${label.toLowerCase()}`}
              />
          )}

          {error && <div className="company-form-error">{error}</div>}
        </motion.div>
    );
  };

  render() {
    return (
        <div className="company-page-wrapper">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="company-form-wrapper"
          >
            <div className="company-form-container">
              <div className="company-form-header">
                <div className="company-header-content">
                  <h2 className="company-form-title">RISE Company Sign-Up</h2>
                  <p className="company-form-subtitle">Join us at the upcoming RISE conference</p>
                </div>
                <div className="company-header-decoration"></div>
              </div>

              <form onSubmit={this.postDataHandler} className="company-form-content">
                <div className="company-form-section">
                  <h3 className="company-section-title">Company Details</h3>
                  <div className="company-form-grid">
                    {this.renderFormField({
                      name: "companyName",
                      label: "Company Name",
                      icon: Building2
                    })}
                    {this.renderFormField({
                      name: "companySize",
                      label: "Company Size",
                      icon: Users,
                      options: this.companySizes
                    })}
                  </div>
                </div>

                <div className="company-form-section">
                  <h3 className="company-section-title">Contact Information</h3>
                  <div className="company-form-grid">
                    {this.renderFormField({
                      name: "contactName",
                      label: "Contact Name",
                      icon: UserCheck
                    })}
                    {this.renderFormField({
                      name: "contactEmail",
                      label: "Contact Email",
                      type: "email",
                      icon: Mail
                    })}
                    {this.renderFormField({
                      name: "contactPhoneNumber",
                      label: "Contact Phone",
                      type: "tel",
                      icon: Phone
                    })}
                  </div>
                </div>

                <div className="company-form-section">
                  <h3 className="company-section-title">Participation Details</h3>
                  <div className="company-form-grid">
                    {this.renderFormField({
                      name: "numPeople",
                      label: "Number of Representatives",
                      type: "number",
                      icon: Users
                    })}
                    {this.renderFormField({
                      name: "participationType",
                      label: "Participation Type",
                      icon: Presentation,
                      options: this.participationTypes
                    })}
                  </div>
                </div>

                <div className="company-form-section">
                  <h3 className="company-section-title">Additional Information</h3>
                  <div className="company-form-grid-full">
                    {this.renderFormField({
                      name: "companyAddress",
                      label: "Company Address",
                      type: "textarea",
                      icon: MapPin
                    })}
                    {this.renderFormField({
                      name: "comments",
                      label: "Additional Comments",
                      type: "textarea",
                      icon: MessageSquare
                    })}
                  </div>
                </div>

                <div className="company-form-section">
                  <div className="company-form-checkbox-wrapper">
                    <div className="checkbox-container">
                      <input
                          type="checkbox"
                          id="agreement"
                          className="company-form-checkbox"
                          checked={this.state.agreeToTerms}
                          onChange={(e) => this.setState({ agreeToTerms: e.target.checked })}
                      />
                      <label htmlFor="agreement" className="checkbox-label">
                        I confirm our company's commitment to participate in the RISE conference
                      </label>
                    </div>
                  </div>
                  <AnimatePresence>
                    {this.state.agreementError && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="company-form-error"
                        >
                          {this.state.agreementError}
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                    type="submit"
                    className={`company-form-submit ${this.state.isLoading ? 'loading' : ''}`}
                    disabled={this.state.isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                  {this.state.isLoading ? (
                      <span className="loading-text">
                    <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="loading-icon"
                    >
                      ⭮
                    </motion.span>
                    Submitting...
                  </span>
                  ) : (
                      "Submit Application"
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
          {this.state.submissionSuccess && <SubmissionOverlay />}
        </div>
    );
  }
}

export default CompanyForm;