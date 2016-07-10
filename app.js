/**
 * Created by frank25184 on 7/7/16.
 */
var express = require('express'),
app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    usernames = [];
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
server.listen(process.env.PORT || 3000);

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection',function(socket){
//send message
    socket.on('new user',function(data,callback){
        if(usernames.indexOf(data) != -1){ return false;//callback(false)
             }
        else{
            //callback(true);
            socket.username = data;
            usernames.push(socket.username);
            updateUsernames();
            return;
        }
    });


    //update usernames
    function updateUsernames(){
        io.sockets.emit('usernames',usernames);
    }

    socket.on('send message',function(data){
        io.sockets.emit('new message',{msg:data,user:socket.username});
    });

    //disconnect
    socket.on('disconnect',function(data){
        if(!socket.username) return;
        usernames.splice(usernames.indexOf(socket.username),1);
        updateUsernames();
    });
});