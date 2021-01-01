import React, { useState } from 'react'
import useFetch from "../../hooks/useFetch"
import Loading from '../shared/Loading'
import './resourceComponent.scss'
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
import useDropbox from "../../hooks/useDropbox"
import BreadCrumbs from '../shared/BreadCrumbs'
import MenuBar from '../shared/MenuBar'

interface InputProps {
    file: any,
    allFilesInFolder: any[]
    setCurrentPath: (path: string) => void
}

const ResourceComponent = (props: InputProps) => {
    const isCancelled = React.useRef(false)
    // const ftpApi = useFetch("ftp")
    // const [file, setFile] = useState<any>(null)
    const [currentPath, setCurrentPath] = useState<string>("")
    const [contentLink, setContentLink] = useState<string>("")


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
    const dropBox = useDropbox();

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

    React.useEffect(() => {
        dropBox.getContentLink(props.file.path_lower).then((res: any) => {
            // console.log(res)
            setContentLink(res.link)
        })

        // console.log(`all files: ${JSON.stringify(props.allFilesInFolder)}`)
        
        return () => {
            isCancelled.current = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, []);

    return (
        <>
            {/* <div className="content"> */}
            {/* <p>{JSON.stringify(props.file)}</p> */}

                {mrGFunctions.isVideoFormat(props.file.name.split(".")[1]) &&
                    <>
                        <div className="resource-wrapper">
                            <video
                                src={contentLink}
                                controls={true}
                                autoPlay={true}
                            >
                                Your browser does not support HTML5 video tags.
                                </video>
                        </div>
                    </>
                }

                {mrGFunctions.isAudioFormat(props.file.name.split(".")[1]) &&
                    <>
                        <div className="resource-wrapper audio">
                            <img alt="placeholder audio" src={require("../../images/Audio-icon.png")} />
                            <audio
                                src={contentLink}
                                controls={true}
                                autoPlay={true}
                            >
                                Your browser does not support the audio element.
                                </audio>
                        </div>
                    </>
                }

                {mrGFunctions.isImageFormat(props.file.name.split(".")[1]) &&
                    <>
                        
                        <div className="resource-wrapper">
                            <img src={contentLink} alt="mr.g" />
                        </div>
                    </>
                }

                {mrGFunctions.isPDFFormat(props.file.name.split(".")[1]) &&
                    <>
                        <div className="resource-wrapper">

                            {(isMobile || isTablet) ?
                                <>
                                    <a href={contentLink} download={contentLink}>
                                        <Button className="download-button" variant="contained">
                                            <span>Download PDF</span>
                                            <GetAppIcon />
                                        </Button>
                                    </a>
                                    <img alt="placeholder pdf" src={require("../../images/PDF-icon.png")} />
                                </>
                                :
                                <object data={contentLink} >
                                    Your browser does not support the pdf viewer element.
                                    </object>
                            }
                        </div>
                    </>
                }

                {
                    !mrGFunctions.isVideoFormat(props.file.name.split(".")[1]) &&
                    !mrGFunctions.isAudioFormat(props.file.name.split(".")[1]) &&
                    !mrGFunctions.isImageFormat(props.file.name.split(".")[1]) &&
                    !mrGFunctions.isPDFFormat(props.file.name.split(".")[1]) &&
                    <>
                        <div className="resource-wrapper file">
                            <a href={contentLink} download={contentLink}>
                                <Button className="download-button" variant="contained">
                                    <span>Download File</span>
                                    <GetAppIcon />
                                </Button>
                            </a>
                            <img alt="placeholder audio" src={require("../../images/Files-icon.png")} />

                        </div>
                    </>
                }

                {!carouselLoading && !loading && 
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
                        {props.allFilesInFolder.map((siblingResource, index) => {
                            return (
                                <ResourceBadge 
                                resource={siblingResource} 
                                index={index}
                                key={index} 
                                setCurrentPath={props.setCurrentPath}
                                // setIsResourceBadgeClicked={handleIsResourceBadgeClicked} 
                                />
                            )
                        })}
                    </Carousel>
                }

                {/* {carouselLoading &&
                    <div className="carousel-loading-wrapper">
                        <CircularProgress />
                    </div>
                } */}



            {/* </div> */}
            {/* } */}
        </>
    )
}

export default ResourceComponent