import { Dropbox } from 'dropbox'

const useDropbox = () => {

    const dbx = new Dropbox({
        accessToken: 'dwDOBbKR8UUAAAAAAAAAAQ5xa9kM8VNuf0kiwNbrC-Esn-YlbcXKOQMybOw2cuGq'
    })

    const getFolderContent = (path: string) => {
        console.log(path)
        return dbx.filesListFolder({
            path: path
        }).then(res => {
            // if (type === "file") {
            //     return (res.result.entries.filter(entry => entry['.tag'] === "file").sort((a, b) => Number(a.name.split("_")[0]) - Number(b.name.split("_")[0])))
            // } else if (type === "folder") {
            //     return (res.result.entries.filter(entry => entry['.tag'] === "folder").sort((a, b) => Number(a.name.split("_")[0]) - Number(b.name.split("_")[0])))
            // } else {
            //     return (res.result.entries.sort((a, b) => Number(a.name.split("_")[0]) - Number(b.name.split("_")[0])))
            // }

            return (res.result.entries.sort((a, b) => Number(a.name.split("_")[0]) - Number(b.name.split("_")[0])))

        }).catch(error => {
            throw new Error(error);
        })
    };

    return {
        getFolderContent
    };
}

export default useDropbox;