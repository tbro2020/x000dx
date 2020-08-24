var marker = new mapboxgl.Marker();

var interval;
var timer = 0;
var counter = document.getElementById("counter");

const socket = io('http://localhost');
socket.on('connect', function(){
    socket.emit("subscribe",deviceId);
    console.log("Socket connection");
    socket.emit("message",deviceId,"x000pw");
});

socket.on("message",function(response){
    switch (response.header) {
        case "x000pw":
            var deviceInfo = document.getElementById("device-info");
            deviceInfo.innerHTML = "";

            var ul = document.createElement('ul');
            for(var k in response.data){
                var li = document.createElement('li');
                var key = document.createElement('b');
                var val = document.createElement('small');

                key.innerText = k+" : ";
                val.innerText = response.data[k];

                li.appendChild(key);
                li.appendChild(val);
                ul.appendChild(li);
            }
            deviceInfo.innerHTML = ul.innerHTML;
            break;

        case "x000lm":
            marker.setLngLat([response.data.longitude, response.data.latitude]);
            marker.addTo(map);
            break;

        case "x000mc":
            switch(response.data.started){
                case true:
                    counter.innerHTML = String(timer)+"s";
                    interval = setInterval(function(){
                        timer++;
                        counter.innerHTML = String(timer)+"s";
                    },1000);
                    break;
                case false:
                    clearInterval(interval);
                    break;
            }
            break;

        default:
            console.log(data);
            break;
    }
});

var player = new PCMPlayer({
    encoding: '16bitInt',
    channels: 1,
    sampleRate: 8000,
    flushingTime: 500, // default 2000 
});

socket.on("audio",function(data){
    var data = new Uint16Array(data);
    if(player == undefined) return;
    player.feed(data);
});

document.getElementById("x000pw-btn").onclick = function(){
    socket.emit("message",deviceId,"x000pw");
};

document.getElementById("x000lm-btn").onclick = function(){
    socket.emit("message",deviceId,"x000lm");
};

document.getElementById("x000mc-btn").onclick = function(){
    socket.emit("message",deviceId,"x000mc");
};

document.getElementById("_x000mc-btn").onclick = function(){
    socket.emit("message",deviceId,"_x000mc");
}