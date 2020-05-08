import React from 'react'
import { Card, CardContent, CardActionArea } from '@material-ui/core'
import { Link } from "react-router-dom"
import './folderCard.scss';
import useCloudinaryFunctions from "../../hooks/useMrGFunctions"

interface InputProps {
    folder: string,
    url: string,
    index: number
}


const FolderCard = (props: InputProps) => {

    const cloudinaryFunctions = useCloudinaryFunctions();

    return (
        <>
            {props.url === "/" ?
                <Card style={{ animationDelay: `${props.index * 0.1}s` }}  className="folder-card">
                    <CardActionArea component={Link} to={`${props.url}${props.folder}`} >
                        <CardContent>
                            {/* <span className="folder-label">{props.folder.name.replace(/_/g, " ")}</span> */}
                            <span className="folder-label">{cloudinaryFunctions.cleanFolderName(props.folder)}</span>
                        </CardContent>
                    </CardActionArea>
                </Card> :
                <Card style={{ animationDelay: `${props.index * 0.1}s` }} className="folder-card">
                    <CardActionArea component={Link} to={`${props.url}/${props.folder}`} >
                        <CardContent>
                            <span className="folder-label">{cloudinaryFunctions.cleanFolderName(props.folder)}</span>
                        </CardContent>
                    </CardActionArea>
                </Card>
            }
        </>
    )
}

export default FolderCard