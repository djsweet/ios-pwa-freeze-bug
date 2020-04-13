self.addEventListener("install", (event) => {
    event.waitUntil((async () => {
        console.log("installed service worker");
    })());
});

let screenOffInterval;

self.addEventListener("message", async (event) => {
    const eventNow = Date.now();
    console.log("Got a message", eventNow);
    if (event.data === "screenoff") {
        if (screenOffInterval !== undefined) {
            clearInterval(screenOffInterval);
        }
        screenOffInterval = setInterval(() => {
            console.log("Screen is off", Date.now() - eventNow);
        }, 16);
    } else if (event.data === "screenon" && screenOffInterval) {
        clearInterval(screenOffInterval);
        screenOffInterval = undefined;
    }
});

setInterval(() => {
    console.log(new Date());
}, 1000);
