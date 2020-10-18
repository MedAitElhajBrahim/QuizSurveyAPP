import React, {Component} from 'react';
import AuthService from "./services/auth.service";


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: AuthService.getCurrentUser()
        }

    }

    render() {
        const {currentUser} = this.state;
        return (
            <div>
                {currentUser === null ? (
                        <div>
                            <h1>Welcome</h1>
                            <h2>Log in or register to use this site</h2>
                            <h3>Frontend: React.js</h3>
                            <h3>Backend: Spring Boot</h3>
                            <h3>Created by: Brandon Johnson</h3>
                        </div>

                    ) :
                    (
                        <div>
                            <h1>Welcome</h1>
                            <h3>Frontend: React.js</h3>
                            <h3>Backend: Spring Boot</h3>
                            <h3>Created by: Brandon Johnson</h3>
                        </div>
                    )
                }

            </div>
        );
    }
}

export default Home;