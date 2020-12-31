import React from 'react'
import { Card, CardContent, CardActionArea } from '@material-ui/core'
import './folderCard.scss';
import useCloudinaryFunctions from "../../hooks/useMrGFunctions"

interface InputProps {
    folder: any,
    index: number,
    setCurrentPath: (path: string) => void,
}

const FolderCard = (props: InputProps) => {

    const cloudinaryFunctions = useCloudinaryFunctions();

    return (
        <Card style={{ animationDelay: `${props.index * 0.1}s` }} className="folder-card">
            <CardActionArea onClick={() => props.setCurrentPath(props.folder.path_display)}>
                <CardContent>
                    <span className="folder-label">{cloudinaryFunctions.cleanFolderName(props.folder.name)}</span>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default FolderCard