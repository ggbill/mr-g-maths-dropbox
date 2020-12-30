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

const Home = ({ match }) => {
    const isCancelled = useRef(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [currentPath, setCurrentPath] = useState<string>("")
    const [subFolders, setSubFolders] = useState<any>(null)
    const [files, setFiles] = useState<any>(null)
    const [isFilesFound, setIsFilesFound] = useState<boolean>(true)
    const [isSubFoldersFound, setIsSubFoldersFound] = useState<boolean>(true)
    const dropBox = useDropbox();
    const mrGFunctions = useMrGFuctions()

    const getFolderContent = (): void => {
        setLoading(true)
        dropBox.getFolderContent(currentPath).then((data: any) => {
            if (data) {
                if (!isCancelled.current) {
                    console.log(`DATA: ${JSON.stringify(data)}`)
                    console.log(`setSubFolders: ${data.filter(entry => entry['.tag'] === "folder")}`)
                    setSubFolders(data.filter(entry => entry['.tag'] === "folder"))
                    setFiles(data.filter(entry => entry['.tag'] === "file"))
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

    // const generateBreadcrumbs = (): any => {
    //     // let trimmedUrl = match.url.substr(1)
    //     // let breadcrumbs: string[] = trimmedUrl.split("/")
    //     currentPath.split("/")

    //     return (
    //         mrGFunctions.generateBreadcrumbs(currentPath.substr(1).split("/"), false)
    //     )
    // }

    // React.useEffect(() => {
    //     getFolderContent();

    //     return () => {
    //         isCancelled.current = true;
    //     };
    //     // eslint-disable-next-line react-hooks/exhaustive-deps  
    // }, []);

    React.useEffect(() => {
        getFolderContent();

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

            {!loading && subFolders &&

                <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-evenly">
                    {subFolders.map((subFolder: string, index: number) => {
                        return (
                            <FolderCard key={index} folder={subFolder} url={match.url} index={index} setCurrentPath={setCurrentPathVar} />
                        )
                    })}
                </Box>
            }

            {!loading && files &&
                <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-evenly">
                    {files.map((resource: string, index: number) => {
                        return (
                            <ResourceCard key={index} resource={resource} matchUrl={match.url} index={index} />
                        )
                    })}
                </Box>
            }

            {!loading && !isSubFoldersFound && !isFilesFound && <div className="no-content-found">
                <NoContent />
            </div>}

        </div >
    )
}

export default Home