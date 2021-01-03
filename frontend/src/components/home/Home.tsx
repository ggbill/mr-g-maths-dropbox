import './home.scss';
import React, { useState, useRef } from 'react'
import { Box } from '@material-ui/core'
import Loading from '../shared/Loading';
import FolderCard from '../shared/FolderCard'
import ResourceCard from '../resource/ResourceCard'
import Error from '../shared/Error';
import NoContent from '../shared/NoContent';
import useDropbox from "../../hooks/useDropbox"
import BreadCrumbs from '../shared/BreadCrumbs';
import MenuBar from '../shared/MenuBar';
import ResourceComponent from '../resource/ResourceComponent';

const Home = () => {
    const isCancelled = useRef(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [currentPath, setCurrentPath] = useState<string>("")
    const [subFolders, setSubFolders] = useState<any>([])
    const [files, setFiles] = useState<any>([])
    const dropBox = useDropbox();
    const [file, setFile] = useState<any>(null)
    const [isFile, setIsFile] = useState<boolean>(false)


    const getFolderContent = (): void => {
        setLoading(true)
        setFiles([])
        setSubFolders([])
        dropBox.getFolderContent(currentPath).then((data: any) => {
            if (data) {
                if (!isCancelled.current) {
                    setSubFolders(data.filter(entry => entry['.tag'] === "folder"))
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
        setLoading(true)
        dropBox.getFile(currentPath).then((data: any) => {
            if (data) {
                if (!isCancelled.current) {
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
        setFiles([])
        setSubFolders([])
        setCurrentPath(path)
    }

    React.useEffect(() => {
        if (currentPath.split(".").length > 1) {
            getFile()
        } else {
            getFolderContent()
        }

        // return () => {
        //     isCancelled.current = true;
        // };

        // eslint-disable-next-line react-hooks/exhaustive-deps 
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
                            isFinalEntryFileName={isFile ? true : false}
                            setCurrentPath={setCurrentPath}
                        />
                    </h2>
                }


                {loading &&
                    <Loading />
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
                    <ResourceComponent file={file} allFilesInFolder={files} setCurrentPath={setCurrentPathVar} />
                }

                {!loading && !isFile && !subFolders.length && !files.length && <div className="no-content-found">
                    <NoContent />
                </div>}
            </div >
        </>
    )
}

export default Home