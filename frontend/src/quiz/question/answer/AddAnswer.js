import React, {Component} from 'react';

class AddAnswer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answerText: ""
        }
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.addAnswer(this.state.answerText);
        this.setState({
            answerText: ""
        });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="row">
                    <div className="col-sm-11">
                        <textarea
                            name={"answerText"}
                            placeholder={"Add more possible answers"}
                            className={"form-control"}
                            value={this.state.answerText}
                            onChange={this.onChange}
                            maxLength={255}
                            required
                        />
                    </div>
                    <div className="col-sm-1">
                        <button type="submit" value={"Submit"} className={"btn btn-info"}>+</button>
                    </div>
                </div>
            </form>
        );
    }
}

export default AddAnswer;