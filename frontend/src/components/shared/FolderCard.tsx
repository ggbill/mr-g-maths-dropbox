import React from 'react'
import { Card, CardContent, CardActionArea } from '@material-ui/core'
import { Link } from "react-router-dom"
import './folderCard.scss';
import useCloudinaryFunctions from "../../hooks/useMrGFunctions"

interface InputProps {
    folder: any,
    url: string,
    index: number,
    setCurrentPath: (path: string) => void,
}

const FolderCard = (props: InputProps) => {

    const cloudinaryFunctions = useCloudinaryFunctions();

    const setCurrentPath = () => {
        props.setCurrentPath(props.folder.path_display)
    }

    return (
        <>
            {props.url === "/" ?
                <Card style={{ animationDelay: `${props.index * 0.1}s` }} className="folder-card">
                    <CardActionArea onClick={() => setCurrentPath()}>
                        <CardContent>
                            <span className="folder-label">{cloudinaryFunctions.cleanFolderName(props.folder.name)}</span>
                        </CardContent>
                    </CardActionArea>
                </Card> :
                <Card style={{ animationDelay: `${props.index * 0.1}s` }} className="folder-card">
                    <CardActionArea component={Link} to={`${props.url}/${props.folder.name}`} >
                        <CardContent>
                            <span className="folder-label">{cloudinaryFunctions.cleanFolderName(props.folder.name)}</span>
                        </CardContent>
                    </CardActionArea>
                </Card>
            }
        </>
    )
}

export default FolderCard