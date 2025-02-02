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
import './CompanyStyle.css';
import FileUploadComponent from "../ContentUpload";

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

  field_to_name = {
    companyName: "Company Name",
    companySize: "Company Size",
    companyAddress: "Company Address",
    contactName: "Contact Name",
    contactEmail: "Contact Email",
    contactPhoneNumber: "Contact Phone",
    numPeople: "Number of Representatives",
    participationType: "Participation Type",
    comments: "Comments"
  };

  validateField = (fieldName, value = this.state[fieldName]) => {
    const rules = this.validationRules[fieldName];

    if (rules.required && (!value || value.trim() === "")) {
      return `${this.field_to_name[fieldName]} is required`;
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
      companyName: "",
      companySize: "",
      companyAddress: "",
      contactName: "",
      contactEmail: "",
      contactPhoneNumber: "",
      numPeople: "",
      participationType: "",
      comments: "",
      errors: {},
      agreeToTerms: false,
      submissionSuccess: true,
      companySizeKey: this.state.companySizeKey + 1,
    });
  };

  postDataHandler = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true, submissionSuccess: false, agreementError: null });

    if (!this.state.agreeToTerms) {
      this.setState({
        agreementError: "You must agree to the terms to proceed.",
        isLoading: false
      });
      return;
    }

    const errors = this.validateAllFields();
    if (Object.keys(errors).length > 0) {
      this.setState({ errors, isLoading: false });
      return;
    }

    try {
      await emailjs.send(
          "service_qihbyx6",
          "template_a5focee",
          {
            to_name: this.state.companyName,
          },
          "EaeoNuUi1ZMFCIeI9"
      );

      const response = await result.post('/companies.json', {
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
    const isRequired = this.validationRules[name].required;

    return (
        <motion.div
            className="company-form-field"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
          <label htmlFor={name} className="company-form-label">
            {Icon && <Icon size={16} />}
            {label} {isRequired && <span className="text-red-500">*</span>}
          </label>

          {options ? (
              <select
                  id={name}
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
                  id={name}
                  className={`company-form-textarea ${error ? 'error' : ''}`}
                  value={value}
                  onChange={(e) => this.handleInputChange(name, e)}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  rows={4}
              />
          ) : (
              <input
                  id={name}
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
                          onChange={(e) => this.setState({agreeToTerms: e.target.checked})}
                      />
                      <label htmlFor="agreement" className="checkbox-label">
                        I confirm our company's commitment to participate in the RISE conference
                      </label>
                    </div>
                  </div>
                  <AnimatePresence>
                    {this.state.agreementError && (
                        <motion.div
                            initial={{opacity: 0, height: 0}}
                            animate={{opacity: 1, height: "auto"}}
                            exit={{opacity: 0, height: 0}}
                            className="company-form-error"
                        >
                          {this.state.agreementError}
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="company-form-section">
                  <h3 className="company-section-title">Upload Content</h3>
                  <FileUploadComponent/>
                </div>

                <div className="company-form-submit-wrapper">
                  <motion.button
                      type="submit"
                      className={`company-form-submit ${this.state.isLoading ? 'loading' : ''}`}
                      disabled={this.state.isLoading}
                      whileHover={{scale: 1.02}}
                      whileTap={{scale: 0.98}}
                  >
                    {this.state.isLoading ? (
                        <span className="loading-text">
                      <motion.span
                          animate={{rotate: 360}}
                          transition={{duration: 1, repeat: Infinity, ease: "linear"}}
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

              <AnimatePresence>
                {this.state.submissionSuccess && (
                    <motion.div
                        initial={{opacity: 0, scale: 0.9}}
                        animate={{opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="company-form-success"
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

export default CompanyForm;