import './home.scss';
import React, { useState, useRef } from 'react'
import { Box } from '@material-ui/core'
import Loading from '../shared/Loading';
import FolderCard from '../shared/FolderCard'
import ResourceCard from '../resource/ResourceCard'
import Error from '../shared/Error';
import NoContent from '../shared/NoContent';
import useDropbox from "../../hooks/useDropbox"
import useMrGFuctions from "../../hooks/useMrGFunctions"
import BreadCrumbs from '../shared/BreadCrumbs';
import MenuBar from '../shared/MenuBar';
import ResourceComponent from '../resource/ResourceComponent';

const Home = () => {
    const isCancelled = useRef(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [currentPath, setCurrentPath] = useState<string>("")
    const [subFolders, setSubFolders] = useState<any>(null)
    const [files, setFiles] = useState<any>(null)
    const [isFilesFound, setIsFilesFound] = useState<boolean>(true)
    const [isSubFoldersFound, setIsSubFoldersFound] = useState<boolean>(true)
    const dropBox = useDropbox();
    const [file, setFile] = useState<any>(null)
    const [isFile, setIsFile] = useState<boolean>(false)


    const getFolderContent = (): void => {
        // console.log(`GET FOLDER: currentPath: ${currentPath}`)
        setLoading(true)
        setFiles(null)
        setSubFolders(null)
        dropBox.getFolderContent(currentPath).then((data: any) => {
            if (data) {
                if (!isCancelled.current) {
                    setSubFolders(data.filter(entry => entry['.tag'] === "folder"))
                    // setFiles(data.filter(entry => entry['.tag'] === "file"))
                    setFilesAndGetThumbnails(data.filter(entry => entry['.tag'] === "file"))
                    setIsFile(false)
                }
            }
            setLoading(false)
        })
            .catch((err: Error) => {
                if (!isCancelled.current) {
                    console.log(err)
                    setError(err.message)
                    setLoading(false)
                }
            })
    }

    const setFilesAndGetThumbnails = (files) => {
        dropBox.getThumbnails(files).then((data: any) => {
            setFiles(data)
        }).catch((err: Error) => {
            setError(err.message)
        })
    }

    const getFile = (): void => {
        // console.log(`GET FILE: currentPath: ${currentPath}`)
        setLoading(true)
        dropBox.getFile(currentPath).then((data: any) => {
            if (data) {
                if (!isCancelled.current) {
                    // console.log(`DATA: ${JSON.stringify(data)}`)
                    setFile(data)
                    setIsFile(true)
                }
            }
            setLoading(false)
        })
            .catch((err: Error) => {
                if (!isCancelled.current) {
                    console.log(err)
                    setError(err.message)
                    setLoading(false)
                }
            })
    }

    const setCurrentPathVar = (path: string) => {
        setCurrentPath(path)
    }

    React.useEffect(() => {
        if (currentPath.split(".").length > 1){
            getFile()
        }else{
            getFolderContent()
        }
        
        // return () => {
        //     isCancelled.current = true;
        // };
    }, [currentPath]);

    if (error) {
        return (
            <Error error={error} />
        )
    }

    return (
        <>
            <MenuBar page="home" setCurrentPath={setCurrentPath} />
            <div className="content home-page">
                {currentPath === "" ?
                    <div className="intro-section">
                        <img className="minion-gif-desktop" alt="minion" src={require("../../images/Maths-food-Minion-black.gif")} />
                        <img className="minion-gif-mobile" alt="minion" src={require("../../images/Maths-food-Minion-mobile-black.gif")} />
                        <div className="text-section">
                            <p>
                                Click on the folders below if you’re hungry to learn mathematics the Mr G way
                            </p>
                        </div>
                    </div>
                    :
                    <h2>
                        <BreadCrumbs
                            breadCrumbs={currentPath.substr(1).split("/")}
                            isFinalEntryFileName={false}
                            setCurrentPath={setCurrentPath}
                        />
                    </h2>
                }


                {loading &&
                    <Loading
                        isDownloadInProgress={false}
                        bytesReceived={0}
                        bytesToDownload={0}
                    />
                }

                {!loading && !isFile && subFolders &&

                    <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-evenly">
                        {subFolders.map((subFolder: string, index: number) => {
                            return (
                                <FolderCard key={index} folder={subFolder} index={index} setCurrentPath={setCurrentPathVar} />
                            )
                        })}
                    </Box>
                }

                {!loading && !isFile && files &&
                    <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-evenly">
                        {files.map((resource: string, index: number) => {
                            return (      
                                <ResourceCard key={index} resource={resource} index={index} setCurrentPath={setCurrentPathVar} />
                            )
                        })}
                    </Box>
                }

                {!loading && isFile && 
                    <ResourceComponent file={file} allFilesInFolder={files} setCurrentPath={setCurrentPathVar}/>
                }

                {!loading && !isSubFoldersFound && !isFilesFound && <div className="no-content-found">
                    <NoContent />
                </div>}
            </div >
        </>
    )
}

export default Home