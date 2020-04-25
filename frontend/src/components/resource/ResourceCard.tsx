import React from 'react'
import { Card, CardContent, CardActionArea, CardMedia } from '@material-ui/core'
import { Link } from "react-router-dom"
import VideocamIcon from '@material-ui/icons/Videocam';
import ImageIcon from '@material-ui/icons/Image';
import AudiotrackIcon from '@material-ui/icons/Audiotrack';
import DescriptionIcon from '@material-ui/icons/Description';
import './resourceCard.scss';
import useMrGFunctions from "../../hooks/useMrGFunctions"

interface InputProps {
    resource: string
    matchUrl: string
    index: number
}

const ResourceCard = (props: InputProps) => {

    const mrGFunctions = useMrGFunctions()

    return (
        <>
            {mrGFunctions.isVideoFormat(props.resource.split(".")[1]) &&
                <>

                    < Card style={{ animationDelay: `${props.index * 0.1}s` }} key={props.resource} className="resource-card">
                        <CardActionArea component={Link} to={`${props.matchUrl}/resource/${props.resource}`}>
                        <CardMedia
                            image={require("../../images/Video-icon.png")}
                            title="Click to view the video!"
                        />
                            <CardContent>
                                <div className="resource-type-badge-wrapper video">
                                    <div className="resource-type-badge">
                                        <VideocamIcon />
                                    </div>
                                </div>
                                <div className="card-title-wrapper">
                                    <span>{mrGFunctions.cleanFilename(props.resource)}</span>
                                </div>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </>
            }

            {mrGFunctions.isAudioFormat(props.resource.split(".")[1]) &&
                < Card style={{ animationDelay: `${props.index * 0.1}s` }} key={props.resource} className="resource-card">
                    <CardActionArea component={Link} to={`${props.matchUrl}/resource/${props.resource}`}>
                        <CardMedia
                            image={require("../../images/Audio-icon.png")}
                            title="Click to listen to the audio!"
                        />
                        <CardContent>
                            <div className="resource-type-badge-wrapper audio">
                                <div className="resource-type-badge">
                                    <AudiotrackIcon />
                                </div>
                            </div>
                            <div className="card-title-wrapper">
                                <span>{mrGFunctions.cleanFilename(props.resource)}</span>
                            </div>
                        </CardContent>
                    </CardActionArea>
                </Card>
            }

            {mrGFunctions.isImageFormat(props.resource.split(".")[1]) &&
                <Card style={{ animationDelay: `${props.index * 0.1}s` }} key={props.resource} className="resource-card">
                    <CardActionArea component={Link} to={`${props.matchUrl}/resource/${props.resource}`}>
                    <CardMedia
                            image={require("../../images/Image-icon.png")}
                            title="Click to view the image!"
                        />
                        <CardContent>
                            <div className="resource-type-badge-wrapper image">
                                <div className="resource-type-badge">
                                    <ImageIcon />
                                </div>
                            </div>
                            <div className="card-title-wrapper">
                                <span>{mrGFunctions.cleanFilename(props.resource)}</span>
                            </div>
                        </CardContent>
                    </CardActionArea>
                </Card>
            }

            {mrGFunctions.isPDFFormat(props.resource.split(".")[1]) &&
                <Card style={{ animationDelay: `${props.index * 0.1}s` }} key={props.resource} className="resource-card">
                    <CardActionArea component={Link} to={`${props.matchUrl}/resource/${props.resource}`}>
                    <CardMedia
                            image={require("../../images/PDF-icon.png")}
                            title="Click to view the pdf!"
                        />
                        <CardContent>
                            <div className="resource-type-badge-wrapper pdf">
                                <div className="resource-type-badge">
                                    <DescriptionIcon />
                                </div>
                            </div>
                            <div className="card-title-wrapper">
                                <span>{mrGFunctions.cleanFilename(props.resource)}</span>
                            </div>
                        </CardContent>
                    </CardActionArea>
                </Card>
            }
        </>
    )
}

export default ResourceCard