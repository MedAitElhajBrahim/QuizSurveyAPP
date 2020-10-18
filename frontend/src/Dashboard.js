import AuthService from "./services/auth.service";
import React, {Component} from 'react';
import axios from "axios";
import authHeader from "./services/auth-header";
import Quizzes from "./quiz/Quizzes";
import EditQuiz from "./quiz/EditQuiz";
import loginRedirect from "./services/login-redirect";
import TakeQuiz from "./quiz/takeQuiz/TakeQuiz";
import Loader from "react-loader-spinner";

const QUIZ_URL = "http://localhost:8080/api/quizzes";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: AuthService.getCurrentUser(),
            quizzes: [],
            editingQuiz: false,
            takingQuiz: false,
            quizIndex: 0,
            loading: true,
            errorMessage: ""
        }
    }

    componentDidMount() {

        axios.get(QUIZ_URL, {params: {}, headers: authHeader()})
            .then(result => this.setState({quizzes: result.data, loading: false}))
            .catch((error) => {
                this.setState({loading: false});
                if (error.response) {
                    if (error.response.status === 403) {
                        this.goToLogin();
                    } else {
                        this.setState({errorMessage: error.response.statusText});
                    }
                }

            });
    }

    goToLogin = () => {
        loginRedirect(this.props);
    }

    deleteQuiz = (id) => {
        const quizzesCopy = [...this.state.quizzes];
        const deletedVersion = quizzesCopy.filter(quiz => quiz.id !== id);
        this.setState({quizzes: deletedVersion});
        if (window.confirm("Delete this quiz?")) {
            axios.delete(QUIZ_URL + "/" + id, {params: {}, headers: authHeader()})
                .then(res => this.setState({quizzes: this.state.quizzes.filter(quiz => quiz.id !== id)}))
                .catch((error) => {
                    this.setState({quizzes: quizzesCopy});
                    if (error.response) {
                        if (error.response.status === 403) {
                            this.goToLogin();
                        } else {
                            const resMessage =
                                (error.response &&
                                    error.response.data &&
                                    error.response.data.message) ||
                                error.message ||
                                error.toString();
                            console.log(resMessage);
                            this.setState({errorMessage: resMessage});
                        }
                    }
                });
        }
    }

    editQuiz = (index) => {
        this.setState({
            editingQuiz: true,
            quizIndex: index
        });
    }

    takeQuiz = (index) => {
        this.setState({
            takingQuiz: true,
            quizIndex: index
        });
    }

    finishTakeQuiz = () => {
        this.setState({
            takingQuiz: false
        });
    }

    finishEditQuiz = (quizId) => {

        axios.get(QUIZ_URL + "/" + quizId, {params: {}, headers: authHeader()})
            .then((result) => {
                this.setState({
                    editingQuiz: false,
                    quizzes: this.state.quizzes.map(quiz => {
                        if (quiz.id === quizId) {
                            quiz.name = result.data.name;
                            quiz.description = result.data.description;
                        }
                        return quiz;
                    })
                });
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 403) {
                        this.goToLogin();
                    } else {
                        const resMessage =
                            (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                            error.message ||
                            error.toString();
                        console.log(resMessage);
                        this.setState({errorMessage: resMessage});
                    }
                }
            });


    }

    updateQuiz = (quizId, name, description, index) => {
        const put_url = QUIZ_URL + "/" + quizId;

        axios.put(put_url, {name: name, description: description}, {params: {}, headers: authHeader()})
            .then((result) => {


            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 403) {
                        this.goToLogin();
                    } else {
                        const resMessage =
                            (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                            error.message ||
                            error.toString();
                        console.log(resMessage);
                        this.setState({errorMessage: resMessage});
                    }
                }
            });

    }
    goToAddQuiz = () => {
        this.props.history.push("/add-quiz");
    }

    render() {
        const {quizzes, editingQuiz, takingQuiz, quizIndex, loading} = this.state;

        return loading ? (<Loader className="text-center" type="ThreeDots" color="#00BFFF" height={160} width={160}/>
            ) :
            quizzes.length > 0 ?
                (
                    <div>
                        {this.state.errorMessage && (
                            <div className="form-group">
                                <div className={"alert alert-danger"} role="alert">
                                    {this.state.errorMessage}
                                </div>
                            </div>
                        )}
                        {!editingQuiz && !takingQuiz && (
                            <div>

                                <Quizzes quizzes={quizzes} deleteQuiz={this.deleteQuiz} editQuiz={this.editQuiz}
                                         takeQuiz={this.takeQuiz} goToLogin={this.goToLogin}/>
                            </div>
                        )}

                        {editingQuiz && !takingQuiz && (
                            <div>
                                <EditQuiz quiz={quizzes[quizIndex]}
                                          finishEditQuiz={this.finishEditQuiz}
                                          goToLogin={this.goToLogin} updateQuiz={this.updateQuiz}/>
                            </div>
                        )}

                        {!editingQuiz && takingQuiz && (
                            <div>
                                <TakeQuiz quiz={quizzes[quizIndex]} finishTakeQuiz={this.finishTakeQuiz}/>
                            </div>
                        )}
                    </div>

                )

                :
                (
                    <div className="text-center">
                        <button className="btn btn-success" onClick={this.goToAddQuiz}> Add a
                            quiz
                        </button>
                    </div>

                );


    }
}

export default Dashboard;