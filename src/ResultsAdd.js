import emailjs from "@emailjs/browser";
import { EmailJSResponseStatus } from "@emailjs/browser/es";
import { default as React, useRef } from "react";
import Select from "react-select";
import result from "./dependentComponents/results";
import "./style.css";

class ResultsAdd extends React.Component {
  state = {
    name: "",
    companyName: "",
    stateLocation: "",
    cityLocation: "",
    companySize: "",
    contactEmail: "",
    phoneNumber: "",
    numPeople: "",
    presentationType: "",
    comments: "",
    errors: {},
    agreeToTerms: false,
  };
  states = [
    { value: "Alabama", label: "Alabama" },
    { value: "Alaska", label: "Alaska" },
    { value: "Arizona", label: "Arizona" },
    { value: "Arkansas", label: "Arkansas" },
    { value: "California", label: "California" },
    { value: "Colorado", label: "Colorado" },
    { value: "Connecticut", label: "Connecticut" },
    { value: "Delaware", label: "Delaware" },
    { value: "Florida", label: "Florida" },
    { value: "Georgia", label: "Georgia" },
    { value: "Hawaii", label: "Hawaii" },
    { value: "Idaho", label: "Idaho" },
    { value: "Illinois", label: "Illinois" },
    { value: "Indiana", label: "Indiana" },
    { value: "Iowa", label: "Iowa" },
    { value: "Kansas", label: "Kansas" },
    { value: "Kentucky", label: "Kentucky" },
    { value: "Louisiana", label: "Louisiana" },
    { value: "Maine", label: "Maine" },
    { value: "Maryland", label: "Maryland" },
    { value: "Massachusetts", label: "Massachusetts" },
    { value: "Michigan", label: "Michigan" },
    { value: "Minnesota", label: "Minnesota" },
    { value: "Mississippi", label: "Mississippi" },
    { value: "Missouri", label: "Missouri" },
    { value: "Montana", label: "Montana" },
    { value: "Nebraska", label: "Nebraska" },
    { value: "Nevada", label: "Nevada" },
    { value: "New Hampshire", label: "New Hampshire" },
    { value: "New Jersey", label: "New Jersey" },
    { value: "New Mexico", label: "New Mexico" },
    { value: "New York", label: "New York" },
    { value: "North Carolina", label: "North Carolina" },
    { value: "North Dakota", label: "North Dakota" },
    { value: "Ohio", label: "Ohio" },
    { value: "Oklahoma", label: "Oklahoma" },
    { value: "Oregon", label: "Oregon" },
    { value: "Pennsylvania", label: "Pennsylvania" },
    { value: "Rhode Island", label: "Rhode Island" },
    { value: "South Carolina", label: "South Carolina" },
    { value: "South Dakota", label: "South Dakota" },
    { value: "Tennessee", label: "Tennessee" },
    { value: "Texas", label: "Texas" },
    { value: "Utah", label: "Utah" },
    { value: "Vermont", label: "Vermont" },
    { value: "Virginia", label: "Virginia" },
    { value: "Washington", label: "Washington" },
    { value: "West Virginia", label: "West Virginia" },
    { value: "Wisconsin", label: "Wisconsin" },
    { value: "Wyoming", label: "Wyoming" },
  ];

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
    states: this.states,
    companySizes: this.companySizes,
  };

  validationRules = {
    name: {
      required: true,
    },
    companyName: {
      required: true,
    },
    stateLocation: {
      required: true,
    },
    cityLocation: {
      required: true,
    },
    contactEmail: {
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    phoneNumber: {
      // Can add phone number validation
    },
    companySize: {
      required: true,
    },
    numPeople: {
      required: true,
    },
    presentationType: {
      required: true,
    },
    comments: {
      // Add validation rules for comments if needed
    },
  };

  validateField = (fieldName) => {
    const value = this.state[fieldName];
    const rules = this.validationRules[fieldName];

    if (rules.required && value.trim() === "") {
      return `${fieldName} is required`;
    }

    return null;
  };

  handleInputChange = (fieldName, event) => {
    this.setState({ [fieldName]: event.target.value });
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
      name: this.state.name,
      companyName: this.state.companyName,
      stateLocation: this.state.stateLocation,
      cityLocation: this.state.cityLocation,
      companySize: this.state.companySize,
      contactEmail: this.state.contactEmail,
      phoneNumber: this.state.phoneNumber,
      numPeople: this.state.numPeople,
      presentationType: this.state.presentationType,
      comments: this.state.comments,
      submittedAt: currentDateTime.toISOString(),
      submittedUnixTime: currentDateTime.getTime(),
    };
  };
  postDataHandler = async (e) => {
    e.preventDefault();

    const errors = this.validateAllFields();
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      this.setState({ errors });
    } else {
      const Data = this.collectFormData();

      try {
        const response = await result.post(`/marks.json`, Data);
        if (response.status === 200) {
          console.log("Success:", response.data);
        }
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
    return (
      <div className="field">
        <label>{label}</label>
        <Select
          options={this.options[options]}
          placeholder={placeholder}
          onChange={(selectedOption) =>
            this.handleSelectChange(fieldName, selectedOption)
          }
        />
      </div>
    );
  };

  renderInputField = (type, fieldName, label, placeholder) => {
    const error = this.state.errors[fieldName];
    const isFocused = this.state.focusedField === fieldName;

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
          {!isFocused && error && (
            <p className="error" style={{ color: "red" }}>
              {placeholder + " is required!"}
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
            <h3>RISE Organization Sign-Up Form</h3>
            <form className="ui form" onSubmit={this.postDataHandler}>
              {this.renderInputField("text", "name", "Name:", "Name", require)}
              {this.renderInputField(
                "text",
                "companyName",
                "Company Name:",
                "Company Name",
                require
              )}
              {this.renderMultiSelect(
                "stateLocation",
                "states",
                "State:",
                "State",
                require
              )}
              {this.renderInputField(
                "text",
                "cityLocation",
                "City:",
                "City",
                require
              )}
              {this.renderInputField(
                "email",
                "contactEmail",
                "Email:",
                "Email",
                require
              )}
              {this.renderInputField(
                "text",
                "phoneNumber",
                "Phone Number:",
                "Phone Number (Optional)"
              )}
              {this.renderMultiSelect(
                "companySize",
                "companySizes",
                "Company Size:",
                "Company Size",
                require
              )}
              {this.renderInputField(
                "text",
                "numPeople",
                "Number of People Attending RISE:",
                "Number of People",
                require
              )}
              {this.renderInputField(
                "text",
                "presentationType",
                "Presentation Type:",
                "Demo/Presentation/Poster",
                require
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
              <div className="field"></div>
              <button className="ui blue submit button">Submit</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ResultsAdd;
