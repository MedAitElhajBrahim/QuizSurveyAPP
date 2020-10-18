import React, {Component} from 'react';
import AuthService from "../services/auth.service";
import Loader from "react-loader-spinner";

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            error_message: "",
            loading: true
        };

    }

    componentDidMount() {
        if (this.props.location.state !== undefined) {
            this.setState({error_message: this.props.location.state.expiredTokenMessage, loading: false});
        } else {
            this.setState({loading: false});
        }
    }

    handleSubmit = (event) => {
        const {username, password} = this.state;
        this.setState({loading: true});
        AuthService.login(username, password).then(
            () => {
                this.props.history.push("/dashboard");
                window.location.reload();
            },
            error => {
                if (error.response === undefined) {
                    this.setState({
                        error_message: "Unable to connect to server",
                        loading: false
                    });
                } else {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    this.setState({
                        error_message: error.response.status === 403 ? "Incorrect password or username not found" : resMessage,
                        loading: false
                    });
                }

            }
        );


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
                    {this.state.error_message && (
                        <div className="form-group">
                            <div className={"alert alert-danger"} role="alert">
                                {this.state.error_message}
                            </div>
                        </div>
                    )}
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
                               maxLength={255}
                               required/>
                    </div>
                    {this.state.loading && (
                        <Loader type="ThreeDots" color="#00BFFF"
                                height={40}
                                width={80}
                        />
                    )}
                    {!this.state.loading && (
                        <button type={"submit"} className={"btn btn-dark"}>Login</button>
                    )}


                </form>
            </div>
        );
    }
}

export default Login;