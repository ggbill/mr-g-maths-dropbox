import React, { useState, useEffect } from "react"
import "./loading.scss"
import CircularProgress from '@material-ui/core/CircularProgress';

interface InputProps {
    isDownloadInProgress: boolean,
    bytesReceived: number,
    bytesToDownload: number
}

const Loading = (props: InputProps) => {

    const [isDisplayLoading, setIsDisplayLoading] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => enableLoading(), 2000);

        //same as componentWillUnmount
        return () => {
            clearTimeout(timer);
        };
    }, []);

    const enableLoading = () => {
        setIsDisplayLoading(true)
    }

    return (
        <div className="content">
            {isDisplayLoading &&

                <div className="loading-wrapper">
                    <img className="logo" alt="logo" src={require("../../images/dancing_minion.gif")} />
                    <h2>Loading...</h2>
                    {props.isDownloadInProgress &&
                        <>
                            <CircularProgress variant="determinate" value={Math.round((props.bytesReceived / props.bytesToDownload)* 100)} />
                            <h3>{Math.round((props.bytesReceived / props.bytesToDownload)* 100)}%</h3>
                        </>
                    }
                </div >
            }
        </div>

    )
}

export default Loading