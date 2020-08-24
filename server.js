var swig  = require('swig');
const express = require("express");
const socket = require("socket.io");

// App setup
const app = express();
const PORT = 80;

// Static files
app.use('/static',express.static("static"));

app.get('/', (req, res) => {
    var template = swig.compileFile('public/index.html');
    res.send(template());
})

app.get('/device/:deviceId', (req, res) => {
    var template = swig.compileFile('public/device.html');

    // unhash the string deviceId
    var output = template({
        "deviceId": req.params.deviceId
    });
    res.send(output);
})

const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

//Socket setup
const io = socket(server);

io.on("connection", function (socket) {
    var currentRoom;
    
    socket.on("subscribe", function (room) {
        currentRoom = room;
        socket.join(room);
        io.emit("rooms",io.sockets.adapter.rooms);
        console.log("Device join group "+String(room));
    });

    socket.on("message",function (room,data) {
        socket.broadcast.to(room).emit("message",data);
    });

    socket.on("audio",function (room,data) {
        socket.broadcast.to(room).emit("audio",data);
    });

    socket.on("disconnect", (room) => {
        socket.leave(room);
        if(currentRoom != null || currentRoom != undefined){
            var d = {"header":"x000mc","data": {"started": false}};
            socket.broadcast.to(currentRoom).emit("message",d);
        }
        console.log("A device leave the group "+String(currentRoom));
    });

    socket.on("get-rooms", function() {
        io.emit("rooms",io.sockets.adapter.rooms);
    });
});