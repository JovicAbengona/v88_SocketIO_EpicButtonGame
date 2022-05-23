const express = require("express");
const app     = express();
const server  = app.listen(8080, () => { console.log("Listening on 8080"); });
const io      = require('socket.io')(server);

app.use(express.static(__dirname + "/static"));
app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs');

app.get("/", (request, response) => {
    response.render("index");
});

let counter = 0;
let word    = "time";
let message = "The button hasn't been pushed.";

io.on('connection', (socket) => {
    socket.on("epic_button_clicked", function(){
        counter += 1;
        if(counter > 1)
            word = "times";
  
        message = `The button has been pushed ${counter} ${word}`;

        ioEmit(message);
    });

    socket.on("reset", function(){
        counter = 0;
        word    = "time";
        message = "The button hasn't been pushed.";

        ioEmit(message);
    });

    ioEmit(message);
});

function ioEmit(message){
    io.emit("update_count", { message: message });
}
