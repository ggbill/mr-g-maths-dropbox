import React from 'react'
import { Card, CardContent, CardActionArea, CardMedia } from '@material-ui/core'
import VideocamIcon from '@material-ui/icons/Videocam';
import ImageIcon from '@material-ui/icons/Image';
import AudiotrackIcon from '@material-ui/icons/Audiotrack';
import DescriptionIcon from '@material-ui/icons/Description';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import './resourceCard.scss';
import useMrGFunctions from "../../hooks/useMrGFunctions"

interface InputProps {
    resource: any
    index: number
    setCurrentPath: (path: string) => void
}

const ResourceCard = (props: InputProps) => {

    const mrGFunctions = useMrGFunctions()

    return (
        <>
            {mrGFunctions.isVideoFormat(props.resource.name.split(".")[1]) &&
                <>

                    <Card style={{ animationDelay: `${props.index * 0.1}s` }} key={props.resource.name} className="resource-card">
                        <CardActionArea onClick={() => props.setCurrentPath(props.resource.path_display)}>
                            <CardMedia
                                // image={`data:video/${props.resource.name.split(".")[1]};base64, ${props.resource.thumbnail}`}
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
                                    <span>{mrGFunctions.cleanFileName(props.resource.name)}</span>
                                </div>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </>
            }

            {mrGFunctions.isAudioFormat(props.resource.name.split(".")[1]) &&
                <Card style={{ animationDelay: `${props.index * 0.1}s` }} key={props.resource.name} className="resource-card">
                    <CardActionArea onClick={() => props.setCurrentPath(props.resource.path_display)}>
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
                                <span>{mrGFunctions.cleanFileName(props.resource.name)}</span>
                            </div>
                        </CardContent>
                    </CardActionArea>
                </Card>
            }

            {mrGFunctions.isImageFormat(props.resource.name.split(".")[1]) &&
                <Card style={{ animationDelay: `${props.index * 0.1}s` }} key={props.resource.name} className="resource-card">
                    <CardActionArea onClick={() => props.setCurrentPath(props.resource.path_display)}>
                        <CardMedia
                            // image={`data:image/${props.resource.name.split(".")[1]};base64, ${props.resource.thumbnail}`}
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
                                <span>{mrGFunctions.cleanFileName(props.resource.name)}</span>
                            </div>
                        </CardContent>
                    </CardActionArea>
                </Card>
            }

            {mrGFunctions.isPDFFormat(props.resource.name.split(".")[1]) &&
                <Card style={{ animationDelay: `${props.index * 0.1}s` }} key={props.resource.name} className="resource-card">
                    <CardActionArea onClick={() => props.setCurrentPath(props.resource.path_display)}>
                        <CardMedia
                            image={require("../../images/PDF-icon.png")}
                            title="Click to view the pdf!"
                        />
                        <CardContent>
                            <div className="resource-type-badge-wrapper pdf">
                                <div className="resource-type-badge">
                                    <PictureAsPdfIcon />
                                </div>
                            </div>
                            <div className="card-title-wrapper">
                                <span>{mrGFunctions.cleanFileName(props.resource.name)}</span>
                            </div>
                        </CardContent>
                    </CardActionArea>
                </Card>
            }

            {
                !mrGFunctions.isVideoFormat(props.resource.name.split(".")[1]) &&
                !mrGFunctions.isAudioFormat(props.resource.name.split(".")[1]) &&
                !mrGFunctions.isImageFormat(props.resource.name.split(".")[1]) &&
                !mrGFunctions.isPDFFormat(props.resource.name.split(".")[1]) &&
                <Card style={{ animationDelay: `${props.index * 0.1}s` }} key={props.resource.name} className="resource-card">
                    <CardActionArea onClick={() => props.setCurrentPath(props.resource.path_display)}>
                        <CardMedia
                            image={require("../../images/Files-icon.png")}
                            title="Click to view the file!"
                        />
                        <CardContent>
                            <div className="resource-type-badge-wrapper file">
                                <div className="resource-type-badge">
                                    <DescriptionIcon />
                                </div>
                            </div>
                            <div className="card-title-wrapper">
                                <span>{mrGFunctions.cleanFileName(props.resource.name)}</span>
                            </div>
                        </CardContent>
                    </CardActionArea>
                </Card>
            }
        </>
    )
}

export default ResourceCard