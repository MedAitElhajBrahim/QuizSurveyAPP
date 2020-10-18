import React, {Component} from 'react';
import axios from "axios";
import authHeader from "../../services/auth-header";

const QUIZ_URL = "http://localhost:8080/api/quizzes";

class TakeQuizQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answers: new Set(),
            answerText: "",
            submitted: false
        };
        this.correctAnswer = "";
    }

    componentDidMount() {
        const ANSWERS_URL = QUIZ_URL + "/" + this.props.quizId + "/questions/" + this.props.question.id + "/answers";
        axios.get(ANSWERS_URL, {params: {}, headers: authHeader()})
            .then(result => {
                const answerTextSet = new Set();
                result.data.forEach((answer) => answerTextSet.add(answer.answerText));
                this.correctAnswer = Array.from(answerTextSet).join("|split|");
                this.setState({answers: answerTextSet});

            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 403) {
                        this.props.goToLogin();
                    }
                }
            });

    }

    componentWillUnmount() {
        if (!this.state.submitted) {
            this.submitAnswer(null);
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }


    submitAnswer = (event) => {
        if (event) {
            event.preventDefault();
        }

        const {answers, answerText} = this.state;
        if (answers.has(answerText.trim().toLowerCase().replace(/ +(?= )/g, ''))) {
            this.props.updateCorrect(this.props.question, answerText);
        } else {
            this.props.updateIncorrect(this.props.question, answerText, this.correctAnswer);
        }
        this.setState({submitted: true});
    }

    render() {
        const {submitted, answerText} = this.state;
        return (
            <div className={"card-text-center"}>

                {!submitted ? (
                        <form className={"card-body"} onSubmit={this.submitAnswer}>
                            <p>{this.props.question.description}</p>
                            <textarea value={answerText}
                                      name={"answerText"}
                                      maxLength={255}
                                      className={"form-control"}
                                      onChange={this.handleChange}
                                      placeholder={"Enter answer"}
                                      required
                            />
                            <button style={{marginTop: "1%"}} className={"btn btn-dark"} type={"submit"}>Save</button>
                        </form>
                    ) :
                    (
                        <form className={"card-body"}>
                            <p>{this.props.question.description}</p>
                            <textarea value={answerText}
                                      name={"answerText"}
                                      className={"form-control"}
                                      readOnly
                            />
                            <p style={{marginTop: "1%"}}>Saved</p>
                        </form>
                    )
                }


            </div>
        );
    }
}

export default TakeQuizQuestion;