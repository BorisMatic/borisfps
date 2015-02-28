var socket = io();
socket.on('chat message', function(msg){
              // ett2=msg;
});
socket.on('position', function(msg){
    sphereBody.position.set(msg.position.x,msg.position.y,msg.position.z);
    myName=msg.name;
});

socket.on('addPrev', function(msg){
    players.addPreviousPlayers(msg);
});

socket.on('addPlayer', function(msg){
    players.addNewPlayer(msg);

});

socket.on('movedl', function(msg){
    players.positionPlayers(msg);
});

socket.on('out', function(msg){
    players.removePlayer(msg);
});


