import { Request, Response } from 'express';
import { FtpController } from '../controllers/ftp.controller';

const router = require('express').Router();
var Client = require('ftp');
require('dotenv').config();

let ftpHost = process.env.FTP_HOST
let ftpUsername = process.env.FTP_USERNAME
let ftpPassword = process.env.FTP_PASSWORD
let ftpRootFolder = process.env.FTP_ROOT_FOLDER_NAME

router.get('/folder-content/:folderName', async (request: Request, response: Response) => {
    try {
        response.set({
            'Content-Type': `application/json`,
        })
        FtpController.GetFolderContent(request.params.folderName)
            .then(data => {
                response.json(data);
                response.end();
            }).catch(err => {
                console.error("Error: ", err)
                response.status(500).send(err);
                response.end();
                
            })
    } catch (err) {
        response.status(500).send(err);
        response.end();
        console.error("Error: ", err)
    }
});

router.get('/file/:path', async (request: Request, response: Response) => {
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
        // console.log(`content-type: image/${fileExtension}`)
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
        // console.log(`content-type: audio/${fileExtension}`)
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
        // console.log(`content-type: video/${fileExtension}`)
        response.set({
            'Content-Type': `video/${fileExtension}`,
        })
    } else if (fileExtension === "pdf") {
        // console.log(`content-type: video/${fileExtension}`)
        response.set({
            'Content-Type': `application/${fileExtension}`,
        })
    } else {
        // console.log(`content-type: application/${fileExtension}`)
        response.set({
            'Content-Type': `application/octet-stream`,
        })
    }

    try {
        client.connect({
            host: ftpHost,
            user: ftpUsername,
            password: ftpPassword,
            connTimeout: 60000,
            pasvTimeout: 60000,
        });
    } catch (err) {
        console.error("Error: ", err)
    }

    client.on('ready', function () {
        client.get(`/${ftpRootFolder}${request.params.path}`, function (error, stream) {
            if (error) {
                client.end();
                response.status(500).send(error);
                response.end;
            }

            if (stream) {
                stream.once('close', () => {
                    response.end()
                    client.end();
                });
                stream.pipe(response);
            } else {
                console.log("NO STREAM FOUND")
                client.end();
                response.status(500).send(error);
                response.end();
            }
        });
    });

    client.on('error', (error: any) => {
        console.log(`ERROR (ftp route): ${error}`);
        client.end();
        response.status(500).send(error);
        response.end();
    });
});

export default router;