import React, { useState } from 'react'
import useFetch from "../../hooks/useFetch"
import Loading from '../shared/Loading'
import './resourcePage.scss'
import useCloudinaryFunctions from "../../hooks/useMrGFunctions"
import ResourceBadge from './ResourceBadge'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useMrGFunctions from "../../hooks/useMrGFunctions"
import Error from '../shared/Error'
import { Button } from '@material-ui/core'
import GetAppIcon from '@material-ui/icons/GetApp';
import CircularProgress from '@material-ui/core/CircularProgress';

const ResourcePage = ({ match }) => {
    const isCancelled = React.useRef(false)
    const ftpApi = useFetch("ftp")
    const cloudinaryFunctions = useCloudinaryFunctions()
    const [loading, setLoading] = useState<boolean>(false)
    const [carouselLoading, setCarouselLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [siblingResources, setSiblingResources] = useState<any>([])
    const [resourceIndex, setResourceIndex] = useState<number>(0)
    const [isResourceBadgeClicked, setIsResourceBadgeClicked] = useState<boolean>(false)
    const [contentType, setContentType] = useState<string>("")
    const [mediaBlobUrl, setMediaBlobUrl] = useState<any>()
    const [isDownloadInProgress, setIsDownloadInProgress] = useState<boolean>(false)
    const [bytesReceived, setBytesReceived] = useState<number>(0)
    const [bytesToDownload, setBytesToDownload] = useState<number>(0)

    const isMobile = useMediaQuery('(max-width:400px)');
    const isTablet = useMediaQuery('(max-width:600px) and (min-width: 401px)');
    const mrGFunctions = useMrGFunctions()

    const calculateCenterSlidePercentage = (): number => {

        if (isMobile) {
            //mobile
            return 60
        } else if (isTablet) {
            //tablet
            return 42
        } else {
            //pc
            return 32
        }
    }

    // TODO IMPLEMENT THIS IN CUSTOM HOOK
    const getFile = (): void => {
        const url = process.env.PUBLIC_URL || "http://localhost:8080"
        let filePath = match.url.replace("resource/", "")
        let encodedFilePath = filePath.replace(/\//g, "%2F")
        setLoading(true)
        fetch(`${url}/ftp/file/${encodedFilePath}`)
            .then(async (response: any) => {
                if (!isCancelled.current) {
                    for (var pair of response.headers.entries()) {
                        if (response.ok) {
                            if (pair[0] === "content-type") {
                                if (pair[1].includes("application/json")) {
                                    return ({
                                        contentType: pair[1],
                                        contentBody: await response.json()
                                    })
                                } else {
                                    setBytesToDownload(Number(response.headers.get('content-length')));
                                    const reader = response.body.getReader();
                                    let chunks: any = [];
                                    while (true) {
                                        const result = await reader.read();
                                        setIsDownloadInProgress(true)

                                        if (result.done) {
                                            console.log('Fetch complete');
                                            setIsDownloadInProgress(false)
                                            setBytesReceived(0)
                                            setIsResourceBadgeClicked(false)
                                            setLoading(false)
                                            setContentType(pair[1])
                                            // setMediaBlobUrl(URL.createObjectURL(new Blob(chunks) ))
                                            setMediaBlobUrl(URL.createObjectURL(new Blob(chunks, {type: pair[1]})))
                                            console.log(`URL: ${URL.createObjectURL(new Blob(chunks))}`)
                                            let filepathSplit = filePath.split("/")
                                            let filename = filepathSplit[filepathSplit.length - 1]
                                            getSiblingResources(filename)
                                            break;
                                        } else {
                                            chunks.push(result.value);
                                            setBytesReceived(bytesReceived => bytesReceived + result.value.length)
                                        }
                                    }

                                    // let contentBody = await response.blob()

                                    // setLoading(false)
                                    // setContentType(pair[1])
                                    // setMediaBlobUrl(URL.createObjectURL(contentBody))
                                    // console.log(`URL: ${URL.createObjectURL(contentBody)}`)
                                    // let filepathSplit = filePath.split("/")
                                    // let filename = filepathSplit[filepathSplit.length - 1]
                                    // getSiblingResources(filename)
                                    
                                }
                            }
                        } else {
                            console.log(response.status)
                            setError(response.status)
                            setLoading(false)
                        }
                    }
                }
            })

            .catch(err => {
                if (!isCancelled.current) {
                    console.log(err)
                    setError(err.message)
                    setLoading(false)
                }
            });
    }
    // const getFile = (): void => {
    //     let filePath = match.url.replace("resource/", "")
    //     let encodedFilePath = filePath.replace(/\//g, "%2F")
    //     setLoading(true)
    //     ftpApi.get(`file/${encodedFilePath}`)
    //         .then((data: any) => {
    //             if (!isCancelled.current) {
    //                 if (data) {
    //                     setContentType(data.contentType)
    //                     setMediaBlobUrl(URL.createObjectURL(data.contentBody))
    //                     let filepathSplit = filePath.split("/")
    //                     let filename = filepathSplit[filepathSplit.length - 1]
    //                     getSiblingResources(filename)
    //                 }
    //                 setLoading(false)
    //                 setIsResourceBadgeClicked(false)
    //             }
    //         })
    //         .catch((err: Error) => {
    //             console.log("we got an error.")
    //             console.log(err)
    //             setError(err.message)
    //             setLoading(false)
    //         })
    // }

    const getSiblingResources = (filename: string): void => {
        setCarouselLoading(true)
        let encodedMatchUrl = match.url.replace(/\//g, "%2F")
        ftpApi.get(`folder-content/${encodedMatchUrl.replace(`%2Fresource%2F${filename}`, "")}`)
            .then((data: any) => {
                // console.log(`data: ${JSON.stringify(data)}`)
                if (!isCancelled.current) {
                    if (data) {
                        if (data.contentBody.files.length) {
                            data.contentBody.files = cloudinaryFunctions.sortByPrefix(data.contentBody.files)
                            //filter the current video from the siblings list
                            let filteredArray = data.contentBody.files.filter(file => file !== filename)
                            setSiblingResources(filteredArray)

                            //find the index number of the current video
                            data.contentBody.files.forEach((file, index) => {
                                if (file === filename) {
                                    setResourceIndex(index)
                                }
                            })
                        }
                    } else {
                        setError("No data found.")
                    }
                    setCarouselLoading(false)
                }
            })
            .catch((err: Error) => {
                if (!isCancelled.current) {
                    console.log(err)
                    setError(err.message)
                    setCarouselLoading(false)
                }
            })
    }

    const generateBreadcrumbs = (): any => {

        let trimmedUrl = match.url.substr(1).replace(`/resource`, "")
        let breadcrumbs: string[] = trimmedUrl.split("/")

        return (
            cloudinaryFunctions.generateBreadcrumbs(breadcrumbs, true)
        )
    }

    const handleIsResourceBadgeClicked = () => {
        console.log("setIsResourceBadgeClicked(true)")
        setIsResourceBadgeClicked(true)
    };



    //only do this when resource badge is clicked (to reload page)
    React.useEffect(() => {
        if (isResourceBadgeClicked) {
            getFile()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isResourceBadgeClicked]);


    React.useEffect(() => {
        getFile()

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
            {match.isExact &&
                <div className="content">

                    {loading &&
                        <>
                            <h2>{generateBreadcrumbs()}</h2>
                            <Loading
                                isDownloadInProgress={isDownloadInProgress}
                                bytesReceived={bytesReceived}
                                bytesToDownload={bytesToDownload}
                            />
                        </>
                    }

                    {!loading && mrGFunctions.isVideoFormat(contentType.split("/")[1]) &&
                        <>
                            <h2>{generateBreadcrumbs()}</h2>
                            <div className="resource-wrapper">
                                <video
                                    src={mediaBlobUrl}
                                    controls={true}
                                    autoPlay={true}
                                >
                                    Your browser does not support HTML5 video tags.
                                </video>
                            </div>
                        </>
                    }

                    {!loading && mrGFunctions.isAudioFormat(contentType.split("/")[1]) &&
                        <>
                            <h2>{generateBreadcrumbs()}</h2>
                            <div className="resource-wrapper audio">
                                <img alt="placeholder audio" src={require("../../images/Audio-icon.png")} />
                                <audio
                                    src={mediaBlobUrl}
                                    controls={true}
                                    autoPlay={true}
                                >
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        </>
                    }

                    {!loading && mrGFunctions.isImageFormat(contentType.split("/")[1]) &&
                        <>
                            <h2>{generateBreadcrumbs()}</h2>
                            <div className="resource-wrapper">
                                <img src={mediaBlobUrl} alt="mr.g" />
                            </div>
                        </>
                    }

                    {!loading && mrGFunctions.isPDFFormat(contentType.split("/")[1]) &&
                        <>
                            <h2>{generateBreadcrumbs()}</h2>
                            <div className="resource-wrapper">

                                {(isMobile || isTablet) ?
                                    <>
                                        <a href={mediaBlobUrl} download={`${match.url.split("resource/")[1]}`}>
                                            <Button className="download-button" variant="contained">
                                                <span>Download PDF</span>
                                                <GetAppIcon />
                                            </Button>
                                        </a>
                                        <img alt="placeholder pdf" src={require("../../images/PDF-icon.png")} />
                                    </>
                                    :
                                    <object data={mediaBlobUrl} >
                                        Your browser does not support the pdf viewer element.
                                    </object>
                                }
                            </div>
                        </>
                    }

                    {
                        !loading &&
                        !mrGFunctions.isVideoFormat(contentType.split("/")[1]) &&
                        !mrGFunctions.isAudioFormat(contentType.split("/")[1]) &&
                        !mrGFunctions.isImageFormat(contentType.split("/")[1]) &&
                        !mrGFunctions.isPDFFormat(contentType.split("/")[1]) &&
                        <>
                            <h2>{generateBreadcrumbs()}</h2>
                            <div className="resource-wrapper file">
                                <a href={mediaBlobUrl} download={`${match.url.split("resource/")[1]}`}>
                                    <Button className="download-button" variant="contained">
                                        <span>Download File</span>
                                        <GetAppIcon />
                                    </Button>
                                </a>
                                <img alt="placeholder audio" src={require("../../images/Files-icon.png")} />

                            </div>
                        </>
                    }

                    {!carouselLoading && siblingResources &&
                        <Carousel
                            showThumbs={false}
                            selectedItem={resourceIndex}
                            centerMode={true}
                            centerSlidePercentage={calculateCenterSlidePercentage()}
                            infiniteLoop={true}
                            showStatus={false}
                            showIndicators={false}
                            swipeable={false}
                            showArrows={true}
                        >
                            {siblingResources.map((siblingResource, index) => {
                                return (
                                    <ResourceBadge resource={siblingResource} matchUrl={match.url} index={index} key={index} setIsResourceBadgeClicked={handleIsResourceBadgeClicked} />
                                )
                            })}
                        </Carousel>
                    }

                    {carouselLoading &&
                        <div className="carousel-loading-wrapper">
                            <CircularProgress />
                        </div>
                    }



                </div>
            }
        </>
    )
}

export default ResourcePage