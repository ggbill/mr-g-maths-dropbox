import React from 'react'
import { Link } from "react-router-dom"
import HomeIcon from '@material-ui/icons/Home'

const useMrGFuctions = () => {

    const generateThumbnailUrl = (videoUrl: string): string => {
        return `${videoUrl.substring(0, videoUrl.lastIndexOf(".") + 1)}jpg`
    }

    const isVideoFormat = (format: string): boolean => {
        if (format === "avi" ||
            format === "mov" ||
            format === "swf" ||
            format === "mp4" ||
            format === "mpeg" ||
            format === "webm" ||
            format === "wmv" ) {
            return true
        } else {
            return false
        }
    }

    const isAudioFormat = (format: string): boolean => {
        if (format === "aac" ||
            format === "aiff" ||
            format === "amr" ||
            format === "flac" ||
            format === "m4a" ||
            format === "mp3" ||
            format === "ogg" ||
            format === "opus" ||
            format === "wav") {
            return true
        } else {
            return false
        }
    }

    const isImageFormat = (format: string): boolean => {
        if (format === "gif" ||
            format === "bmp" ||
            format === "jpg" ||
            format === "jpeg" ||
            format === "png" ||
            format === "svg") {
            return true
        } else {
            return false
        }
    }

    const isPDFFormat = (format: string): boolean => {
        if (format === "pdf") {
            return true
        } else {
            return false
        }
    }

    const cleanFolderName = (folderName: string): string => {
        let folderNameSplit = folderName.split("_");
        folderNameSplit.splice(0, 1) //remove the first part

        let cleanFolderName: string = ""
        folderNameSplit.map((folderNameSplitInstance, index) => {
            if (index === folderNameSplit.length - 1){
                return(cleanFolderName += `${folderNameSplitInstance}`)
            }else{
                return(cleanFolderName += `${folderNameSplitInstance} `)
            }
        })

        return cleanFolderName
    }

    const cleanFilename = (filename: string): string => {
        // console.log(`filename: ${filename}`)
        let fileNameSplit = filename.split("_");

        if (fileNameSplit.length > 1){
            fileNameSplit.splice(0, 1) //remove the first part
        }

        let extensionSplit = fileNameSplit[fileNameSplit.length-1].split(".")
        fileNameSplit[fileNameSplit.length-1] = extensionSplit[0]

        let cleanedFileName = ""

        fileNameSplit.forEach(element => {
            cleanedFileName += ` ${element}`
        });

        return cleanedFileName
    }

    // const generateBreadcrumbs = (breadcrumbs: string[], isFinalEntryFileName: boolean): any => {

    //     if (isFinalEntryFileName){
    //         breadcrumbs[breadcrumbs.length -1] = cleanFilename(breadcrumbs[breadcrumbs.length -1])
    //     }

    //     return (
    //         <div className="breadcrumb-wrapper">
    //             <span className="home-icon-wrapper"><Link to="/"><HomeIcon /></Link> / </span>

    //             {breadcrumbs.map((breadcrumb, index) => {
    //                 if (index === breadcrumbs.length - 1) {
    //                     if (isFinalEntryFileName){
    //                         return (
    //                             <span key={index}>{breadcrumb}</span>
    //                         )
    //                     }else{
    //                         return (
    //                             <span key={index}>{cleanFolderName(breadcrumb)}</span>
    //                         )
    //                     }
    //                 } else {
    //                     let breadcrumbLink = "/"
    //                     breadcrumbs.forEach((sub_breadcrumb, sub_index) => {
    //                         if (sub_index < index) {
    //                             breadcrumbLink += `${sub_breadcrumb}/`
    //                         } else if (sub_index === index) {
    //                             breadcrumbLink += `${sub_breadcrumb}`
    //                         }

    //                     });

    //                     return (
    //                         <span key={index}><Link to={breadcrumbLink}>{<span key={index}>{cleanFolderName(breadcrumb)}</span>}</Link> / </span>
    //                     )
    //                 }
    //             })}
    //         </div>
    //     )
    // }

    const sortByPrefix = (resourceList: any[]): any[] => {
        resourceList.sort((a, b) => {
            return (a.split("_")[0] < b.split("_")[0] ? -1 : 1)
        })

        return resourceList
    }

    return {
        generateThumbnailUrl,
        isAudioFormat,
        isVideoFormat,
        isImageFormat,
        isPDFFormat,
        // generateBreadcrumbs,
        sortByPrefix,
        cleanFolderName,
        cleanFilename
    };
};
export default useMrGFuctions;