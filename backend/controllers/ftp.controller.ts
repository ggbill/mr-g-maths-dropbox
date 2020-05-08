export namespace FtpController {

    var Client = require('ftp');
    require('dotenv').config();

    let ftpHost = process.env.FTP_HOST
    let ftpUsername = process.env.FTP_USERNAME
    let ftpPassword = process.env.FTP_PASSWORD
    let ftpRootFolder = process.env.FTP_ROOT_FOLDER_NAME

    export async function GetFolderContent(folderName: string): Promise<any> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {

            var client = new Client();

            client.connect({
                host: ftpHost,
                user: ftpUsername,
                password: ftpPassword
            });

            let subFolders: string[] = []
            let files: string[] = []

            client.on('ready', function () {
                client.list(`/${ftpRootFolder}${folderName}`, function (error, list) {
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

            client.on('error', (error: any) => {
                client.end();

                if (error.code){
                    reject(error)
                }              
            });
        });
    }
}