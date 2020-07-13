import { Request, Response } from 'express';
import { FtpController } from '../controllers/ftp.controller';

const router = require('express').Router();
var Client = require('ftp');
require('dotenv').config();
var promiseRetry = require('promise-retry');

let ftpHost = process.env.FTP_HOST
let ftpUsername = process.env.FTP_USERNAME
let ftpPassword = process.env.FTP_PASSWORD
let ftpRootFolder = process.env.FTP_ROOT_FOLDER_NAME


router.get('/folder-content/:folderName', async (request: Request, response: Response) => {
    promiseRetry(function (retry, number) {
        
        if(number > 1){
            console.log('attempt', number);
        }
        

        return FtpController.GetFolderContent(request.params.folderName)
            .catch(function (error) {
                if (error.code === 'ETIMEDOUT') {
                    console.log("ETIMEDOUT - retry")
                    retry(error);
                }
                throw error
            });
    }).then(function (data) {
        response.json(data);
        response.end();
    }, function (error) {
        console.error("Error 1: ", JSON.stringify(error))
        response.status(500).send(error);
        response.end();
    });
});

router.get('/file/:path', async (request: Request, response: Response) => {

    promiseRetry(function (retry, number) {
        if(number > 1){
            console.log('attempt (get file)', number);
        }

        return GetFile()
            .catch(function (error) {
                if (error.code === 'ETIMEDOUT') {
                    console.log("ETIMEDOUT (get file) - retry")
                    retry(error);
                }
                throw error
            });
    }).then(function (data) {
        response.end();
    }, function (error) {
        console.error("Error 1: ", JSON.stringify(error))
        response.status(500).send(error);
        response.end();
    });

    async function GetFile(): Promise<any> {
        return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {

            let pathSplit = request.params.path.split("/")
            let filenameSplit = pathSplit[pathSplit.length - 1].split(".")
            let fileExtension = filenameSplit[1]

            var client = new Client();

            if (fileExtension === "gif" ||
                fileExtension === "bmp" ||
                fileExtension === "jpg" ||
                fileExtension === "jpeg" ||
                fileExtension === "png" ||
                fileExtension === "svg") {
                response.set({
                    'Content-Type': `image/${fileExtension}`,
                })
            } else if (fileExtension === "aac" ||
                fileExtension === "aiff" ||
                fileExtension === "amr" ||
                fileExtension === "flac" ||
                fileExtension === "m4a" ||
                fileExtension === "mp3" ||
                fileExtension === "ogg" ||
                fileExtension === "ogg" ||
                fileExtension === "opus" ||
                fileExtension === "wav") {
                response.set({
                    'Content-Type': `audio/${fileExtension}`,
                })
            } else if (fileExtension === "avi" ||
                fileExtension === "mov" ||
                fileExtension === "swf" ||
                fileExtension === "mp4" ||
                fileExtension === "mpeg" ||
                fileExtension === "webm" ||
                fileExtension === "wmv") {
                response.set({
                    'Content-Type': `video/${fileExtension}`,
                })
            } else if (fileExtension === "pdf") {
                response.set({
                    'Content-Type': `application/${fileExtension}`,
                })
            } else {
                response.set({
                    'Content-Type': `application/octet-stream`,
                })
            }

            client.connect({
                host: ftpHost,
                user: ftpUsername,
                password: ftpPassword
            });

            client.on('ready', function () {
                client.size(`/${ftpRootFolder}${request.params.path}`, function (error, bytes) {
                    client.get(`/${ftpRootFolder}${request.params.path}`, function (error, stream) {
                        
                        response.set({
                            'content-length': bytes,
                        })
                        if (stream) {
                            stream.once('close', () => {
                                resolve(stream)
                                client.end();
                            });
                            stream.pipe(response);
                        } else {
                            console.log("NO STREAM FOUND")
                        }
                    });
                });
            });

            client.on('error', (error: any) => {
                client.end();

                if (error.code) {
                    reject(error)
                }
            });
        })
    }
});

export default router;