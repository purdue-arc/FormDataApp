import React from "react";
import result from './results'
import './style.css'
import Select from "react-select";

class ResultsAdd extends React.Component{

    state = {
        name:'',
        companyName:'',
        stateLocation: '',
        cityLocation: '',
        companySize: '',
        contactEmail: '',
        phoneNumber: '',
        numPeople: '',
        presentationType: '',
        comments: ''
    }
    states = [
        { value: 'AL', label: 'Alabama' },
        { value: 'AK', label: 'Alaska' },
        { value: 'AZ', label: 'Arizona' },
        { value: 'AR', label: 'Arkansas' },
        { value: 'CA', label: 'California' },
        { value: 'CO', label: 'Colorado' },
        { value: 'CT', label: 'Connecticut' },
        { value: 'DE', label: 'Delaware' },
        { value: 'FL', label: 'Florida' },
        { value: 'GA', label: 'Georgia' },
        { value: 'HI', label: 'Hawaii' },
        { value: 'ID', label: 'Idaho' },
        { value: 'IL', label: 'Illinois' },
        { value: 'IN', label: 'Indiana' },
        { value: 'IA', label: 'Iowa' },
        { value: 'KS', label: 'Kansas' },
        { value: 'KY', label: 'Kentucky' },
        { value: 'LA', label: 'Louisiana' },
        { value: 'ME', label: 'Maine' },
        { value: 'MD', label: 'Maryland' },
        { value: 'MA', label: 'Massachusetts' },
        { value: 'MI', label: 'Michigan' },
        { value: 'MN', label: 'Minnesota' },
        { value: 'MS', label: 'Mississippi' },
        { value: 'MO', label: 'Missouri' },
        { value: 'MT', label: 'Montana' },
        { value: 'NE', label: 'Nebraska' },
        { value: 'NV', label: 'Nevada' },
        { value: 'NH', label: 'New Hampshire' },
        { value: 'NJ', label: 'New Jersey' },
        { value: 'NM', label: 'New Mexico' },
        { value: 'NY', label: 'New York' },
        { value: 'NC', label: 'North Carolina' },
        { value: 'ND', label: 'North Dakota' },
        { value: 'OH', label: 'Ohio' },
        { value: 'OK', label: 'Oklahoma' },
        { value: 'OR', label: 'Oregon' },
        { value: 'PA', label: 'Pennsylvania' },
        { value: 'RI', label: 'Rhode Island' },
        { value: 'SC', label: 'South Carolina' },
        { value: 'SD', label: 'South Dakota' },
        { value: 'TN', label: 'Tennessee' },
        { value: 'TX', label: 'Texas' },
        { value: 'UT', label: 'Utah' },
        { value: 'VT', label: 'Vermont' },
        { value: 'VA', label: 'Virginia' },
        { value: 'WA', label: 'Washington' },
        { value: 'WV', label: 'West Virginia' },
        { value: 'WI', label: 'Wisconsin' },
        { value: 'WY', label: 'Wyoming' }
    ];

    companySizes = [
        { value: 'micro (<10)', label: '<10 Employees' },
        { value: 'small (10-49)', label: '10-49 Employees' },
        { value: 'mediumSmall (50-99)', label: '50-99 Employees' },
        { value: 'medium (100-249)', label: '100-249 Employees' },
        { value: 'mediumLarge (250-499)', label: '250-499 Employees' },
        { value: 'large (500-999)', label: '500-999 Employees' },
        { value: 'xlarge (1000+)', label: '>1000 Employees' }
    ];

    options = {
        states: this.states,
        companySizes : this.companySizes
    }

    postDataHandler = (e) => {
        e.preventDefault();
        const Data = {
            name: this.state.name,
            companyName: this.state.companyName,
            stateLocation: this.state.stateLocation,
            cityLocation: this.state.cityLocation,
            companySize: this.state.companySize,
            contactEmail: this.state.contactEmail,
            phoneNumber: this.state.phoneNumber,
            numPeople: this.state.numPeople,
            presentationType: this.state.presentationType,
            comments: this.state.comments
        }
        result.post('/marks.json', Data).then(response => {
            console.log(response);
        })
    }
    handleSelectChange = (fieldName, selectedOption) => {
        this.setState({ [fieldName]: selectedOption.value});
    }
    renderMultiSelect = (fieldName,options,label,placeholder) => {
        return (
            <div className="field">
                <label>{label}</label>
                <Select
                    options={this.options[options]}
                    placeholder={placeholder}
                    onChange={(selectedOption) => this.handleSelectChange(fieldName, selectedOption)}/>
            </div>
        )
    }
    handleInputChange = (fieldName, event) => {
        this.setState({ [fieldName]: event.target.value });
    }
    renderInputField = (type, fieldName, label, placeholder) => {
        return (
            <div className="field">
                <label>{label}</label>
                <input
                    type={type}
                    placeholder={placeholder}
                    value={this.state[fieldName]}
                    onChange={(e) => this.handleInputChange(fieldName, e)}
                />
            </div>
        );
    }

    render() {
        return(
            <div className="ui placeholder segment">
                <div className="ui one column very relaxed stackable grid">
                    <div className="column">
                        <h3>RISE Organization Sign-Up Form</h3>
                        <form className="ui form" onSubmit={this.postDataHandler}>
                            {this.renderInputField("text","name", "Name:", "Name", require)}
                            {this.renderInputField("text","companyName", "Company Name:", "Company Name",require)}
                            {this.renderMultiSelect("stateLocation","states","State:","State",require)}
                            {this.renderInputField("text","cityLocation", "City:", "City",require)}
                            {this.renderInputField("email","contactEmail", "Email:", "Email",require)}
                            {this.renderInputField("text","phoneNumber", "Phone Number:", "Phone Number (Optional)")}
                            {this.renderMultiSelect("companySize","companySizes", "Company Size:", "Company Size", require)}
                            {this.renderInputField("text","numPeople", "Number of People Attending RISE:", "Number of People",require)}
                            {this.renderInputField("text","presentationType", "Presentation Type:", "Demo/Presentation/Poster",require)}
                            {this.renderInputField("text","comments", "Additional Comments:", "Additional Comments")}
                            <button className="ui blue submit button">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

}

export default ResultsAdd;
