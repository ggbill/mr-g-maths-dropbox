import React, { useState, useEffect } from "react"
import "./noContent.scss"



const NoContent = () => {

    const [isDisplayNoContent, setIsDisplayNoContent] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => enableLoading(), 5000);

        //same as componentWillUnmount
        return () => {
            clearTimeout(timer);
        };
    }, []);

    const enableLoading = () => {
        setIsDisplayNoContent(true)
    }

    return (
        <>
        {isDisplayNoContent &&
        <div className="no-content-wrapper">
            <img className="logo" alt="logo" src={require("../../images/No-content-icon-transparent.png")} />
            <h2>This folder is empty!</h2>
        </div >
        }
        </>
    )
}

export default NoContent