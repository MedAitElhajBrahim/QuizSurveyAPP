import React, {Component} from 'react';
import AuthService from "../services/auth.service";
import AddQuestion from "./question/AddQuestion";
import axios from "axios";
import authHeader from "../services/auth-header";
import Questions from "./question/Questions";
import loginRedirect from "../services/login-redirect";
import Loader from "react-loader-spinner";

const QUIZ_URL = "http://localhost:8080/api/quizzes";


class AddQuiz extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: AuthService.getCurrentUser(),
            message: "",
            quiz_name: "",
            quiz_description: "",
            quiz: {},
            questions: [],
            loadingQuestion: false
        }
    }

    componentDidMount = () => {
        if (this.state.currentUser === null) {
            this.goToLogin();
        }
    }

    goToLogin = () => {
        loginRedirect(this.props);
    }

    handleChange = (event) => {

        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmitQuiz = (event) => {
        event.preventDefault();

        const {quiz_name, quiz_description} = this.state;
        axios.post(QUIZ_URL, {name: quiz_name, description: quiz_description}, {params: {}, headers: authHeader()})
            .then(result => this.setState({quiz: result.data}))
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 403) {
                        this.goToLogin();
                    }
                }
            })


    }

    deleteQuestion = (questionId) => {
        let delete_url = QUIZ_URL + "/" + this.state.quiz.id + "/questions/" + questionId;
        console.log(delete_url);
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

    addQuestion = (description, answerText) => {
        this.setState({loadingQuestion: true});
        let question = {id: -1, description: description};
        let answer = {answerText: answerText};
        let question_url = QUIZ_URL + "/" + this.state.quiz.id + "/questions/";
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
        let put_url = QUIZ_URL + "/" + this.state.quiz.id + "/questions/" + questionId;
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

    saveQuiz = () => {
        this.props.history.push("/dashboard");
    }

    discardQuiz = () => {
        if (window.confirm("Discard this quiz?")) {
            axios.delete(QUIZ_URL + "/" + this.state.quiz.id, {params: {}, headers: authHeader()})
                .then(() => {
                    this.props.history.push("/dashboard");
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.status === 403) {
                            this.goToLogin();
                        }
                    }
                });
        }

    }

    render() {
        const {questions} = this.state;

        return (
            <div>
                {!this.state.quiz.id && (
                    <form onSubmit={this.handleSubmitQuiz}>
                        {this.state.message && (
                            <div className="form-group">
                                <div className={"alert alert-danger"} role="alert">
                                    {this.state.message}
                                </div>
                            </div>
                        )}
                        <div className={"form-group"}>
                            <label htmlFor={"quiz_name"}>Quiz</label>
                            <input name={"quiz_name"}
                                   placeholder={"Name"}
                                   className={"form-control"}
                                   value={this.state.quiz_name}
                                   onChange={this.handleChange}
                                   maxLength={30}
                                   required/>
                        </div>
                        <div className={"form-group"}>
                            <textarea
                                name={"quiz_description"}
                                placeholder={"Description"}
                                className={"form-control"}
                                value={this.state.quiz_description}
                                onChange={this.handleChange}
                                maxLength={255}
                            />
                        </div>


                        <button type={"submit"} className={"btn btn-dark"}>Save</button>
                    </form>
                )}
                {this.state.quiz.id && (
                    <div>
                        <div className={"card text-center"}>
                            <div className={"card-body"}>
                                <h1 className={"card-title"}>{this.state.quiz.name}</h1>
                                <h5 className={"card-text"}>{this.state.quiz.description} </h5>
                            </div>
                            <button className={"btn btn-dark"} onClick={this.saveQuiz}>Save Quiz</button>
                            <button className={"btn btn-danger"} onClick={this.discardQuiz}>Discard Quiz</button>
                        </div>
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

                                <Questions quizId={this.state.quiz.id}
                                           questions={questions}
                                           deleteQuestion={this.deleteQuestion}
                                           goToLogin={this.goToLogin}
                                           updateQuestion={this.updateQuestion}/>
                            </React.Fragment>
                        </div>

                    </div>

                )}

            </div>
        );
    }
}

export default AddQuiz;