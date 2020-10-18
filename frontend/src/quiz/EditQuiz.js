import React, {Component} from 'react';
import axios from "axios";
import authHeader from "../services/auth-header";
import AddQuestion from "./question/AddQuestion";
import Questions from "./question/Questions";
import loginRedirect from "../services/login-redirect";
import Loader from "react-loader-spinner";

const QUIZ_URL = "http://localhost:8080/api/quizzes";


class EditQuiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            editing: false,
            quizName: "",
            quizDescription: "",
            loadingQuestion: false
        }
    }

    componentDidMount() {
        const QUESTION_URL = QUIZ_URL + "/" + this.props.quiz.id + "/questions";
        this.setState({quizName: this.props.quiz.name, quizDescription: this.props.quiz.description});
        axios.get(QUESTION_URL, {params: {}, headers: authHeader()})
            .then(result => this.setState({questions: result.data}))
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 403) {
                        this.props.goToLogin();

                    }
                }
            });
    }

    deleteQuestion = (questionId) => {
        let delete_url = QUIZ_URL + "/" + this.props.quiz.id + "/questions/" + questionId;

        axios.delete(delete_url, {params: {}, headers: authHeader()})
            .then(() => this.setState({
                questions: this.state.questions.filter(question => question.id !== questionId)
            }))
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 403) {
                        this.goToLogin();
                    }
                }
            });
    }

    goToLogin = () => {
        loginRedirect(this.props);
    }

    addQuestion = (description, answerText) => {
        this.setState({loadingQuestion: true});
        let question = {id: -1, description: description};
        let answer = {answerText: answerText};
        let question_url = QUIZ_URL + "/" + this.props.quiz.id + "/questions/";
        axios.post(question_url, question, {params: {}, headers: authHeader()})
            .then(function (result) {
                question = result.data;
                return question;
            }).then(
            () => {
                if (question.id !== -1) {
                    axios.post(question_url + question.id + "/answers", answer, {params: {}, headers: authHeader()})
                        .then(
                            () => {
                                this.setState({
                                    questions: [question, ...this.state.questions],
                                    loadingQuestion: false
                                });
                            }
                        ).catch((error) => {
                        console.log(error);
                        this.setState({loadingQuestion: false});
                    });
                } else {
                    this.setState({message: "error: unable to add question", loadingQuestion: false});
                }
            }
        ).catch((error) => {
            this.setState({loadingQuestion: false});
            if (error.response) {
                if (error.response.status === 403) {
                    this.goToLogin();
                }
            }
        })
    }

    updateQuestion = (questionId, description, index) => {
        let put_url = QUIZ_URL + "/" + this.props.quiz.id + "/questions/" + questionId;
        let questionsCopy = [...this.state.questions];
        axios.put(put_url, {description: description}, {params: {}, headers: authHeader()})
            .then((result) => {
                questionsCopy[index] = result.data
                this.setState({
                        questions: questionsCopy
                    }
                )
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 403) {
                        this.goToLogin();
                    }
                }
            });
    }

    toggleEditing = () => {

        this.setState({editing: !this.state.editing});
    }

    saveEdit = () => {
        if (this.state.quizName !== this.props.quiz.name
            || this.state.quizDescription !== this.props.quiz.description) {

            this.props.updateQuiz(this.props.quiz.id, this.state.quizName, this.state.quizDescription, this.props.index);
        }
        this.toggleEditing();
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <div>
                {this.props.quiz !== undefined ?
                    <div>
                        {this.state.editing && (
                            <div className={"card text-center"}>
                                <button className={"btn btn-success"} onClick={this.saveEdit}>Save Edit</button>
                                <div className={"card-body"}>
                                    <div className={"form-group"}>
                                        <input name={"quizName"}
                                               placeholder={"Quiz Name"}
                                               className={"form-control"}
                                               value={this.state.quizName}
                                               onChange={this.handleChange}
                                               maxLength={30}
                                               required/>
                                    </div>
                                    <div className={"form-group"}>
                                        <textarea
                                            name={"quizDescription"}
                                            placeholder={"Quiz Description"}
                                            className={"form-control"}
                                            value={this.state.quizDescription}
                                            onChange={this.handleChange}
                                            maxLength={255}
                                        />
                                    </div>
                                </div>
                                <button className={"btn btn-dark"}
                                        onClick={this.props.finishEditQuiz.bind(this, this.props.quiz.id)}>Finish
                                </button>

                            </div>
                        )}
                        {!this.state.editing && (
                            <div className={"card text-center"}>
                                <button className={"btn btn-info"} onClick={this.toggleEditing}>Edit</button>
                                <div className={"card-body"}>
                                    <h1 className={"card-title"}>{this.state.quizName}</h1>
                                    <h5 className={"card-text"}>{this.state.quizDescription} </h5>
                                </div>
                                <button className={"btn btn-dark"}
                                        onClick={this.props.finishEditQuiz.bind(this, this.props.quiz.id)}>Finish
                                </button>

                            </div>
                        )}


                        <div style={{marginTop: "2%"}}>
                            <AddQuestion addQuestion={this.addQuestion}/>
                        </div>

                        <div style={{marginTop: "1%"}}>
                            <React.Fragment>
                                {this.state.loadingQuestion &&
                                (<Loader type="ThreeDots" color="#00BFFF"
                                         height={40}
                                         width={80}/>
                                )}
                                <Questions questions={this.state.questions}
                                           goToLogin={this.props.goToLogin}
                                           quizId={this.props.quiz.id}
                                           deleteQuestion={this.deleteQuestion}
                                           updateQuestion={this.updateQuestion}/>
                            </React.Fragment>

                        </div>

                    </div>

                    : null
                }
            </div>
        );
    }
}

export default EditQuiz;