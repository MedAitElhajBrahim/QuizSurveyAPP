import React, {Component} from 'react';
import TakeQuizQuestion from "./TakeQuizQuestion";

class TakeQuizQuestions extends Component {
    render() {
        return (
            <div>
                {this.props.questions !== undefined ?
                    this.props.questions.map((question) => (
                        <TakeQuizQuestion key={question.id}
                                          updateCorrect={this.props.updateCorrect}
                                          updateIncorrect={this.props.updateIncorrect}
                                          goToLogin={this.props.goToLogin}
                                          question={question}
                                          quizId={this.props.quizId}/>
                    )) : null
                }
            </div>
        );
    }
}

export default TakeQuizQuestions;