import React, {Component} from 'react';
import Question from "./Question";

class Questions extends Component {
    render() {
        return (
            this.props.questions.map((question, index) => (
                    <Question key={question.id} question={question} index={index}
                              deleteQuestion={this.props.deleteQuestion}
                              quizId={this.props.quizId}
                              goToLogin={this.props.goToLogin}
                              updateQuestion={this.props.updateQuestion}
                    />
                )
            )
        );
    }
}

export default Questions;