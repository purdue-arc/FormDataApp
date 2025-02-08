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
  CheckCircle2,
  // Remove `UniversityIcon` import if you still want to use it,
  // but we keep it here for the icon label.
  University as UniversityIcon
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
    participationType: [], // modified from "" to an empty array
    comments: "",
    errors: {},
    agreeToTerms: false,
    submissionSuccess: false,
    agreementError: null,
    isLoading: false,

    // NEW: For handling the university autocomplete
    University: "",
    universitySuggestions: [],
    showUniversitySuggestions: false,
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
    University: { required: true },
    ClubSize: { required: true },
    contactName: { required: true },
    contactEmail: {
      required: true,
      pattern: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,4}$/,
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
    numPeople: "Number of Representatives",
    participationType: "Participation Type",
    comments: "Comments",
    University: "University",
  };

  validateField = (fieldName, value = this.state[fieldName]) => {
    const rules = this.validationRules[fieldName];

    // Special handling for participationType since it is now an array.
    if (fieldName === "participationType") {
      if (rules.required && (!value || value.length === 0)) {
        return `${this.field_to_name[fieldName]} is required.`;
      }
      return null;
    }

    if (rules.required && (!value || value.trim() === "")) {
      return `${this.field_to_name[fieldName]} is required.`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return `Please enter a valid ${this.field_to_name[fieldName].toLowerCase()}.`;
    }

    return null;
  };

  // General input change handler for standard fields
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

  // Autocomplete-specific change handler for University
  handleUniversityChange = (event) => {
    const value = event.target.value;
    // Re-use the validation logic for consistent error handling
    this.handleInputChange("University", event);

    // Fetch suggestions if at least 3 characters typed; you can tweak the threshold
    if (value.length >= 3) {
      fetch(`http://universities.hipolabs.com/search?name=${encodeURIComponent(value)}`)
          .then((res) => res.json())
          .then((data) => {
            // The API returns an array of objects, each with a "name" field
            const suggestions = data.map((uni) => uni.name);
            this.setState({
              universitySuggestions: suggestions,
              showUniversitySuggestions: true,
            });
          })
          .catch((error) => {
            console.error("Error fetching university suggestions:", error);
          });
    } else {
      // Hide suggestions if input is too short
      this.setState({
        universitySuggestions: [],
        showUniversitySuggestions: false,
      });
    }
  };

  // When a user clicks on a suggestion
  handleUniversitySuggestionClick = (suggestion) => {
    // Set the field value to the selected suggestion
    this.setState((prevState) => {
      const updatedErrors = { ...prevState.errors };
      const fieldError = this.validateField("University", suggestion);

      if (fieldError) {
        updatedErrors["University"] = fieldError;
      } else {
        delete updatedErrors["University"];
      }

      return {
        University: suggestion,
        errors: updatedErrors,
        showUniversitySuggestions: false,
      };
    });
  };

  // New handler for the participationType checkboxes.
  handleParticipationTypeChange = (value, event) => {
    const checked = event.target.checked;
    this.setState(prevState => {
      let newParticipationTypes = [...prevState.participationType];
      if (checked) {
        if (!newParticipationTypes.includes(value)) {
          newParticipationTypes.push(value);
        }
      } else {
        newParticipationTypes = newParticipationTypes.filter(item => item !== value);
      }
      const updatedErrors = { ...prevState.errors };
      const error = this.validateField("participationType", newParticipationTypes);
      if (error) {
        updatedErrors["participationType"] = error;
      } else {
        delete updatedErrors["participationType"];
      }
      return {
        participationType: newParticipationTypes,
        errors: updatedErrors
      };
    });
  };

  // Validate all fields at once
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
      University: "",
      ClubAddress: "",
      contactName: "",
      contactEmail: "",
      contactPhoneNumber: "",
      numPeople: "",
      participationType: [], // reset as an empty array
      comments: "",
      errors: {},
      agreeToTerms: false,
      submissionSuccess: true,
      ClubSizeKey: this.state.ClubSizeKey + 1,
      // Reset autocomplete state
      universitySuggestions: [],
      showUniversitySuggestions: false,
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
      // Send email notification (just an example)
      await emailjs.send(
          "service_qihbyx6",
          "template_a5focee",
          {
            to_name: this.state.ClubName,
          },
          "EaeoNuUi1ZMFCIeI9"
      );

      // Modify the data for firebase: convert participationType from an array to a comma‐separated string.
      const { participationType, ...otherState } = this.state;
      const submissionData = {
        ...otherState,
        participationType: participationType.join(', '),
        submittedAt: new Date().toISOString()
      };

      // Submit form data to your backend
      const response = await result.post('/clubs.json', submissionData);

      if (response.status === 200) {
        this.setState({ submissionSuccess: true });
        // Reset form after a short delay
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

  // Renders an input, select, or textarea for most fields
  renderFormField = ({ name, label, type = "text", icon: Icon, options = null }) => {
    const error = this.state.errors[name];
    const value = this.state[name];
    const isRequired = this.validationRules[name].required;

    // Custom rendering for the participationType field as a group of modern checkboxes.
    if (name === "participationType") {
      return (
          <motion.div
              className="club-form-field"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
          >
            <label htmlFor={name} className="club-form-label">
              {Icon && <Icon size={16} />}
              {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <div className="club-form-checkbox-group">
              {this.participationTypes.map(opt => (
                  <div key={opt.value} className="checkbox-container">
                    <input
                        type="checkbox"
                        id={`participationType-${opt.value}`}
                        className="club-form-checkbox"
                        value={opt.value}
                        checked={this.state.participationType.includes(opt.value)}
                        onChange={(e) => this.handleParticipationTypeChange(opt.value, e)}
                    />
                    <label htmlFor={`participationType-${opt.value}`} className="checkbox-label">
                      {opt.label}
                    </label>
                  </div>
              ))}
            </div>
            {error && <div className="club-form-error">{error}</div>}
          </motion.div>
      );
    }

    return (
        <motion.div
            className="club-form-field"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
          <label htmlFor={name} className="club-form-label">
            {Icon && <Icon size={16} />}
            {label} {isRequired && <span className="text-red-500">*</span>}
          </label>

          {options ? (
              <select
                  id={name}
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
                  id={name}
                  className={`club-form-textarea ${error ? 'error' : ''}`}
                  value={value}
                  onChange={(e) => this.handleInputChange(name, e)}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  rows={4}
              />
          ) : (
              <input
                  id={name}
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

  // Specialized autocomplete field for "University"
  renderUniversityField = () => {
    const { University, errors, universitySuggestions, showUniversitySuggestions } = this.state;
    const error = errors.University;

    return (
        <motion.div
            className="club-form-field"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: "relative" }} // so the dropdown can position correctly
        >
          <label htmlFor={"University"} className="club-form-label">
            <UniversityIcon size={16} />
            University
            <span className="text-red-500">*</span>
          </label>

          <input
              id={"University"}
              type="text"
              className={`club-form-input ${error ? 'error' : ''}`}
              value={University}
              onChange={this.handleUniversityChange}
              placeholder="Start typing your university..."
              // If you want to close suggestions on blur, you can do:
              onBlur={() => {
                // Delay hiding suggestions to allow click on item
                setTimeout(() => {
                  this.setState({ showUniversitySuggestions: false });
                }, 200);
              }}
          />

          {showUniversitySuggestions && universitySuggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {universitySuggestions.map((suggestion, index) => (
                    <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => this.handleUniversitySuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </div>
                ))}
              </div>
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

                    {/* Replace the old select code with the new University autocomplete */}
                    {this.renderUniversityField()}
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
