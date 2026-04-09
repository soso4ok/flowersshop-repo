import React from 'react';
import {Link} from "react-router-dom";

const UserDataForm = ({userInputs, setUserInputs, setShwoPasswdForm}) => {
    const handleSetInfo = () => {
        setShwoPasswdForm(true)
    }


    return (
        <div className="registration-form">
            <form>
                <h2>Create Account</h2>
                <div className="input-container">
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        onChange={(e) => (
                            setUserInputs((prevState) => ({
                                ...prevState,
                                firstName: e.target.value
                            }))
                        )}
                        value={userInputs.firstName}
                        placeholder=""
                        required
                    />
                    <label htmlFor="firstName">First Name</label>
                    <div className="bar"></div>
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder=""
                        onChange={(e) => (
                            setUserInputs((prevState) => ({
                                ...prevState,
                                lastName: e.target.value
                            }))
                        )}
                        value={userInputs.lastName}
                        required
                    />
                    <label htmlFor="lastName">Last Name</label>
                    <div className="bar"></div>
                </div>
                <div className="input-container">
                    <input
                        id="email"
                        name="email"
                        placeholder=""
                        onChange={(e) => (
                            setUserInputs((prevState) => ({
                                ...prevState,
                                email: e.target.value
                            }))
                        )}
                        value={userInputs.email}
                        required
                    />
                    <label htmlFor="email">Email</label>
                    <div className="bar"></div>
                </div>
                <div className="button-container">
                    <button type="submit" onClick={handleSetInfo}>Continue</button>
                    <Link to='/' className="switch-form-text"
                         style={{marginTop: "8px", cursor: "pointer"}}>
                        Already have an account? Login
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default UserDataForm;
