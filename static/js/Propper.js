Propper = function (name, object) {
	this.frames = {
	// first, last, fps
	stat   : [   35,  36,  2, {state : 'stat',  action : false} ],
	run   : [   1,  23,  30, {state : 'run',  action : false} ],   // STAND  1.pocetno,2.krajnje,3.brzina,flase/true, da li da se ponavlja false-neka se ponalja
	punch  : [  26,  34, 20, {state : 'punch',  action : true, next : 'stat'} ],   // STAND  1.pocetno,2.krajnje,3.brzina,flase/true, da li da se ponavlja false-neka se ponalja
    sword  : [  37,  44, 25, {state : 'sword',  action : true, next : 'stat'} ],   // STAND  1.pocetno,2.krajnje,3.brzina,flase/true, da li da se ponavlja false-neka se ponalja
    knife  : [  45,  58, 25, {state : 'knife',  action : true, next : 'stat'} ],   // STAND  1.pocetno,2.krajnje,3.brzina,flase/true, da li da se ponavlja false-neka se ponalja
    bow_prep  : [  59,  72, 25, {state : 'bow_prep',  action : true, next : 'bow',step:false} ],
    bow  : [  73,  77, 25, {state : 'bow',  action : true, next : 'bow_prep',step:true} ],  
	//boom    : [ 198, 198,  5 ]    // BOOM
	}

	this.object = object;
	this.weapon = new Weapon();
	this.weaponAttack ="punch";

	this.object.rotation.y = -Math.PI / 2;
	this.object.scale.set(.4, .4, .4);
	//this.object.position.y = 0.2;
	this.object.castShadow = true;
	this.object.receiveShadow = true;

	//var geom = new THREE.TextGeometry(name, { font: "helvetiker" });

	//var mat  = new THREE.MeshPhongMaterial({color: 0x00ff00});
	//this.sign = new THREE.Mesh(geom, mat);
	//this.sign.position.y = this.object.position.y+1;

	this.motion  = 'run';
	this.state   = 'run';
	this.attack = "punch";
	this.direction = 0;
	this.name = name;
	this.object.name = name;
};	

Propper.prototype.changeMotion = function (motion) {
		if (this.motion!==motion) {
		this.motion = motion;
		this.state = this.frames[motion][3].state;
		var animMin = this.frames[motion][0];
		var animMax = this.frames[motion][1];
		var animFps = this.frames[motion][2];
		this.object.time = 0;
		this.object.duration = 1000 * (( animMax - animMin ) / animFps);
		this.object.setFrameRange( animMin, animMax );
		//----------------------------------

		this.weapon.changeMotion(motion);

	}
}
Propper.prototype.changeWeaponMotion = function(motion)
{
	this.weapon.changeMotion(motion);
}

	//this.changeMotion('stat');

Propper.prototype.animate = function (clockdelta) {
		var isEndFrame = (this.frames[this.motion][1] === this.object.currentKeyframe);//stavlja true ako je na zadnjem  frame-u
		var isAction = this.frames[this.motion][3].action;//stavlja da li je akcija true ili false, ako je true, obavlja se samo jednom
		
		if(!isAction || (isAction && !isEndFrame)){//ako se rotira(false) ili ako se ne rotira(true), ali nije zadnji frejm, tada update-uje animaciju
			this.object.updateAnimation(1000 * clockdelta);
		}else if(/freeze/.test(this.frames[this.motion][3].state)){
			//dead...
		}/*else if(isAction && isEndFrame){
			this.changeMotion(this.frames[this.motion][3].next);
		}*/else{
			this.changeMotion(this.state);
		}

		this.weapon.animate(clockdelta);
	}

Propper.prototype.setPosition = function(pos)
	{
		this.object.position.x=pos.x;
		this.object.position.y=pos.y-3.41;
		this.object.position.z=pos.z;

		this.weapon.setPosition(pos);

	}
Propper.prototype.setRotation = function(rot)
{
	this.object.rotation.y=rot;
	this.weapon.setRotation(rot);
}
Propper.prototype.getObject = function()
	{
		return this.object;
	}

Propper.prototype.setState = function (state) {
		this.object.position.x = state.x;
		this.object.position.y = state.y;
		this.object.position.z = state.z;
		this.object.rotation.y = (state.dir+270) * Math.PI / 180;
		this.direction = state.dir;
		if (state.mot != this.motion) this.changeMotion(state.mot);

		this.weapon.setState(state);


	}

Propper.prototype.getState = function () {
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

Propper.prototype.getStateRounded = function () {
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

Propper.prototype.getAttack = function()
	{
		return this.attack;
	}

Propper.prototype.setAttack = function(att)
	{
		this.attack =att;
	}


Propper.prototype.setWeapon = function(weapon)
	{
		this.weapon.setObject(weapon);
	}

Propper.prototype.getWeapon = function()
{
	return this.weapon.getObject();
}

Propper.prototype.getWeaponName = function()
{
	return this.weapon.getWeaponName();
}

Propper.prototype.setWeaponName = function(name)
{
	return this.weapon.setWeaponName(name);
}
