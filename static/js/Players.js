Players = function()
{
	this.players = {};
}

Players.prototype.addPreviousPlayers = function(msg)
{
	for (var i = 0; i < msg.length-1; i++) 
    {
    this.players[msg[i].name]=new Propper(msg[i].name,jsonObjectLoader.getAnimatedObject("player").clone());
    this.players[msg[i].name].setPosition(msg[i].position);
    scene.add(this.players[msg[i].name].getObject());
    this.players[msg[i].name].changeMotion('stat');
    }
}

Players.prototype.addNewPlayer = function(msg)
{
	this.players[msg.name]=new Propper(msg.name,jsonObjectLoader.getAnimatedObject("player").clone());
    this.players[msg.name].setPosition(msg.position);
    scene.add(this.players[msg.name].getObject());
    this.players[msg.name].changeMotion('stat');
}

Players.prototype.positionPlayers = function(msg)
{
    if (this.players[msg.name]!== undefined) 
    {
            this.players[msg.name].setPosition(msg.position);
            this.players[msg.name].setRotation(msg.rotation);
            this.players[msg.name].changeMotion(msg.state);
            if (this.players[msg.name].getAttack()!==msg.attack ||this. players[msg.name].getWeaponName() !== msg.weaponAttack) 
            {
                this.players[msg.name].setAttack(msg.attack);
                scene.remove(this.players[msg.name].getWeapon());
                this.players[msg.name].setWeapon(jsonObjectLoader.getAnimatedObject(msg.weaponAttack).clone());
                this.players[msg.name].setWeaponName(msg.weaponAttack);
                scene.add(this.players[msg.name].getWeapon());
            }
    }
}

Players.prototype.removePlayer = function(msg)
{
            scene.remove(this.players[msg.name].getObject());
            scene.remove(this.players[msg.name].getWeapon());
            delete players[msg.name];
}

Players.prototype.animate = function(delta)
{
    for (var key in this.players) {
        if (this.players[key]!== undefined) 
        {
            this.players[key].animate(delta);
        }
    }
}

Players.prototype.getClickedPlayer = function(stick)
{
    for (var key in this.players) {
        var playerDistance = stick.intersectObject(this.players[key].getObject());
        if (playerDistance.length>0) 
        {
            return key;
        }

    }
}