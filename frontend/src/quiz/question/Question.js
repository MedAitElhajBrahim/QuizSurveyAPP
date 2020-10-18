import React, {Component} from 'react';
import axios from "axios";
import authHeader from "../../services/auth-header";
import AddAnswer from "./answer/AddAnswer";
import Loader from "react-loader-spinner";
import Answers from "./answer/Answers";

const QUIZ_URL = "http://localhost:8080/api/quizzes";


class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answers: [],
            editing: false,
            description: "",
            errorMessage: "",
            loadingAnswer: true,

        }
        this.answerCount = 0;
    }

    componentDidMount() {
        const ANSWERS_URL = QUIZ_URL + "/" + this.props.quizId + "/questions/" + this.props.question.id + "/answers";
        axios.get(ANSWERS_URL, {params: {}, headers: authHeader()})
            .then((result) => {
                this.setState({answers: result.data, loadingAnswer: false});
                this.answerCount = result.data.length;

            })
            .catch((error) => {
                this.setState({loadingAnswer: false});
                if (error.response) {
                    if (error.response.status === 403) {
                        this.props.goToLogin();
                    }
                }
            });
        this.setState({description: this.props.question.description});
    }

    toggleEdit = () => {
        this.setState({editing: !this.state.editing});
    }
    saveEdit = () => {
        if (this.props.question.description !== this.state.description.toLowerCase().trim()) {
            this.props.updateQuestion(this.props.question.id, this.state.description, this.props.index);
        }
        this.toggleEdit();
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    addAnswer = (answerText) => {
        this.setState({loadingAnswer: true, errorMessage: ""});
        const ANSWERS_URL = QUIZ_URL + "/" + this.props.quizId + "/questions/" + this.props.question.id + "/answers";
        axios.post(ANSWERS_URL, {answerText: answerText}, {params: {}, headers: authHeader()})
            .then((result) => {
                this.setState({answers: [...this.state.answers, result.data], loadingAnswer: false});
                this.answerCount++;
            })
            .catch(
                (error) => {
                    this.setState({loadingAnswer: false});
                    if (error.response) {
                        if (error.response.status === 403) {
                            this.props.goToLogin();
                        }
                    }
                }
            );
    }

    deleteAnswer = async (answerId) => {
        if (this.answerCount <= 1) {
            this.setState({errorMessage: "Question must have at least 1 answer"});

        } else {
            this.answerCount--;
            const DELETE_URL = QUIZ_URL + "/" + this.props.quizId + "/questions/" + this.props.question.id + "/answers/" + answerId;
            await axios.delete(DELETE_URL, {params: {}, headers: authHeader()})
                .then((result) => {
                        this.setState(
                            {answers: this.state.answers.filter(answer => answer.id !== answerId)}
                        );


                    }
                ).catch(
                    (error) => {

                        if (error.response) {
                            if (error.response.status === 403) {
                                this.props.goToLogin();
                            }
                        }
                        this.answerCount++;


                    }
                );
        }

    }

    updateAnswer = (answerId, answerText, index) => {

        const PUT_URL = QUIZ_URL + "/" + this.props.quizId + "/questions/" + this.props.question.id + "/answers/" + answerId;
        let answersCopy = [...this.state.answers];
        axios.put(PUT_URL, {answerText: answerText}, {params: {}, headers: authHeader()})
            .then((result) => {
                answersCopy[index] = result.data;

                this.setState({
                    answers: answersCopy
                });

            }).catch(
            (error) => {
                if (error.response) {
                    if (error.response.status === 403) {
                        this.props.goToLogin();
                    }
                }
            }
        );
    }

    render() {
        const {question} = this.props;
        const {errorMessage, editing, description, answers, loadingAnswer} = this.state;
        return (
            <div className={"card d-flex "}>
                <div className="card-header">
                    <ul className="nav nav-tabs card-header-tabs justify-content-between">
                        <h4>Question {this.props.index + 1}</h4>
                        <button className={"btn btn-danger "}
                                onClick={this.props.deleteQuestion.bind(this, question.id)}>
                            X
                        </button>
                    </ul>
                </div>


                <div className={"card-body"}>
                    {errorMessage && (
                        <div className="form-group">
                            <div className={"alert alert-danger"} role="alert">
                                {errorMessage}
                            </div>
                        </div>
                    )}

                    {!editing && (
                        <div className="row">
                            <div className=" col-sm-1">
                                <button onClick={this.toggleEdit}
                                        className={"btn btn-sm btn-dark"}>Edit
                                </button>
                            </div>

                            <div className="col-sm-10">
                                <h4 className="card-title">{description}</h4>
                            </div>

                        </div>

                    )}
                    {editing && (
                        <div className="row">
                            <div className=" col-sm-1">
                                <button onClick={this.saveEdit}
                                        className={"btn btn-sm btn-success"}>Save
                                </button>
                            </div>
                            <div className="col-sm-10">

                                <textarea value={description}
                                          name={"description"}
                                          maxLength={255}
                                          onChange={this.handleChange}
                                          className={"form-control"}
                                          placeholder={"Enter Question"}
                                          required
                                />
                            </div>
                        </div>
                    )}


                    {answers.length > 0 && (

                        <div>


                            <Answers answers={answers} deleteAnswer={this.deleteAnswer}
                                     updateAnswer={this.updateAnswer}/>


                        </div>
                    )}
                    {loadingAnswer && (
                        <Loader type="ThreeDots" color="#00BFFF"
                                height={40}
                                width={80}/>
                    )}
                    <AddAnswer addAnswer={this.addAnswer}/>

                </div>


            </div>
        );
    }
}

export default Question;