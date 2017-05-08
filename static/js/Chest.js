Chest = function (object) 
{
	this.frames = {
	// first, last, fps
	stat   : [   1,  1,  20, {state : 'stat',  action : false} ],
	open   : [   1,  60,  10, {state : 'open',  action : false} ],   // STAND  1.pocetno,2.krajnje,3.brzina,flase/true, da li da se ponavlja false-neka se ponalja
	close  : [  61,  120, 10, {state : 'close',  action : false} ]   // RUN
	//boom    : [ 198, 198,  5 ]    // BOOM
	}

	this.object = object;

	this.object.rotation.y = -Math.PI / 2;
	this.object.scale.set(.4, .4, .4);
	this.object.castShadow = true;
	this.object.receiveShadow = true;
	this.id =-1;

	this.motion  = 'stat';
	this.state   = 'stat';
	this.direction = 0;
	this.name = name;
	this.locked = false;

	this.weapons =[];
	//this.changeMotion('open');




};

Chest.prototype.changeMotion = function (motion) 
{
	this.motion = motion;
	this.state = this.frames[motion][3].state;
	var animMin = this.frames[motion][0];
	var animMax = this.frames[motion][1];
	var animFps = this.frames[motion][2];
	this.object.time = 0;
	this.object.duration = 1000 * (( animMax - animMin ) / animFps);
	this.object.setFrameRange( animMin, animMax );
}


Chest.prototype.animate = function (clockdelta) 
{
	var isEndFrame = (this.frames[this.motion][1] === this.object.currentKeyframe);
	var isAction = this.frames[this.motion][3].action;
	
	if(!isAction || (isAction && !isEndFrame)){
		this.object.updateAnimation(1000 * clockdelta);
	}else if(/freeze/.test(this.frames[this.motion][3].state)){
		//dead...
	}else{
		this.changeMotion(this.state);
	}

}


Chest.prototype.setPosition = function (x, z, terrain, direction) 
{
	if (direction) {
		this.diretion = direction;
		this.object.rotation.y = (direction+270) * Math.PI / 180;
	}
	this.object.position.x = x;
	this.object.position.z = z;

	/*var vec = new THREE.Vector3( 0, -1, 0 );
	var pos = new THREE.Vector3(this.object.position.x, this.object.position.y+100, this.object.position.z);
	var raycaster = new THREE.Raycaster(pos, vec);
	var intersects = raycaster.intersectObject(terrain);
	if (intersects.length>0) this.object.position.y = intersects[0].point.y+.5;*/
}



Chest.prototype.setState = function (state) 
{
	this.object.position.x = state.x;
	this.object.position.y = state.y;
	this.object.position.z = state.z;
	this.object.rotation.y = (state.dir+270) * Math.PI / 180;
	this.direction = state.dir;
	if (state.mot != this.motion) this.changeMotion(state.mot);
}

Chest.prototype.getState = function () 
{
	var state = {
		action: 'broadcast',
		name: this.name,
		x   : this.object.position.x,
		y   : this.object.position.y,
		z   : this.object.position.z,
		dir : this.direction,
		mot : this.motion
	}
	return state;
}

Chest.prototype.getStateRounded = function () 
{
	var state = {
		action: 'broadcast',
		name: this.name,
		x   : Math.round(this.object.position.x * 100)/100,
		y   : Math.round(this.object.position.y * 100)/100,
		z   : Math.round(this.object.position.z * 100)/100,
		dir : Math.round(this.direction * 100)/100,
		mot : this.motion
	}
	return state;
}
Chest.prototype.getObject = function()
{
	return this.object;
}

Chest.prototype.addWeapon = function(weapon,numberOfWeapon)
{
	this.weapons.push({
		weapon:weapon,
		number:numberOfWeapon
	});
}

Chest.prototype.getWeapons = function()
{
	return this.weapons;
}

Chest.prototype.removeWeapon = function(name)
{
	console.log(name);
	for (var i = 0; i < this.weapons.length ; i++) {
		if (this.weapons[i].weapon == name) {
			this.weapons.splice(i,1);
			return;
		}
	}
}

Chest.prototype.setLocked = function(locked)
{
	this.locked = locked;
}