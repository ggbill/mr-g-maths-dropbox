const useMrGFuctions = () => {

    const generateThumbnailUrl = (videoUrl: string): string => {
        return `${videoUrl.substring(0, videoUrl.lastIndexOf(".") + 1)}jpg`
    }

    const isVideoFormat = (format: string): boolean => {
        let formatLower = format.toLowerCase();
        if (formatLower === "avi" ||
            formatLower === "mov" ||
            formatLower === "swf" ||
            formatLower === "mp4" ||
            formatLower === "mpeg" ||
            formatLower === "webm" ||
            formatLower === "wmv") {
            return true
        } else {
            return false
        }
    }

    const isAudioFormat = (format: string): boolean => {
        let formatLower = format.toLowerCase();
        if (formatLower === "aac" ||
            formatLower === "aiff" ||
            formatLower === "amr" ||
            formatLower === "flac" ||
            formatLower === "m4a" ||
            formatLower === "mp3" ||
            formatLower === "ogg" ||
            formatLower === "opus" ||
            formatLower === "wav") {
            return true
        } else {
            return false
        }
    }

    const isImageFormat = (format: string): boolean => {
        let formatLower = format.toLowerCase();
        if (formatLower === "gif" ||
            formatLower === "bmp" ||
            formatLower === "jpg" ||
            formatLower === "jpeg" ||
            formatLower === "png" ||
            formatLower === "svg") {
            return true
        } else {
            return false
        }
    }

    const isPDFFormat = (format: string): boolean => {
        let formatLower = format.toLowerCase();
        if (formatLower === "pdf") {
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
            if (index === folderNameSplit.length - 1) {
                return (cleanFolderName += `${folderNameSplitInstance}`)
            } else {
                return (cleanFolderName += `${folderNameSplitInstance} `)
            }
        })

        return cleanFolderName
    }

    const cleanFileName = (filename: string): string => {
        // console.log(`filename: ${filename}`)
        let fileNameSplit = filename.split("_");

        if (fileNameSplit.length > 1) {
            fileNameSplit.splice(0, 1) //remove the first part
        }

        let extensionSplit = fileNameSplit[fileNameSplit.length - 1].split(".")
        fileNameSplit[fileNameSplit.length - 1] = extensionSplit[0]

        let cleanedFileName = ""

        fileNameSplit.forEach(element => {
            cleanedFileName += ` ${element}`
        });

        return cleanedFileName
    }

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
        sortByPrefix,
        cleanFolderName,
        cleanFileName
    };
};
export default useMrGFuctions;