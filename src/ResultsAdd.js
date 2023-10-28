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
            name:this.state.name,
            unit:this.state.unit,
            grade:this.state.grade
        }
        result.post('/marks.json', Data).then(response =>{
            console.log(response);
        })
    }
    
    render() {
        return(
            <div className="ui placeholder segment">
                <div className="ui one column very relaxed stackable grid">
                    <div className="column">
                        <h3>Hey</h3>
                        <form className="ui form" onSubmit={this.postDataHandler}>
                            <div className="field">
                                <label>Name:</label>
                                <input type="text" placeholder="Name" 
                                value = {this.state.name}
                                onChange ={(e)=>this.setState({name:e.target.value})}
                                />
                            </div>
                            <div className="field">
                                <label>Unit:</label>
                                <input type="text" placeholder="Unit" 
                                value = {this.state.unit}
                                onChange ={(e)=>this.setState({unit:e.target.value})}
                                />
                            </div>
                            <div className="field">
                                <label>Grade:</label>
                                <input type="text" placeholder="Grade" 
                                value = {this.state.grade}
                                onChange ={(e)=>this.setState({grade:e.target.value})}
                                />
                            </div>
                            <button className="ui blue submit button">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
    
}

export default ResultsAdd;