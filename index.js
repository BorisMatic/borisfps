var express = require('express');
var app=express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var positions =[{x:0,y:1,z:8},{x:6.92,y:1,z:4},{x:6.92,y:1,z:-4},{x:0,y:1,z:-8},{x:-6.92,y:1,z:-4},{x:-6.92,y:1,z:4}];
var clients =[];

app.use(express.static(__dirname + '/static'));

//http.use(app.static(__dirname + '/static'));
var counter = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');

 // res.use(__dirname + '/js/three.min.js');
});

io.on('connection', function(socket){
	console.log('user connected');
	clients[counter]=new Players(socket.id,positions[counter]);
	 io.sockets.connected[clients[counter].name].emit("position", clients[counter]);
     
	 socket.on("give",function(a){
	 	for (var i = clients.length-1; i >= 0; i--) {
    		if (clients[i].name == socket.id) 
    			{
    				io.sockets.connected[clients[i].name].emit("addPrev", clients);
    			};
    	};
	 	
	 });
	 socket.broadcast.emit('addPlayer', clients[clients.length-1]);
	 
	 
	counter++;
	io.emit('chat message', counter);

	socket.on('moved', function(statDat){
    	for (var i = clients.length-1; i >= 0; i--) {
    		if (clients[i].name == socket.id) 
    			{
    				clients[i].setPosition(statDat.pos);
    				clients[i].setRotation(statDat.rot);
    				clients[i].setState(statDat.state);
    				clients[i].setAttack(statDat.att);
                    clients[i].setWeaponAttack(statDat.weaponAttack);

    				socket.broadcast.emit('movedl', clients[i]);
    			};
    	};
 	 });

	 socket.on('disconnect', function(){
	 	counter--;
	 	for (var i = clients.length-1; i >= 0; i--) {
    		if (clients[i].name == socket.id) 
    			{
    				socket.broadcast.emit('out', clients[i]);
    				clients.splice(i, 1);

    			};
    	};

 	 });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});

function Players(name,position)
{
	this.name = name;
	this.position=position;
	this.rotation=0;
	this.state="stat";
	this.attack="punch";
    this.weaponAttack="stat";
	this.life=100;
	this.setPosition = function(pos)
	{
		this.position=pos;
	}
	this.setRotation = function(rot)
	{
		this.rotation=rot;
	}
		this.setState = function(stat)
	{
		this.state=stat;
	}
	this.setAttack = function(att)
	{
		this.attack=att;
	}
    this.setWeaponAttack = function(weaponAttack)
    {
        this.weaponAttack= weaponAttack;
    }

}

