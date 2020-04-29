import useMrGFunctions from "./useMrGFunctions"

interface Options {
    method: string,
    headers: {},
    body: any
}

const useFetch = (collection: string) => {
    const mrGFunctions = useMrGFunctions()
    const url = process.env.PUBLIC_URL || "http://localhost:8080"
    const stub = `${url}/${collection}`

    const defaultHeader = {
        Accept: "application/json",
        "Content-Type": "application/json"
    };

    const customFetch = async (url, method, body, headers) => {
        const options: Options = {
            method,
            headers,
            body
        };

        if (body) {
            options.body = JSON.stringify(body)
        }


        //TODO need to split response into response type and payload to differentiate between file types and folders
        return fetch(url, options)
            .then(async response => {
                for (var pair of response.headers.entries()) {
                    console.log(`${pair[0]}: ${pair[1]}`)

                    if (pair[0] === "content-type") {
                        if (pair[1].includes("application/json")){
                            return ({
                                contentType: pair[1],
                                contentBody: await response.json()
                            })
                        }else{
                            return ({
                                contentType: pair[1],
                                contentBody: await response.blob()
                            })
                        }
                        
                        // if (mrGFunctions.isVideoFormat(pair[1].split("/")[1]) ||
                        //     mrGFunctions.isImageFormat(pair[1].split("/")[1]) ||
                        //     mrGFunctions.isAudioFormat(pair[1].split("/")[1])    
                        // ) {
                        //     return ({
                        //         contentType: pair[1],
                        //         contentBody: await response.blob()
                        //     })
                        // } else if (mrGFunctions.isPDFFormat(pair[1].split("/")[1])){
                        //     return ({
                        //         contentType: pair[1],
                        //         contentBody: new Blob(
                        //             [await response.blob()], 
                        //             {type: 'application/pdf'})
                        //     })
                        // }else {
                        //     // console.log("else")
                        //     return ({
                        //         contentType: pair[1],
                        //         contentBody: await response.blob()
                        //     })                            
                        // }
                    }
                }
            })

            .catch(err => {
                throw new Error(err);
            });
    };

    const get = id => {
        // console.log(`useFetch get: ${id}`)
        const url = `${stub}${id ? `/${id}` : ""}`;
        return customFetch(url, "GET", null, defaultHeader);
    };

    const post = (body) => {
        if (!body) throw new Error("to make a post you must provide a body");
        return customFetch(stub, "POST", body, defaultHeader);
    };

    const put = (id, body) => {
        if (!id || !body)
            throw new Error("to make a put you must provide the id and the   body");
        const url = `${stub}/${id}`;
        return customFetch(url, "PUT", body, defaultHeader);
    };

    const del = (id = false) => {
        if (!id)
            throw new Error("to make a delete you must provide the id and the body");
        const url = `${stub}/${id}`;
        return customFetch(url, "DELETE", null, defaultHeader);
    };

    return {
        get,
        post,
        put,
        del
    };
};
export default useFetch;