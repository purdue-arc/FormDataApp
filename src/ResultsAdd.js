import React from "react";
import result from './results'
import './style.css'

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
                        <h3>Hey</h3>
                        <form className="ui form" onSubmit={this.postDataHandler}>
                            {this.renderInputField("text","name", "Name:", "Name", require)}
                            {this.renderInputField("text","companyName", "Company Name:", "Company Name",require)}
                            {this.renderInputField("text","stateLocation", "State:", "State", require)}
                            {this.renderInputField("text","cityLocation", "City:", "City",require)}
                            {this.renderInputField("email","contactEmail", "Email:", "Email",require)}
                            {this.renderInputField("text","phoneNumber", "Phone Number:", "Phone Number (Optional)")}
                            {this.renderInputField("text","companySize", "Company Size:", "Company Size", require)}
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
