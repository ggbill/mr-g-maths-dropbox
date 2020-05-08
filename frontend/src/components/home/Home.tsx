import './home.scss';
import React, { useState, useRef } from 'react'
import useFetch from "../../hooks/useFetch"
import { Box } from '@material-ui/core'
import Loading from '../shared/Loading';
import FolderCard from '../shared/FolderCard'
import useCloudinaryFunctions from "../../hooks/useMrGFunctions"
import Error from '../shared/Error';
import NoContent from '../shared/NoContent';

const Home = ({ match }) => {
    const isCancelled = useRef(false)
    const ftpApi = useFetch("ftp")
    const cloudinaryFunctions = useCloudinaryFunctions()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [subFolders, setSubFolders] = useState<any>(null)
    const [isFolderContentFound, setIsFilesFound] = useState<boolean>(true)
    const [isSubFoldersFound, setIsSubFoldersFound] = useState<boolean>(true)

    const getFolderContent = (): void => {
        setLoading(true)
        ftpApi.get("folder-content/%2F")
            .then((data: any) => {
                // console.log(`data: ${JSON.stringify(data)}`)
                if (!isCancelled.current) {
                    if (data) {
                        if (data.contentBody.subFolders.length) {
                            data.contentBody.subFolders = cloudinaryFunctions.sortByPrefix(data.contentBody.subFolders)
                            setSubFolders(data.contentBody.subFolders)
                        } else {
                            setIsSubFoldersFound(false)
                        }
                    } else {
                        setIsFilesFound(false)
                        setIsSubFoldersFound(false)
                    }
                    setLoading(false)
                }
            })
            .catch((err: Error) => {
                if (!isCancelled.current) {
                    console.log(err)
                    setError(err.message)
                    setLoading(false)
                }
            })
    }

    React.useEffect(() => {
        getFolderContent();

        return () => {
            isCancelled.current = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, []);

    if (error) {
        return (
            <Error error={error} />
        )
    }

    return (
        <div className="content home-page">
            <div className="intro-section">
                <img className="minion-gif-desktop" alt="minion" src={require("../../images/Maths-food-Minion-black.gif")} />
                <img className="minion-gif-mobile" alt="minion" src={require("../../images/Maths-food-Minion-mobile-black.gif")} />
                <div className="text-section">
                    <p>
                        Click on the folders below if you’re hungry to learn mathematics the Mr G way
                    </p>
                </div>
            </div>

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
                            <FolderCard key={subFolder} folder={subFolder} url={match.url} index={index} />
                        )
                    })}
                </Box>
            }

            {!loading && !isSubFoldersFound && !isFolderContentFound && <div className="no-content-found">
                <NoContent />
            </div>}

        </div >
    )
}

export default Home