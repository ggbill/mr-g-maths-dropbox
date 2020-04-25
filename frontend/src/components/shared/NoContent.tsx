import React from "react"
import "./noContent.scss"



const NoContent = () => {

    return (
        <div className="no-content-wrapper">
            <img className="logo" alt="logo" src={require("../../images/No-content-icon-transparent.png")} />
            <h2>This folder is empty!</h2>
        </div >
    )
}

export default NoContent