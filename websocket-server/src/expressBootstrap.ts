import * as express from "express";
import * as http from "http";
import * as url from "url";
import WebSocketServer from "./webSocketServer";

const app = express();
app.use((req, resp) => {
    resp.sendFile("exec.html", { root: __dirname });
    //resp.send({ msg: "hello" });
});

const httpServer = http.createServer(app);
WebSocketServer.main(httpServer);

httpServer.listen(8080, () => {
    console.log("Listening on %d", httpServer.address().port);
});