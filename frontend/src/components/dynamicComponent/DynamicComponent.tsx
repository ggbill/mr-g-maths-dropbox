import React, { useState } from 'react'
import useFetch from "../../hooks/useFetch"
import { Switch, Route } from "react-router-dom"
import { Box } from '@material-ui/core'
import './dynamicContent.scss';
import Loading from '../shared/Loading'
import ResourceCard from '../resource/ResourceCard'
import ResourcePage from '../resource/ResourcePage'
import FolderCard from '../shared/FolderCard'
import useCloudinaryFunctions from "../../hooks/useMrGFunctions"
import NoContent from '../shared/NoContent';
import Error from '../shared/Error';

const DynamicComponent = ({ match }) => {
    const isCancelled = React.useRef(false)
    const ftpApi = useFetch("ftp")
    const cloudinaryFunctions = useCloudinaryFunctions()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [subFolders, setSubFolders] = useState<any>(null)
    const [files, setFiles] = useState<any>(null)
    const [isFilesFound, setIsFilesFound] = useState<boolean>(true)
    const [isSubFoldersFound, setIsSubFoldersFound] = useState<boolean>(true)

    const getFolderContent = (): void => {
        setLoading(true)
        let encodedMatchUrl = match.url.replace(/\//g, "%2F")
        ftpApi.get(`folder-content/${encodedMatchUrl}`)
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

                        if (data.contentBody.files.length) {
                            data.contentBody.files = cloudinaryFunctions.sortByPrefix(data.contentBody.files)
                            setFiles(data.contentBody.files)
                        } else {
                            setIsFilesFound(false)
                        }
                    } else {
                        setError("No data found.")
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

    const generateBreadcrumbs = (): any => {
        let trimmedUrl = match.url.substr(1)
        let breadcrumbs: string[] = trimmedUrl.split("/")

        return (
            cloudinaryFunctions.generateBreadcrumbs(breadcrumbs, false)
        )
    }

    React.useEffect(() => {
        getFolderContent()

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
        <>
            {match.isExact && <div className="content">
                <h2>{generateBreadcrumbs()}</h2>
                {loading &&
                    <Loading />
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
                {!loading && files &&
                    <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-evenly">
                        {files.map((resource: string, index: number) => {
                            return (
                                <ResourceCard key={index} resource={resource} matchUrl={match.url} index={index} />
                            )
                        })}
                    </Box>
                }

                {!loading && !isSubFoldersFound && !isFilesFound &&
                    <NoContent />
                }

            </div>}

            <Switch>
                <Route path={`${match.path}/resource/:filename`} component={ResourcePage} />
                <Route path={`${match.path}/:dynamicPath`} component={DynamicComponent} />
            </Switch>
        </>
    )
}

export default DynamicComponent