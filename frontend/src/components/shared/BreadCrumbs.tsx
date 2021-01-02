import React from 'react'
import './breadCrumbs.scss';
import useMrGFuctions from "../../hooks/useMrGFunctions"
import { Link } from "react-router-dom"
import HomeIcon from '@material-ui/icons/Home'

interface InputProps {
    breadCrumbs: string[],
    isFinalEntryFileName: boolean,
    setCurrentPath: (path: string) => void,
}

const BreadCrumbs = (props: InputProps) => {

    const mrGFunctions = useMrGFuctions()

    const generateBreadcrumbs = (breadcrumbs: string[], isFinalEntryFileName: boolean): any => {

        // if (isFinalEntryFileName){
        //     breadcrumbs[breadcrumbs.length -1] = mrGFunctions.cleanFilename(breadcrumbs[breadcrumbs.length -1])
        // }

        props.breadCrumbs.forEach(breadcrumb => {
            breadcrumb = mrGFunctions.cleanFilename(breadcrumb)
        });

        return (
            <div className="breadcrumb-wrapper">
                <span className="home-icon-wrapper"><HomeIcon onClick={() => props.setCurrentPath("")}/>&nbsp;/&nbsp;</span>

                {breadcrumbs.map((breadcrumb, index) => {
                    if (index === breadcrumbs.length - 1) {
                        if (isFinalEntryFileName){
                            return (
                                <span key={index}>{mrGFunctions.cleanFolderName(breadcrumb)}</span>
                            )
                        }else{
                            return (
                                <span key={index}>{mrGFunctions.cleanFolderName(breadcrumb)}</span>
                            )
                        }
                    } else {
                        let breadcrumbLink = "/"
                        breadcrumbs.forEach((sub_breadcrumb, sub_index) => {
                            if (sub_index < index) {
                                breadcrumbLink += `${sub_breadcrumb}/`
                            } else if (sub_index === index) {
                                breadcrumbLink += `${sub_breadcrumb}`
                            }

                        });

                        return (
                            <span key={index} onClick={() => props.setCurrentPath(breadcrumbLink)}><span className="non-last-breadcrumb">{mrGFunctions.cleanFolderName(breadcrumb)}</span> / </span>
                        )
                    }
                })}
            </div>
        )
    }

    return (
        <>
            {generateBreadcrumbs(props.breadCrumbs, props.isFinalEntryFileName)}
        </>
    )
}

export default BreadCrumbs