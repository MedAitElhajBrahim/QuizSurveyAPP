import React, {Component} from 'react';
import TakeQuizQuestions from "./TakeQuizQuestions";
import axios from "axios";
import authHeader from "../../services/auth-header";
import FinishedTakeQuiz from "./results/FinishedTakeQuiz";
import Loader from "react-loader-spinner";

const QUIZ_URL = "http://localhost:8080/api/quizzes";


class MyComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            finishedQuiz: false,
            loading: true
        }
        this.submittedQuestions = [];
        this.score = 0;
    }


    componentDidMount() {
        const QUESTION_URL = QUIZ_URL + "/" + this.props.quiz.id + "/questions";

        axios.get(QUESTION_URL, {params: {}, headers: authHeader()})
            .then(result => this.setState({questions: result.data, loading: false}))
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 403) {
                        this.props.goToLogin();

                    }
                }
            });

    }


    updateCorrect = (question, answer) => {

        this.submittedQuestions.push({
            question: question,
            answer: answer,
            correctAnswer: answer,
            correct: true
        });


        this.score += 1;


    }
    updateIncorrect = (question, answer, correctAnswer) => {
        this.submittedQuestions.push({
            question: question,
            answer: answer,
            correctAnswer: correctAnswer,
            correct: false,
        });

    }
    finishQuiz = () => {
        if (this.submittedQuestions.length < this.state.questions.length) {
            if (!window.confirm("Some questions have not been saved. Are you sure you want to finish?")) {
                return;
            }
        }
        this.setState({finishQuiz: true, score: this.score},
            () => {
                this.forceUpdate();
            }
        );

    }
    exitTakeQuiz = () => {
        this.props.finishTakeQuiz();
    }

    render() {
        const {finishQuiz, questions, loading} = this.state;

        return finishQuiz ? (
                <FinishedTakeQuiz score={this.score} questions={this.state.questions}
                                  submittedQuestions={this.submittedQuestions}
                                  exitTakeQuiz={this.exitTakeQuiz}/>
            ) :
            (
                <div>
                    {loading ? (
                        <Loader className="text-center" type="ThreeDots" color="#00BFFF" height={160} width={160}/>
                    ) : (
                        <div>
                            {questions.length === 0 ? (
                                    <>
                                        <h1>Quiz has no questions or questions could not be loaded</h1>
                                        <button style={{margin: "0 auto", display: "block"}} onClick={this.exitTakeQuiz}
                                                className={"btn btn-dark"}>
                                            Go back
                                        </button>
                                    </>
                                ) :
                                (<>
                                        <TakeQuizQuestions updateCorrect={this.updateCorrect}
                                                           updateIncorrect={this.updateIncorrect}
                                                           questions={questions}
                                                           quizId={this.props.quiz.id}
                                                           goToLogin={this.props.goToLogin}/>

                                        <button style={{margin: "0 auto", display: "block"}}
                                                className={"btn btn-success"}
                                                onClick={this.finishQuiz}>Finish Quiz
                                        </button>

                                    </>
                                )}
                        </div>
                    )
                    }
                </div>

            );
    }
}


export default MyComponent;
