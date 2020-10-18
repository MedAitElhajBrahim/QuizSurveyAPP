import React, {Component} from 'react';
import Quiz from "./Quiz";

class Quizzes extends Component {

    render() {

        return (
            <div>
                {this.props.quizzes !== undefined ?
                    this.props.quizzes.map(
                        (quiz, index) => (
                            <Quiz key={quiz.id} quiz={quiz} deleteQuiz={this.props.deleteQuiz}
                                  takeQuiz={this.props.takeQuiz} editQuiz={this.props.editQuiz} index={index}/>
                        )) : null
                }
            </div>
        );


    }
}

export default Quizzes;