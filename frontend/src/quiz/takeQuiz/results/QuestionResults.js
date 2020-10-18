import React, {Component} from 'react';
import QuestionResult from "./QuestionResult";

class QuestionResults extends Component {
    componentDidMount() {
        this.forceUpdate();
    }

    render() {

        return (

            <div>
                {this.props.submittedQuestions !== undefined && this.props.submittedQuestions.length !== 0 ?
                    this.props.submittedQuestions.map((bundle) => (
                        <QuestionResult key={bundle.question.id}
                                        question={bundle.question}
                                        answer={bundle.answer}
                                        correctAnswer={bundle.correctAnswer}
                                        correct={bundle.correct}/>
                    )) : null
                }
            </div>
        );
    }
}

export default QuestionResults;