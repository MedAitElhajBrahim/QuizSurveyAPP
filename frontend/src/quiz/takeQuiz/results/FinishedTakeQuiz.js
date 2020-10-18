import React, {Component} from 'react';
import QuestionResults from "./QuestionResults";

class FinishedTakeQuiz extends Component {
    componentDidMount() {
        this.forceUpdate();
    }

    render() {
        return (
            <div>
                {this.props.submittedQuestions !== undefined && this.props.questions !== undefined ? (
                    <div>
                        <h2>Score: {this.props.score + "/" + this.props.questions.length + " " +
                        (this.props.score / this.props.questions.length * 100).toFixed(2) + "%"}</h2>
                        <QuestionResults submittedQuestions={this.props.submittedQuestions}/>
                        <button style={{margin: "0 auto", display: "block"}} onClick={this.props.exitTakeQuiz}
                                className={"btn btn-dark"}>
                            Exit
                        </button>
                    </div>
                ) : (<></>)
                }
            </div>


        );
    }
}

export default FinishedTakeQuiz;