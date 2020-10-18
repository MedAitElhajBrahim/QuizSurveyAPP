import React, {Component} from 'react';
import Answer from "./Answer";

class Answers extends Component {
    render() {
        return (
            this.props.answers.map((answer, index) => (
                    <Answer key={answer.id} answer={answer} index={index} deleteAnswer={this.props.deleteAnswer}
                            updateAnswer={this.props.updateAnswer}
                    />
                )
            )
        );
    }
}

export default Answers;