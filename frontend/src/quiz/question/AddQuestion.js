import React, {Component} from 'react';

class AddQuestion extends Component {
    state = {
        description: "",
        answer: ""
    }
    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.addQuestion(this.state.description, this.state.answer);
        this.setState({
            description: "",
            answer: ""
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div className={"form-group"}>

                        <textarea
                            name={"description"}
                            placeholder={"Enter a question"}
                            className={"form-control"}
                            value={this.state.description}
                            onChange={this.onChange}
                            maxLength={255}
                            required
                        />
                    </div>
                    <div className={"form-group"}>

                        <textarea
                            name={"answer"}
                            placeholder={"Enter an answer"}
                            className={"form-control"}
                            value={this.state.answer}
                            onChange={this.onChange}
                            maxLength={255}
                            required
                        />
                    </div>
                    <button type="submit" value={"Submit"} className={"btn btn-success"}>+</button>
                </form>
            </div>

        );
    }
}

export default AddQuestion;