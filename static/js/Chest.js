

Chest = function (name, geometry, material) {
	this.frames = {
	// first, last, fps
	stat   : [   1,  1,  20, {state : 'stat',  action : false} ],
	open   : [   1,  60,  10, {state : 'open',  action : false} ],   // STAND  1.pocetno,2.krajnje,3.brzina,flase/true, da li da se ponavlja false-neka se ponalja
	close  : [  61,  120, 10, {state : 'close',  action : false} ]   // RUN
	//boom    : [ 198, 198,  5 ]    // BOOM
}

	this.object = new THREE.MorphAnimMesh( geometry, material );

	this.object.rotation.y = -Math.PI / 2;
	this.object.scale.set(.4, .4, .4);
	//this.object.position.y = 0.2;
	this.object.castShadow = true;
	this.object.receiveShadow = true;

	//var geom = new THREE.TextGeometry(name, { font: "helvetiker" });

	//var mat  = new THREE.MeshPhongMaterial({color: 0x00ff00});
	//this.sign = new THREE.Mesh(geom, mat);
	//this.sign.position.y = this.object.position.y+1;

	this.motion  = 'stat';
	this.state   = 'stat';
	this.direction = 0;
	this.name = name;


	this.changeMotion = function (motion) {
		this.motion = motion;
		this.state = this.frames[motion][3].state;
		var animMin = this.frames[motion][0];
		var animMax = this.frames[motion][1];
		var animFps = this.frames[motion][2];
		this.object.time = 0;
		this.object.duration = 1000 * (( animMax - animMin ) / animFps);
		this.object.setFrameRange( animMin, animMax );
	}

	this.changeMotion('open');

	this.animate = function (clockdelta) {
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

	this.setPosition = function (x, z, terrain, direction) {
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

	this.setState = function (state) {
		this.object.position.x = state.x;
		this.object.position.y = state.y;
		this.object.position.z = state.z;
		this.object.rotation.y = (state.dir+270) * Math.PI / 180;
		this.direction = state.dir;
		if (state.mot != this.motion) this.changeMotion(state.mot);
	}

	this.getState = function () {
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

	this.getStateRounded = function () {
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


};