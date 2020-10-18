import React, {Component} from 'react';
import AuthService from "../services/auth.service";
import Loader from "react-loader-spinner";

class Registration extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            password_confirmation: "",
            successful: false,
            message: "",
            loading: true
        };

    }

    componentDidMount() {
        this.setState({loading: false});
    }

    handleSubmit = (event) => {
        const {username, password, password_confirmation} = this.state;
        if (username.includes(" ")) {
            this.setState({
                successful: false,
                message: "Username cannot contain spaces"
            });
        } else if (password.localeCompare(password_confirmation) !== 0) {
            this.setState({
                successful: false,
                message: "Passwords do not match"
            });

        } else {
            this.setState({loading: true});
            AuthService.register(username, password).then(
                response => {
                    this.setState({
                        message: response.data,
                        successful: true,
                        loading: false
                    });
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        successful: false,
                        loading: false,
                        message: error.response.status !== undefined && error.response.status === 409 ? "Username is already taken" : resMessage
                    });
                }
            );

        }
        event.preventDefault();
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>

                    {this.state.message && (
                        <div className={"form-group"}>
                            <div className={this.state.successful ? "alert alert-success" : "alert alert-danger"}
                                 role={"alert"}>
                                {this.state.message}
                            </div>
                        </div>
                    )}
                    {!this.state.successful && (

                        <div>

                            <div className={"form-group"}>

                                <label htmlFor={"username"}>Username</label>
                                <input name={"username"}
                                       placeholder={"Username"}
                                       className={"form-control"}
                                       value={this.state.username}
                                       onChange={this.handleChange}
                                       maxLength={30}
                                       required/>
                            </div>

                            <div className={"form-group"}>
                                <label htmlFor={"password"}>Password</label>
                                <input type={"password"}
                                       name={"password"}
                                       placeholder={"Password"}
                                       className={"form-control"}
                                       value={this.state.password}
                                       onChange={this.handleChange}
                                       minLength={8}
                                       maxLength={255}
                                       required/>
                            </div>
                            <div className={"form-group"}>
                                <label htmlFor={"password_confirmation"}>Password Confirmation</label>
                                <input type={"password"}
                                       name={"password_confirmation"}
                                       placeholder={"Password Confirmation"}
                                       className={"form-control"}
                                       value={this.state.password_confirmation}
                                       onChange={this.handleChange}
                                       minLength={8}
                                       required/>
                            </div>

                            {this.state.loading && (
                                <Loader type="ThreeDots" color="#00BFFF"
                                        height={40}
                                        width={80}
                                />
                            )}
                            {!this.state.loading && (
                                <button type={"submit"} className={"btn btn-dark"}>Register</button>
                            )}

                        </div>

                    )}
                </form>
            </div>
        );
    }
}

export default Registration;