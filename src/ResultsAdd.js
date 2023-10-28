import React from "react";
import result from './results'

class ResultsAdd extends React.Component{
    
    state = {
        name:'',
        unit:'',
        grade:''
    }

    postDataHandler = (e) => {
        e.preventDefault();
        const Data = {
            name: this.state.name,
            unit: this.state.unit,
            grade: this.state.grade
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
                            {this.renderInputField("text","name", "Name:", "Name")}
                            {this.renderInputField("text","unit", "Unit:", "Unit")}
                            {this.renderInputField("email","grade", "Grade:", "Grade")}
                            <button className="ui blue submit button">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
    
}

export default ResultsAdd;
