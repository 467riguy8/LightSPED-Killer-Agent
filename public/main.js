async function init() {
    try {
        const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
        const wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";

        if (await connection.getTransport() !== "/epoxy/index.mjs") {
            await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
            console.log("Using websocket transport. Wisp URL is: " + wispUrl);
        }


    } catch (err) {
        console.error("An error occurred while setting up baremux:", err);
    }


    try {
        await navigator.serviceWorker.register("/sw.js");
        console.log("Registering service worker...");
    } catch (err) {
        throw new Error(err)
    }
}
const scramjet = new ScramjetController({
    prefix: "/scram/service/",
    files: {
        wasm: "/scram/scramjet.wasm.wasm",
        worker: "/scram/scramjet.worker.js",
        client: "/scram/scramjet.client.js",
        shared: "/scram/scramjet.shared.js",
        sync: "/scram/scramjet.sync.js"
    }
});
window.sj = scramjet;
scramjet.init();
if (!navigator.serviceWorker && !window.location.pathname.includes("srcdocs")) {
    navigator.serviceWorker.register("sw.js").then(() => {
        console.log("Scramjet service worker registered.");
    });
}

init();