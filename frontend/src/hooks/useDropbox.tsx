import { Dropbox } from 'dropbox'

const useDropbox = () => {

    const dbx = new Dropbox({
        accessToken: 'dwDOBbKR8UUAAAAAAAAAAQ5xa9kM8VNuf0kiwNbrC-Esn-YlbcXKOQMybOw2cuGq'
    })

    const getFolderContent = (path: string) => {
        return dbx.filesListFolder({
            path: path
        }).then(res => {
            return (res.result.entries.sort((a, b) => Number(a.name.split("_")[0]) - Number(b.name.split("_")[0])))
        }).catch(error => {
            throw new Error(error);
        })
    };

    const getFile = (path: string) => {
        // console.log(path)
        return dbx.filesGetMetadata({
            path: path
        }).then(res => {
            return (res.result)
        }).catch(error => {
            throw new Error(error);
        })
    };

    const getThumbnails = files => {

        const paths = files.filter(file => file['.tag'] === 'file')
            .map(file => ({
                path: file.path_lower,
                size: 'w480h320'
            }))

        return dbx.filesGetThumbnailBatch({
            entries: paths
        }).then(res => {
            const newStateFiles = [...files]
            res.result.entries.forEach((file: any) => {
                let indexToUpdate = files.findIndex(
                    stateFile => file.metadata.path_lower === stateFile.path_lower
                )
                newStateFiles[indexToUpdate].thumbnail = file.thumbnail
            })
            return newStateFiles
        }).catch(error => {
            throw new Error(error);
        })
    };

    const getContentLink = (path: string) => {
        return dbx.filesGetTemporaryLink({ path: path })
            .then(function (response) {
                return response.result
            })
            .catch(function (error) {
                throw new Error(error);
            });
    }

    return {
        getFolderContent,
        getFile,
        getThumbnails,
        getContentLink
    };
}

export default useDropbox;