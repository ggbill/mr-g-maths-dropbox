interface Options {
    method: string,
    headers: {},
    body: any
}

const useFetch = (collection: string) => {
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

        return fetch(url, options)
            .then(async (response: any) => {
                for (var pair of response.headers.entries()) {
                    // console.log(`${pair[0]}: ${pair[1]}`)

                    if (response.ok) {
                        if (pair[0] === "content-type") {
                            if (pair[1].includes("application/json")) {
                                return ({
                                    contentType: pair[1],
                                    contentBody: await response.json()
                                })
                            } else {

                                const total = Number(response.headers.get('content-length'));

                                const reader = response.body.getReader();
                                let bytesReceived = 0;
                                let chunks: any = [];
                                while (true) {
                                    const result = await reader.read();
                                    if (result.done) {
                                        console.log('Fetch complete');

                                        return ({
                                            contentType: pair[1],
                                            contentBody: new Blob(chunks)
                                        })
                                    }
                                    chunks.push(result.value);
                                    bytesReceived += result.value.length;
                                    // console.log('Received', bytesReceived, 'bytes of data so far');
                                }
                            }
                        }
                    } else {
                        throw new Error(response.statusText);
                    }
                }
            })

            .catch(err => {
                throw new Error(err);
            });
    };

    const get = id => {
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