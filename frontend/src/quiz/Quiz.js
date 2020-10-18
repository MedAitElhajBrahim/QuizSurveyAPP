import React, {Component} from 'react';

class Quiz extends Component {


    render() {
        return (
            <div>
                {this.props.quiz !== undefined ?
                    <div className={"card text-center"}>
                        <div className="card-header">
                            <ul className="nav nav-tabs card-header-tabs justify-content-end">
                                <button className={"btn btn-danger nav-link"}
                                        onClick={this.props.deleteQuiz.bind(this, this.props.quiz.id)}>
                                    X
                                </button>
                            </ul>
                        </div>
                        <div className={"card-body"}>
                            <h1 className={"card-title"}>{this.props.quiz.name}</h1>
                            <h5 className={"card-text"}>{this.props.quiz.description} </h5>
                            <button onClick={this.props.editQuiz.bind(this, this.props.index)}
                                    className={"btn btn-outline-primary"}>Edit Quiz
                            </button>
                            <button onClick={this.props.takeQuiz.bind(this, this.props.index)}
                                    className={"btn btn-outline-success"}>Take Quiz
                            </button>

                        </div>

                    </div>

                    : null
                }
            </div>

        )

    }
}

export default Quiz;