const express = require("express");
const app = express();
const server = app.listen(8080, function(){
    console.log("Listening on 8080");
});
const io = require('socket.io')(server);
app.use(express.static(__dirname + "/static"));
app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs');

app.get("/", (request, response) => {
    response.render("index");
});

let counter = 0;
let word = "time";

io.on('connection', (socket) => {
    socket.on("epic_button_clicked", function(){
        counter += 1;
        if(counter > 1)
            word = "times";
        ioEmit(counter, word);
    });

    socket.on("reset", function(){
        counter = 0;
        word = "time";
        ioEmit(counter, word);
    });

    ioEmit(counter, word);
});

function ioEmit(count, word){
    io.emit("update_count", {count: count, word: word});
}
