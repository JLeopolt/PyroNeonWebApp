export default class FetchService {
    constructor() {}

    async performPostHttpRequest(fetchLink, headers, body) {
        if(!fetchLink || !headers || !body) {
            throw new Error("One or more POST request parameters was not passed.");
        }
        try {
            const rawResponse = await fetch(fetchLink, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body)
            });
            const content = await rawResponse.json();
            return content;
        }
        catch(err) {
            console.error(`Error at fetch POST: ${err}`);
            return {"status":"503", "statusMessage":"Bad Gateway", "errorMessage":"Could not connect to PyroNeonAuth server."};
        }
    }

    async performGetHttpRequest(fetchLink, headers, query=null) {
        if(!fetchLink || !headers) {
            throw new Error("One or more GET request parameters was not passed.");
        }
        try {
            const rawResponse = await fetch(fetchLink, {
                method: "GET",
                headers: headers,
                query: (query != null) ? query : ""
            });
            const content = await rawResponse.json();
            return content;
        }
        catch(err) {
            console.error(`Error at fetch GET: ${err}`);
            return {"status":"503", "statusMessage":"Bad Gateway", "errorMessage":"Could not connect to PyroNeonAuth server."};
        }
    }
}
