import React, {Component} from 'react';
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import Home from "./Home";
import AuthService from "./services/auth.service"
import Login from "./auth/Login";
import Registration from "./auth/Registration";
import Dashboard from "./Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import AddQuiz from "./quiz/AddQuiz";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./App.css"

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: undefined
        }

    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();
        if (user) {
            this.setState({
                currentUser: user
            });
        }
    }

    logOut = () => {
        AuthService.logout();
    }


    render() {
        return (
            <BrowserRouter>
                <div>
                    <nav className={"navbar navbar-expand navbar-dark bg-dark"}>
                        <Link to={"/"} className={"navbar-brand"}>
                            Quiz Creator
                        </Link>
                        <div className={"navbar-nav mr auto"}>
                            <li className={"nav-item"}>
                                <Link to={"/home"} className={"nav-link"}>Home</Link>
                            </li>
                        </div>

                        {this.state.currentUser ? (
                            <div className={"navbar-nav ml-auto"}>
                                <li className={"nav-item"}>
                                    <Link to={"/dashboard"} className={"nav-link"}>
                                        Quizzes
                                    </Link>
                                </li>
                                <li className={"nav-item"}>
                                    <Link to={"/add-quiz"} className={"nav-link"}>
                                        Add Quiz
                                    </Link>
                                </li>
                                <li className={"nav-item"}>
                                    <a href={"/login"} onClick={this.logOut} className={"nav-link"}>
                                        Logout
                                    </a>
                                </li>
                            </div>

                        ) : (
                            <div className={"navbar-nav ml-auto"}>
                                <li className={"nav_item"}>
                                    <Link to={"/login"} className={"nav-link"}>
                                        Login
                                    </Link>
                                </li>
                                <li className={"nav_item"}>
                                    <Link to={"/registration"} className={"nav-link"}>
                                        Register
                                    </Link>
                                </li>
                            </div>
                        )}
                    </nav>
                    <div className="container mt-3">
                        <Switch>
                            <Route exact path={["/", "/home"]}
                                   render={props => (
                                       <Home {...props} />
                                   )}
                            />
                            <Route exact path={"/login"}
                                   render={props => (
                                       <Login {...props}/>
                                   )}
                            />
                            <Route exact path={"/registration"}
                                   render={props => (
                                       <Registration {...props}/>
                                   )}
                            />
                            <Route exact path={"/dashboard"}
                                   render={props => (
                                       <Dashboard {...props}/>
                                   )}
                            />
                            <Route exact path={"/add-quiz"}
                                   render={props => (
                                       <AddQuiz {...props}/>
                                   )}
                            />
                        </Switch>
                    </div>
                </div>

            </BrowserRouter>

        );
    }
}

export default App;