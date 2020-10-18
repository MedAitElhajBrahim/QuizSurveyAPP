import React, {Component} from 'react';
import Loader from "react-loader-spinner";

class Answer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            answerText: "",
            loadingDeleting: false
        }
        this.mounted = false;
    }

    componentDidMount() {
        this.setState({
            answerText: this.props.answer.answerText
        })
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    toggleEdit = () => {
        this.setState({editing: !this.state.editing});
    }
    saveEdit = () => {
        if (this.props.answer.answerText !== this.state.answerText.toLowerCase().trim()) {
            this.props.updateAnswer(this.props.answer.id, this.state.answerText, this.props.index);
        }
        this.toggleEdit();
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    deleteThisAnswer = async () => {
        this.setState({loadingDeleting: true});
        await this.props.deleteAnswer(this.props.answer.id);
        if (this.mounted) {
            this.setState({loadingDeleting: false});
        }


    }

    render() {
        return (
            <React.Fragment>
                {this.state.loadingDeleting && (
                    (
                        <Loader type="ThreeDots" color="#00BFFF"
                                height={40}
                                width={80}/>
                    )
                )}

                {!this.state.loadingDeleting && (
                    <div>
                        {!this.state.editing && (
                            <div className="row">
                                <div className=" col-sm-1">
                                    <button onClick={this.toggleEdit}
                                            className={"btn btn-sm btn-info"}>Edit
                                    </button>
                                </div>
                                <div className="col-sm-10">
                                    <p>{this.state.answerText}</p>
                                </div>

                                <div className=" col-sm-1">
                                    <button onClick={this.deleteThisAnswer}
                                            className={"btn btn-warning"}>X
                                    </button>
                                </div>
                            </div>
                        )}
                        {this.state.editing && (
                            <div className="row">
                                <div className=" col-sm-1">
                                    <button onClick={this.saveEdit}
                                            className={"btn btn-sm btn-success"}>Save
                                    </button>
                                </div>
                                <div className="col-sm-10">

                            <textarea value={this.state.answerText}
                                      name={"answerText"}
                                      maxLength={255}
                                      className={"form-control"}
                                      onChange={this.handleChange}
                                      placeholder={"Enter answer"}
                                      required
                            />
                                </div>

                                <div className=" col-sm-1">
                                    <button onClick={this.props.deleteAnswer.bind(this, this.props.answer.id)}
                                            className={"btn btn-warning"}>X
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>


                )

                }


            </React.Fragment>
        )
    }
}

export default Answer;