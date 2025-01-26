import React from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {
  Building2,
  Users,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  UserCheck,
  Presentation,
  CheckCircle2
} from 'lucide-react';
import emailjs from "@emailjs/browser";
import result from "../dependentComponents/results"
import './ClubStyle.css';

class ClubForm extends React.Component {
  state = {
    ClubName: "",
    ClubSize: "",
    ClubSizeKey: 0,
    ClubAddress: "",
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

  ClubSizes = [
    { value: "micro (<10)", label: "<10 Club Members" },
    { value: "small (10-49)", label: "10-49 Club Members" },
    { value: "mediumSmall (50-99)", label: "50-99 Club Members" },
    { value: "medium (100-249)", label: "100-249 Club Members" },
    { value: "mediumLarge (250-499)", label: "250-499 Club Members" },
    { value: "large (500-999)", label: "500-999 Club Members" },
    { value: "xlarge (1000+)", label: ">1000 Club Members" },
  ];

  participationTypes = [
    { value: "demo", label: "Demo" },
    { value: "presentation", label: "Presentation" },
    { value: "poster", label: "Poster" }
  ];

  validationRules = {
    ClubName: { required: true },
    ClubAddress: { required: true },
    ClubSize: { required: true },
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

  field_to_name = {
    ClubName: "Club Name",
    ClubSize: "Club Size",
    ClubAddress: "Club Address",
    contactName: "Contact Name",
    contactEmail: "Contact Email",
    contactPhoneNumber: "Contact Phone",
    numPeople: "Number of People",
    participationType: "Participation Type",
    comments: "Comments"
  };

  validateField = (fieldName, value = this.state[fieldName]) => {
    const rules = this.validationRules[fieldName];

    if (rules.required && (!value || value.trim() === "")) {
      return `"${this.field_to_name[fieldName]}" is required`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return `Please enter a valid ${fieldName}`;
    }

    return null;
  };

  handleInputChange = (fieldName, event) => {
    const value = event.target.value;
    this.setState((prevState) => {
      const updatedErrors = { ...prevState.errors };
      const fieldError = this.validateField(fieldName, value);

      if (fieldError) {
        updatedErrors[fieldName] = fieldError;
      } else {
        delete updatedErrors[fieldName];
      }

      return {
        [fieldName]: value,
        errors: updatedErrors,
      };
    });
  };

  validateAllFields = () => {
    const errors = {};
    Object.keys(this.validationRules).forEach((fieldName) => {
      const error = this.validateField(fieldName);
      if (error) {
        errors[fieldName] = error;
      }
    });
    return errors;
  };

  resetForm = () => {
    this.setState({
      ClubName: "",
      ClubSize: "",
      ClubAddress: "",
      contactName: "",
      contactEmail: "",
      contactPhoneNumber: "",
      numPeople: "",
      participationType: "",
      comments: "",
      errors: {},
      agreeToTerms: false,
      submissionSuccess: true,
      ClubSizeKey: this.state.ClubSizeKey + 1,
    });
  };

  postDataHandler = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true, submissionSuccess: false, agreementError: null });

    // Validate agreement
    if (!this.state.agreeToTerms) {
      this.setState({
        agreementError: "You must agree to the terms to proceed.",
        isLoading: false
      });
      return;
    }

    // Validate all fields
    const errors = this.validateAllFields();
    if (Object.keys(errors).length > 0) {
      this.setState({ errors, isLoading: false });
      return;
    }

    try {
      // Send email notification
      await emailjs.send(
          "service_qihbyx6",
          "template_a5focee",
          {
            to_name: this.state.ClubName,
          },
          "EaeoNuUi1ZMFCIeI9"
      );

      // Submit form data
      const response = await result.post('/clubs.json', {
        ...this.state,
        submittedAt: new Date().toISOString()
      });

      if (response.status === 200) {
        this.setState({ submissionSuccess: true });
        setTimeout(this.resetForm, 1000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      this.setState({
        errors: { ...this.state.errors, submit: "Failed to submit form. Please try again." }
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  renderFormField = ({ name, label, type = "text", icon: Icon, options = null }) => {
    const error = this.state.errors[name];
    const value = this.state[name];

    return (
        <motion.div
            className="club-form-field"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
          <label className="club-form-label">
            {Icon && <Icon size={16} />}
            {label}
          </label>

          {options ? (
              <select
                  className="club-form-select"
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
                  className={`club-form-textarea ${error ? 'error' : ''}`}
                  value={value}
                  onChange={(e) => this.handleInputChange(name, e)}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  rows={4}
              />
          ) : (
              <input
                  type={type}
                  className={`club-form-input ${error ? 'error' : ''}`}
                  value={value}
                  onChange={(e) => this.handleInputChange(name, e)}
                  placeholder={`Enter ${label.toLowerCase()}`}
              />
          )}

          {error && <div className="club-form-error">{error}</div>}
        </motion.div>
    );
  };

  render() {
    return (
        <div className="club-page-wrapper">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="club-form-wrapper"
          >
            <div className="club-form-container">
              {/* Form Header */}
              <div className="club-form-header">
                <div className="club-header-content">
                  <h2 className="club-form-title">RISE Purdue Club Sign-Up</h2>
                  <p className="club-form-subtitle">Join us at the upcoming RISE conference</p>
                </div>
                <div className="club-header-decoration"></div>
              </div>

              {/* Main Form */}
              <form onSubmit={this.postDataHandler} className="club-form-content">
                {/* Club Information Section */}
                <div className="club-form-section">
                  <h3 className="club-section-title">Club Details</h3>
                  <div className="club-form-grid">
                    {this.renderFormField({
                      name: "ClubName",
                      label: "Club Name",
                      icon: Building2
                    })}
                    {this.renderFormField({
                      name: "ClubSize",
                      label: "Club Size",
                      icon: Users,
                      options: this.ClubSizes
                    })}
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="club-form-section">
                  <h3 className="club-section-title">Contact Information</h3>
                  <div className="club-form-grid">
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

                {/* Participation Details Section */}
                <div className="club-form-section">
                  <h3 className="club-section-title">Participation Details</h3>
                  <div className="club-form-grid">
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

                {/* Address and Comments Section */}
                <div className="club-form-section">
                  <h3 className="club-section-title">Additional Information</h3>
                  <div className="club-form-grid-full">
                    {this.renderFormField({
                      name: "ClubAddress",
                      label: "Club Address",
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

                {/* Agreement Section */}
                <div className="club-form-section">
                  <div className="club-form-checkbox-wrapper">
                    <div className="checkbox-container">
                      <input
                          type="checkbox"
                          id="agreement"
                          className="club-form-checkbox"
                          checked={this.state.agreeToTerms}
                          onChange={(e) => this.setState({ agreeToTerms: e.target.checked })}
                      />
                      <label htmlFor="agreement" className="checkbox-label">
                        I confirm our club's commitment to participate in the RISE conference
                      </label>
                    </div>
                  </div>
                  <AnimatePresence>
                    {this.state.agreementError && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="club-form-error"
                        >
                          {this.state.agreementError}
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <div className="club-form-submit-wrapper">
                  <motion.button
                      type="submit"
                      className={`club-form-submit ${this.state.isLoading ? 'loading' : ''}`}
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
                </div>
              </form>

              {/* Success Message */}
              <AnimatePresence>
                {this.state.submissionSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="club-form-success"
                    >
                      <CheckCircle2 className="success-icon" />
                      <span>Form submitted successfully! Thank you for registering.</span>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
    );
  }
}

export default ClubForm;