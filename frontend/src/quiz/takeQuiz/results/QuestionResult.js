import React, {Component} from 'react';

class QuestionResult extends Component {
    render() {
        return (
            <div>
                {this.props.correct ? (
                    <div className={"card"}>
                        <div className={"card-body"}>
                            <p style={{fontWeight: "bold"}}>{this.props.question.description}</p>
                            <p style={{
                                fontWeight: "bold",
                                backgroundColor: "rgb(178, 246, 151)"
                            }}>{this.props.answer}</p>
                        </div>
                    </div>

                ) : (
                    <div className={"card"}>
                        <div className={"card-body"}>
                            <p style={{fontWeight: "bold"}}>{this.props.question.description}</p>
                            <p style={{
                                fontWeight: "bold",
                                backgroundColor: "rgb(242, 42, 52)"
                            }}>{this.props.answer.length === 0 ? "No Answer entered" : this.props.answer}</p>
                            {this.props.correctAnswer.split("|split|").map((answer) => {
                                return <p key={answer}
                                          style={{fontWeight: "bold", backgroundColor: "rgb(178,246,151)"}}>{answer}</p>
                            })}

                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default QuestionResult;