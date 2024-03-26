const statusDialog = document.getElementById("statusDialog");
// Send the post request and get a JSON String as a response.
const response = await getServerStatus("scraps.pyroneon.net");
console.log(response);

// if 'status' is true, the server is online. Otherwise, offline.
if(response['status'] === true){
  const players = response['players'];
  statusDialog.textContent = "Server is online! " + players['online'] + "/" + players['max'] + " currently playing.";
}
else{
  statusDialog.textContent = "Server is currently offline. Check the Discord for more details.";
}


// accesses mc-api.net to get the status of the minecraft server in a useful JSON format.
async function getServerStatus(ip) {
    const headers = {
        // "Content-Type": "application/json",
        // "Content-Type": "text/plain; charset=utf-8",
        // "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Credentials": "true",
        // "Access-Control-Allow-Methods": "*",
        // "Access-Control-Allow-Headers": "*"
    };
    const endpointUrl = "https://mc-api.net/v3/server/ping/" + ip;
    try {
        const rawResponse = await fetch(endpointUrl, {
            method: "GET",
            headers: headers
        });
        const content = await rawResponse.json();
        return content;
    }
    catch(err) {
        console.error(`Error at fetch GET: ${err}`);
        console.log("[mcServerStatus.js] Could not connect to mc-api.net.");
    }
}
