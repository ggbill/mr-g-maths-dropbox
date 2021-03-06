import React from "react"
import "./error.scss"

interface InputProps {
    error: string
}

const Error = (props: InputProps) => {
    return (
        <div className="error-wrapper">
            <img className="logo" alt="logo" src={require("../../images/Error-icon-transparent.png")} />
            <h2>Something went wrong.</h2>
            <p>{props.error}</p>
        </div >
    )
}

export default Error