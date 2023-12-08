import emailjs from "@emailjs/browser";
import { EmailJSResponseStatus } from "@emailjs/browser/es";
import { default as React, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import result from "../dependentComponents/results";
import "../formStyle.css";
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

  options = {
    companySizes: this.companySizes,
  };

  validationRules = {
    companyName: {
      required: true,
    },
    companyAddress: {
      required: true,
    },
    companySize: {
      required: true,
    },
    contactName: {
      required: true,
    },
    contactEmail: {
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    contactPhoneNumber: {
      // Can add phone number validation
    },
    numPeople: {
      required: true,
    },
    participationType: {
      required: true,
    },
    comments: {
      // Add validation rules for comments if needed
    },
  };

  fieldNames = {
    companyName: "Company Name",
    companySize: "Company Size",
    companyAddress: "Company Address",
    contactName: "Contact Name",
    contactEmail: "Contact Email",
    contactPhoneNumber: "Contact Phone Number",
    numPeople: "Number of Company Representatives at RISE",
    participationType: "Participation Type",
    comments: "Comments",
  };

  validateField = (fieldName) => {
    const value = this.state[fieldName];
    const rules = this.validationRules[fieldName];

    const readableName = this.fieldNames[fieldName] || fieldName;

    if (rules.required && value.trim() === "") {
      return `${readableName} is required`;
    }

    return null;
  };

  handleInputChange = (fieldName, event) => {
    const newValue = event.target.value;
    this.setState((prevState) => {
      const updatedErrors = { ...prevState.errors };
      const fieldError = this.validateField(fieldName, newValue);

      if (!fieldError) {
        delete updatedErrors[fieldName];
      }

      return {
        [fieldName]: newValue,
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

  collectFormData = () => {
    const currentDateTime = new Date();
    return {
      companyName: this.state.companyName,
      companySize: this.state.companySize,
      contactName: this.state.contactName,
      contactEmail: this.state.contactEmail,
      contactPhoneNumber: this.state.contactPhoneNumber,
      numPeople: this.state.numPeople,
      participationType: this.state.participationType,
      comments: this.state.comments,
      submittedAt: currentDateTime.toISOString(),
      submittedUnixTime: currentDateTime.getTime(),
    };
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
    emailjs.send("service_qihbyx6","template_a5focee",{
      to_name: this.state.companyName,
      }, "EaeoNuUi1ZMFCIeI9");
    this.setState({ submissionSuccess: false, agreementError: null });

    const errors = this.validateAllFields();
    const hasErrors = Object.keys(errors).length > 0;
    const agreementError = !this.state.agreeToTerms
      ? "You must agree to the terms to proceed."
      : null;

    if (hasErrors) {
      this.setState({ errors });
    } else if (agreementError) {
      this.setState({ agreementError });
    } else if(!this.state.submissionSuccess){
      const Data = this.collectFormData();

      try {
        const response = await result.post(`/companies.json`, Data);
        if (response.status === 200) {
          console.log("Success:", response.data);
          setTimeout(() => {
            this.resetForm();
          }, 1000);
        }
        this.resetForm();
        this.setState({ submissionSuccess: true });
      } catch (error) {
        console.error("There was an error saving the form data:", error);

        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
      }
    }
  };

  handleSelectChange = (fieldName, selectedOption) => {
    this.setState({ [fieldName]: selectedOption.value });
  };
  renderMultiSelect = (fieldName, options, label, placeholder) => {
    const error = this.state.errors[fieldName];
    const customStyles = {
      control: (base) => ({
        ...base,
        fontSize: "12px",
        fontFamily: "Arial",
      }),
      option: (base) => ({
        ...base,
        fontSize: "12px",
        fontFamily: "Arial",
      }),
    };

    return (
      <div className="field">
        <label>{label}</label>
        <Select
          options={this.options[options]}
          placeholder={placeholder}
          onChange={(selectedOption) =>
            this.handleSelectChange(fieldName, selectedOption)
          }
          styles={customStyles}
        />
        {error && (
          <p className="error" style={{ color: "red" }}>
            {error}
          </p>
        )}
      </div>
    );
  };

  renderInputField = (type, fieldName, label, placeholder) => {
    const error = this.state.errors[fieldName];

    return (
      <div className="field">
        <label>{label}</label>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <input
            type={type}
            placeholder={placeholder}
            value={this.state[fieldName]}
            onChange={(e) => this.handleInputChange(fieldName, e)}
          />
          {error && (
            <p className="error" style={{ color: "red" }}>
              {error}
            </p>
          )}
        </div>
      </div>
    );
  };

  handleCheckboxChange = (event) => {
    this.setState({ agreeToTerms: event.target.checked });
  };

  render() {
    return (
      <div className="ui placeholder segment">
        <div className="ui one column very relaxed stackable grid">
          <div className="column">
            <h3>RISE Company Sign-Up Form</h3>
            <form className="ui form" onSubmit={this.postDataHandler}>
              {this.renderInputField(
                "text",
                "companyName",
                "Company Name:",
                "Company Name"
              )}
              <div className="field" key={this.state.companySizeKey}>
                {this.renderMultiSelect(
                  "companySize",
                  "companySizes",
                  "Company Size:",
                  "Select Company Size"
                )}
              </div>
              {this.renderInputField(
                "text",
                "companyAddress",
                "Company Address:",
                "Company Address"
              )}
              {this.renderInputField(
                "text",
                "contactName",
                "Contact Name:",
                "Contact Name"
              )}
              {this.renderInputField(
                "email",
                "contactEmail",
                "Contact Email:",
                "Contact Email"
              )}
              {this.renderInputField(
                "text",
                "contactPhoneNumber",
                "Contact Phone Number:",
                "Contact Phone Number (Optional)"
              )}
              {this.renderInputField(
                "text",
                "numPeople",
                "Number of Company Representatives at RISE:",
                "Number of Representatives"
              )}
              {this.renderInputField(
                "text",
                "participationType",
                "Participation Type:",
                "Demo/Presentation/Poster"
              )}
              {this.renderInputField(
                "text",
                "comments",
                "Additional Comments:",
                "Additional Comments"
              )}

              <div className="field">
                <div className="checkbox-wrapper">
                  <div className="ui checkbox">
                    <input
                      type="checkbox"
                      checked={this.state.agreeToTerms}
                      onChange={this.handleCheckboxChange}
                    />
                  </div>
                  <div className="agreement-statement">
                    By checking this box, you are confirming your company's
                    commitment to participate in the RISE conference.
                  </div>
                </div>
              </div>

              <div className="field">
                <button className="ui blue submit button" type="submit">
                  Submit
                </button>
              </div>

              <div className="field">
                {this.state.agreementError && (
                  <p className="error" style={{ color: "red" }}>
                    {this.state.agreementError}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
        {this.state.submissionSuccess && <SubmissionOverlay />}
      </div>
    );
  }
}

export default CompanyForm;
