Players = function()
{
	this.players = new Array();
	
}

Players.prototype.addPreviousPlayers = function(msg)
{
	for (var i = 0; i < msg.length-1; i++) 
    {
    this.players[i]=new Propper(msg[i].name,jsonObjectLoader.getAnimatedObject("player").clone());
    this.players[i].setPosition(msg[i].position);
    scene.add(this.players[i].getObject());
    this.players[i].changeMotion('stat');
    }
}

Players.prototype.addNewPlayer = function(msg)
{
	this.players.push(new Propper(msg.name,jsonObjectLoader.getAnimatedObject("player").clone()));
    this.players[this.players.length-1].setPosition(msg.position);
    scene.add(this.players[this.players.length-1].getObject());
    this.players[this.players.length-1].changeMotion('stat');
}

Players.prototype.positionPlayers = function(msg)
{
	for (var i = this.players.length - 1; i >= 0; i--) {
        if (this.players[i].name==msg.name) 
        {
            this.players[i].setPosition(msg.position);
            this.players[i].setRotation(msg.rotation);
            this.players[i].changeMotion(msg.state);
            if (this.players[i].getAttack()!==msg.attack ||this. players[i].getWeaponName() !== msg.weaponAttack) 
            {
                this.players[i].setAttack(msg.attack);
                scene.remove(this.players[i].getWeapon());
                this.players[i].setWeapon(jsonObjectLoader.getAnimatedObject(msg.weaponAttack).clone());
                this.players[i].setWeaponName(msg.weaponAttack);
                scene.add(this.players[i].getWeapon());
            }
        }
    }
}

Players.prototype.removePlayer = function(msg)
{
	for (var i = this.players.length - 1; i >= 0; i--) {
        if (this.players[i].name==msg.name) 
        {
            scene.remove(this.players[i].getObject());
            scene.remove(this.players[i].getWeapon());
            this.players.splice(i, 1);
        }
    }
}

Players.prototype.animate = function(delta)
{
	for (var i = this.players.length - 1; i >= 0; i--) 
    {
        if (this.players[i]!== undefined) 
        {
            this.players[i].animate(delta);
        }
    }
}