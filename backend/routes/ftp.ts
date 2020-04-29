import { Request, Response } from 'express';
import { FtpController } from '../controllers/ftp.controller';

const router = require('express').Router();
var Client = require('ftp');


router.get('/folder-content/:folderName', async (request: Request, response: Response) => {
    // console.log(`foldername: ${request.params.folderName}`)
    try {
        response.set({
            'Content-Type': `application/json`,
        })
        const result = await FtpController.GetFolderContent(request.params.folderName);
        // console.log(`result: ${JSON.stringify(result)}`)
        response.json(result);
        response.end();
    } catch (err) {
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
});

router.get('/file/:path', async (request: Request, response: Response) => {

    // console.log(`/content${request.params.path}`)

    let pathSplit = request.params.path.split("/")
    let filenameSplit = pathSplit[pathSplit.length -1].split(".")
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
    } else {
        // console.log(`content-type: application/${fileExtension}`)
        response.set({
            'Content-Type': `application/octet-stream`,
        })
    }

    try {
        client.connect({
            host: "home179144670.1and1-data.host",
            user: "u41489462-mrg",
            password: "thanosmaths"
        });
    } catch (err) {
        console.error("Error: ", err)
    }

    client.on('ready', function () {
        client.get(`/content${request.params.path}`, function (error, stream) {
            if (error) {
                client.end();
                response.status(500);
                response.end;
            }

            if (stream) {
                stream.once('close', () => {
                    // console.log("stream closed")
                    response.end()
                    client.end();
                });
                stream.pipe(response);
            } else {
                console.log("NO STREAM FOUND")
                client.end();
                response.status(500);
                response.end;
            }
        });
    });
});

export default router;