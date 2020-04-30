export namespace FtpController {

    var Client = require('ftp');

    export async function GetFolderContent(folderName: string): Promise<any> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {

            var client = new Client();

            try {
                client.connect({
                    host: "home179144670.1and1-data.host",
                    user: "u41489462-mrg",
                    password: "thanosmaths"
                });
            } catch (err) {
                console.error("Error: ", err)
            }

            let subFolders: string[] = []
            let files: string[] = []

            client.on('ready', function () {
                client.list(`/MrGMathsContent${folderName}`, function (error, list) {
                    if (error) {
                        console.log(error)
                        client.end();
                        reject(error)
                    }

                    if (list) {
                        list.forEach(folderContentItem => {
                            if (folderContentItem.type === "-") {
                                files.push(folderContentItem.name)
                            } else if (folderContentItem.type === "d") {
                                if (folderContentItem.name.substring(0, 1) !== ".") {
                                    subFolders.push(folderContentItem.name)
                                }
                            }
                        });
                    }
                    client.end();
                    resolve({ subFolders: subFolders, files: files })

                });
            });
        });
    }
}