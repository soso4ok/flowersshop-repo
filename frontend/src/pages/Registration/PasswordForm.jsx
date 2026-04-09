import React, { useState } from "react";
import { useDispatch } from "react-redux";

const PasswordForm = ({ userInputs, setUserInputs, handleSetInfo, loading }) => {
    return (
        <div className="password-form">
            <h2>Set Password</h2>
            <form>
                <div className="input-container">
                    <input
                        type="password"
                        id="password"
                        placeholder=""
                        onChange={(e) => (
                            setUserInputs((prevState) => ({
                                ...prevState,
                                password: e.target.value
                            }))
                        )}
                        value={userInputs.password}
                        required
                        disabled={loading}
                    />
                    <label htmlFor="password">Password</label>
                    <div className="bar"></div>
                </div>
                <div className="input-container">
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder=""
                        onChange={(e) => (
                            setUserInputs((prevState) => ({
                                ...prevState,
                                confirmPassword: e.target.value
                            }))
                        )}
                        value={userInputs.confirmPassword}
                        required
                        disabled={loading}
                    />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="bar"></div>
                </div>
                <div className="button-container">
                    <button type="submit" onClick={e => {
                        e.preventDefault()
                        handleSetInfo()
                    }} disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PasswordForm;
