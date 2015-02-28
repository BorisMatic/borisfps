/**
 * @author mrdoob / http://mrdoob.com/
 * @author schteppe / https://github.com/schteppe
 */
 var PointerLockControls = function ( camera, cannonBody ) {

    var eyeYPos = 1.95; // eyes are 2 meters above the ground
    var velocityFactor = 0.2;
    var jumpVelocity = 15;
    var scope = this;
    var state="stat";
    var motion="stat";
    var attack ="punch";
    var life =100;
    var currentFrame=0;
    var rememberedTime=0;
    var weapon ="stat";
    var x;
    var y;
    var z;

    //----------------------------------------------
    var ballShape = new CANNON.Sphere(0.2);
    var ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32);
    var shootDirection = new THREE.Vector3();
    var shootVelo = 70;
    var projector = new THREE.Projector();
    var ballBody = new CANNON.Body({ mass: 0.1 });
    ballBody.addShape(ballShape);
    var ballMesh = new THREE.Mesh( ballGeometry, material );
    ballMesh.castShadow = true;
    ballMesh.receiveShadow = true;


    this.getShootDire = function()
    {
        return shootDirection;
    }

    //------------------------------------------


    var availableAttacs = new Array();
    availableAttacs[0]="punch";
    availableAttacs[1]="sword";
    availableAttacs[2]="knife";
    availableAttacs[3]="bow";

    var availableWeapons = new Array();
    availableWeapons[0]="punch";
    availableWeapons[1]="middleSword";
    availableWeapons[2]="longSword";
    availableWeapons[3]="knife";
    availableWeapons[4]="bow";

    this.frames = {
    // first, last, fps
    stat   : [   35,  36,  2, {state : 'stat',  action : false} ],
    run   : [   1,  23,  30, {state : 'run',  action : false} ],   // STAND  1.pocetno,2.krajnje,3.brzina,flase/true, da li da se ponavlja false-neka se ponalja
    punch  : [  26,  34, 25, {state : 'punch',  action : true, next : 'stat'} ],   // STAND  1.pocetno,2.krajnje,3.brzina,flase/true, da li da se ponavlja false-neka se ponalja
    sword  : [  37,  44, 25, {state : 'sword',  action : true, next : 'stat'} ],   // STAND  1.pocetno,2.krajnje,3.brzina,flase/true, da li da se ponavlja false-neka se ponalja
    knife  : [  45,  58, 25, {state : 'knife',  action : true, next : 'stat'} ],   // STAND  1.pocetno,2.krajnje,3.brzina,flase/true, da li da se ponavlja false-neka se ponalja
    bow  : [  59,  77, 25, {state : 'bow',  action : true, next : 'stat'} ]   // RUN
    //boom    : [ 198, 198,  5 ]    // BOOM
    }

    this.setRememberedTime= function(time)
    {
        var t=this.frames[state][1]-this.frames[state][0];
        //document.getElementById("rotacija").innerHTML = time - rememberedTime;
        if ((time - rememberedTime)>t*(1/this.frames[state][2])) 
            {
                //document.getElementById("rotacija").innerHTML = this.frames[state][1];
                rememberedTime=time;
                
            };     
    }


    this.getBallBody = function()
    {
        return ballBody;
    }

    this.getBallMesh = function()
    {
        return ballMesh;
    }

    this.setballVelocity = function()
    {
                            ballBody.velocity.set(  shootDirection.x * shootVelo,
                                            shootDirection.y * shootVelo,
                                            shootDirection.z * shootVelo);
    }

    this.moveBallOutsidePlayer = function()
    {
        x += shootDirection.x * (sphereShape.radius*1.02 + ballShape.radius);
        y += shootDirection.y * (sphereShape.radius*1.02 + ballShape.radius);
        z += shootDirection.z * (sphereShape.radius*1.02 + ballShape.radius);
        ballBody.position.set(x,y,z);
        ballMesh.position.set(x,y,z);
    }

    var getShootDir = function(targetVec){
        var vector = targetVec;
        targetVec.set(0,0,1);
        vector.unproject(vector, camera);
        var ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize() );
        targetVec.x = ray.direction.x;
        targetVec.y = ray.direction.y;
        targetVec.z = ray.direction.z;
    }

    this.changeState=function(time)
    {
        if (state!=="run") {
            state = attack;
            var t=this.frames[state][1]-this.frames[state][0];
            if (this.frames[state][3].action && (time - rememberedTime)>t*(1/this.frames[state][2])) 
            {
                state =this.frames[state][3].next;
                this.setState(state);
            }
        }   
    }

    this.setAttack = function(att)
    {
        attack = att;
    }

    this.getAttack = function()
    {
        return attack;
    }


    this.setThrowWeaponPosition = function()
    {
        x = yawObject.position.x;
        y = 3.4;
        z = yawObject.position.z;
    }


    //camera.position.y =eyeYPos;//namestio sam da je pozicija kamere 2 metra

    var pitchObject = new THREE.Object3D();
   pitchObject.position.y =eyeYPos;
    pitchObject.add( camera );

    var yawObject = new THREE.Object3D();
    yawObject.position.y = 2;
    yawObject.add( pitchObject );

    var quat = new THREE.Quaternion();

    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;

    var canJump = false;

    var contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
    var upAxis = new CANNON.Vec3(0,1,0);
    cannonBody.addEventListener("collide",function(e){
        var contact = e.contact;

        // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
        // We do not yet know which one is which! Let's check.
        if(contact.bi.id == cannonBody.id)  // bi is the player body, flip the contact normal
            contact.ni.negate(contactNormal);
        else
            contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is

        // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
        if(contactNormal.dot(upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
            canJump = true;
    });

    var velocity = cannonBody.velocity;

    var PI_2 = Math.PI / 2;

    var onMouseMove = function ( event ) {

        if ( scope.enabled === false ) return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        yawObject.rotation.y -= movementX * 0.002;
        pitchObject.rotation.x -= movementY * 0.002;

        pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
    };

    var onKeyDown = function ( event ) {

        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = true;
                state="run";
                break;

            case 37: // left
            case 65: // a
                moveLeft = true; 
                break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                if ( canJump === true ){
                    velocity.y = jumpVelocity;
                }
                canJump = false;
                break;
            //------------------------------------------
            case 49: // space
                attack=availableAttacs[0];
                weapon=availableWeapons[0];
                break;
                break;
            case 50: // space
                if (availableAttacs[1]!==undefined)
                {
                    attack=availableAttacs[1];
                    weapon=availableWeapons[1];
                }
                break;
            case 51: // space
            if (availableAttacs[1]!==undefined)
                {
                    attack=availableAttacs[1];
                    weapon=availableWeapons[2];
                }
                break;
            case 52: // space
            if (availableAttacs[2]!==undefined)
                {
                    attack=availableAttacs[2];
                    weapon=availableWeapons[3];
                }
                break;
            case 53: // space
            if (availableAttacs[3]!==undefined)
                {
                    attack=availableAttacs[3];
                    weapon=availableWeapons[4];
                }
                break;
            //------------------------------------------
        }

    };

    var onKeyUp = function ( event ) {

        switch( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = false;
                state="stat";
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // a
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;

        }

    };

    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    this.enabled = false;

    this.getObject = function () {
        return yawObject;
    };

    this.getDirection = function(targetVec){
        targetVec.set(0,0,-1);
        quat.multiplyVector3(targetVec);
    }

    this.getRot = function() {

        // assumes the camera itself is not rotated

        var direction = new THREE.Vector3( 0, 0, -1 );
        var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

        return function( v ) {

            rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

            v=direction.clone().applyEuler( rotation );

            return v;

        }

    }();

    this.getState = function()
    {
        return state;
    }
        this.setState = function(stat)
    {
        state=stat;
    }

    this.getAngles = function()
    {
        return yawObject.rotation.y;
    }

    // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
    var inputVelocity = new THREE.Vector3();
    var euler = new THREE.Euler();
    this.update = function ( delta ) {

        if ( scope.enabled === false ) return;

        delta *= 0.1;

        inputVelocity.set(0,0,0);

        if ( moveForward ){
            inputVelocity.z = -velocityFactor * delta;
        }
        if ( moveBackward ){
            inputVelocity.z = velocityFactor * delta;
        }

        if ( moveLeft ){
            inputVelocity.x = -velocityFactor * delta;
        }
        if ( moveRight ){
            inputVelocity.x = velocityFactor * delta;
        }

        // Convert velocity to world coordinates
        euler.x = pitchObject.rotation.x;
        euler.y = yawObject.rotation.y;
        euler.order = "XYZ";
        quat.setFromEuler(euler);
        inputVelocity.applyQuaternion(quat);
        //quat.multiplyVector3(inputVelocity);

        // Add to the object
        velocity.x += inputVelocity.x;
        velocity.z += inputVelocity.z;

        yawObject.position.copy(cannonBody.position);

    };
    this.getLife = function()
    {
        return life;
    }
    this.setLife = function(lif)
    {
        life=lif;
    }

    this.getWeaponAttack= function()
    {
        return weapon;
    }
    
};
