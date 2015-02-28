PointerLockControls = function ( camera, cannonBody ) 
{
    this.cannonBody = cannonBody;
    this.eyeYPos = 1.95; // eyes are 2 meters above the ground
    this.velocityFactor = 0.2;
    this.jumpVelocity = 15;
    this.scope = this;
    this.state="stat";
    this.motion="stat";
    this.attack ="punch";
    this.life =100;
    this.currentFrame=0;
    this.rememberedTime=0;
    this.weapon ="stat";
    this.raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 100 );
    this.distanceFloor;


    this.availableAttacs = new Array();
    this.availableAttacs[0]="punch";
    this.availableAttacs[1]="sword";
    this.availableAttacs[2]="knife";
    this.availableAttacs[3]="bow_prep";

    this.availableWeapons = new Array();
    this.availableWeapons[0]="punch";
    this.availableWeapons[1]="middleSword";
    this.availableWeapons[2]="longSword";
    this.availableWeapons[3]="knife";
    this.availableWeapons[4]="bow";

    this.frames = {
    // first, last, fps
    stat   : [   35,  36,  2, {state : 'stat',  action : false,step:true} ],
    run   : [   1,  23,  30, {state : 'run',  action : false,step:true} ],  
    punch  : [  26,  34, 25, {state : 'punch',  action : true, next : 'stat',step:true} ],  
    sword  : [  37,  44, 25, {state : 'sword',  action : true, next : 'stat',step:true} ],  
    knife  : [  45,  58, 25, {state : 'knife',  action : true, next : 'stat',step:true} ],
    bow_prep  : [  59,  72, 25, {state : 'bow_prep',  action : true, next : 'bow',step:false} ],
    bow  : [  73,  77, 25, {state : 'bow',  action : true, next : 'bow_prep',step:true} ],  
    //boom    : [ 198, 198,  5 ]    // BOOM
    }

    


    //camera.position.y =eyeYPos;//namestio sam da je pozicija kamere 2 metra

    this.pitchObject = new THREE.Object3D();
    this.pitchObject.position.y =this.eyeYPos;
    this.pitchObject.add( camera );

    this.yawObject = new THREE.Object3D();
    this.yawObject.position.y = 2;
    this.yawObject.add( this.pitchObject );

    this.quat = new THREE.Quaternion();

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    this.canJump = false;

    this.contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
    this.upAxis = new CANNON.Vec3(0,1,0);


    this.velocity = cannonBody.velocity;

    this.PI_2 = Math.PI / 2



    this.enabled = false;



    // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
    this.inputVelocity = new THREE.Vector3();
    this.euler = new THREE.Euler();

    this.addControlListeners();
    this.addBodyListener();




}

PointerLockControls.prototype.addControlListeners = function()
{
    var scope = this;

    document.addEventListener( 'mousemove', function(){scope.onMouseMove(scope)}, false );
    document.addEventListener( 'keydown', function(){scope.onKeyDown(scope)}, false );
    document.addEventListener( 'keyup', function(){scope.onKeyUp(scope)}, false );
    document.addEventListener("click", function(){scope.setRememberedTime(clock.getElapsedTime());});
  //  document.addEventListener("mousedown", function(){scope.onMouseDown(clock.getElapsedTime())});
  //  document.addEventListener("mouseup", function(){scope.onMouseUp(clock.getElapsedTime())});
}


PointerLockControls.prototype.addBodyListener = function()
{
    var scope = this;

    scope.cannonBody.addEventListener("collide",function(e){
        var contact = e.contact;

        // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
        // We do not yet know which one is which! Let's check.
        if(contact.bi.id == scope.cannonBody.id)  // bi is the player body, flip the contact normal
            contact.ni.negate(scope.contactNormal);
        else
            scope.contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is

        // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
        if(scope.contactNormal.dot(scope.upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
            scope.canJump = true;
    });

}




PointerLockControls.prototype.getObject = function () 
{
    return this.yawObject;
}

PointerLockControls.prototype.getDirection = function(targetVec)
{
    targetVec.set(0,0,-1);
    quat.multiplyVector3(targetVec);
}

PointerLockControls.prototype.getRot = function() {

    // assumes the camera itself is not rotated

    var direction = new THREE.Vector3( 0, 0, -1 );
    var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

    return function( v ) {

        rotation.set( this.pitchObject.rotation.x, this.yawObject.rotation.y, 0 );

        v=direction.clone().applyEuler( rotation );

        return v;

    }

}


 PointerLockControls.prototype.getState = function()
{
    return this.state;
}
 PointerLockControls.prototype.setState = function(stat)
{
    this.state=stat;
}

 PointerLockControls.prototype.getAngles = function()
{
    return this.yawObject.rotation.y;
}

PointerLockControls.prototype.update = function ( delta ) 
{
        if ( this.scope.enabled === false ) return;

        delta *= 0.3;

        this.inputVelocity.set(0,0,0);

        if ( this.moveForward ){
            this.inputVelocity.z = -this.velocityFactor * delta;
        }
        if ( this.moveBackward ){
            this.inputVelocity.z = this.velocityFactor * delta;
        }

        if ( this.moveLeft ){
            this.inputVelocity.x = -this.velocityFactor * delta;
        }
        if ( this.moveRight ){
            this.inputVelocity.x = this.velocityFactor * delta;
        }

        // Convert velocity to world coordinates
        this.euler.x = this.pitchObject.rotation.x;
        this.euler.y = this.yawObject.rotation.y;
        this.euler.order = "XYZ";
        this.quat.setFromEuler(this.euler);
        this.inputVelocity.applyQuaternion(this.quat);
        //quat.multiplyVector3(inputVelocity);

        // Add to the object
        this.velocity.x += this.inputVelocity.x;
        this.velocity.z += this.inputVelocity.z;

        this.raycaster.ray.origin.copy( this.cannonBody.position );
        this.raycaster.ray.origin.y += 20;


        this.distanceFloor=this.raycaster.intersectObject(scene.getObjectByName( "terrain" ));

        if (this.distanceFloor.length>0)
            {         
                if (this.distanceFloor[0].distance<30) 
                {
                    this.cannonBody.position.y += (22.4-this.distanceFloor[0].distance)-1;
                    //this.cannonBody.position.y = this.distanceFloor[0].point.y+10;
                    //controls.isOnObject( true );              
                }                       
            }

        //this.cannonBody.position.y=25;

        this.yawObject.position.copy(this.cannonBody.position);

}

PointerLockControls.prototype.getLife = function()
{
    return this.life;
}

PointerLockControls.prototype.setLife = function(lif)
{
    life=lif;
}

PointerLockControls.prototype.getWeaponAttack= function()
{
    return this.weapon;
}

PointerLockControls.prototype.setRememberedTime= function(time)
{
    var t=this.frames[this.state][1]-this.frames[this.state][0];
    //document.getElementById("rotacija").innerHTML = time - rememberedTime;
    if ((time - this.rememberedTime)>t*(1/this.frames[this.state][2])) 
    {
        //document.getElementById("rotacija").innerHTML = this.frames[state][1];
        if (this.state !== "bow_prep") {
            this.state = this.attack;
            this.rememberedTime=time;
        }
        else{
            if ((time - this.rememberedTime)>2*t*(1/this.frames[this.state][2])) {
                this.state = "bow";
                this.rememberedTime=time;
            }
        }    
        
      
            
    }    
}


PointerLockControls.prototype.getBallBody = function()
{
    return ballBody;
}

PointerLockControls.prototype.getBallMesh = function()
{
    return ballMesh;
}

PointerLockControls.prototype.setballVelocity = function()
{
    ballBody.velocity.set(  shootDirection.x * shootVelo,
                            shootDirection.y * shootVelo,
                            shootDirection.z * shootVelo);
}

PointerLockControls.prototype.moveBallOutsidePlayer = function()
{
    x += shootDirection.x * (sphereShape.radius*1.02 + ballShape.radius);
    y += shootDirection.y * (sphereShape.radius*1.02 + ballShape.radius);
    z += shootDirection.z * (sphereShape.radius*1.02 + ballShape.radius);
    ballBody.position.set(x,y,z);
    ballMesh.position.set(x,y,z);
}

PointerLockControls.prototype.getShootDir = function(targetVec)
{
    var vector = targetVec;
    targetVec.set(0,0,1);
    vector.unproject(vector, camera);
    var ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize() );
    targetVec.x = ray.direction.x;
    targetVec.y = ray.direction.y;
    targetVec.z = ray.direction.z;
}

PointerLockControls.prototype.changeState=function(time)
{
    if (this.frames[this.state][3].step) {
        if (this.frames[this.state][3].action) {
            var t=this.frames[this.state][1]-this.frames[this.state][0];
            if (this.frames[this.state][3].action && (time - this.rememberedTime)>t*(1/this.frames[this.state][2])) 
            {
                this.state =this.frames[this.state][3].next;
                this.setState(this.state);
            }
        }
    }
}

PointerLockControls.prototype.setAttack = function(att)
{
    attack = att;
}

PointerLockControls.prototype.getAttack = function()
{
    return this.attack;
}


PointerLockControls.prototype.setThrowWeaponPosition = function()
{
    x = this.yawObject.position.x;
    y = 3.4;
    z = this.yawObject.position.z;
}

PointerLockControls.prototype.onMouseMove = function (scope) 
{

    if ( scope.enabled === false ) return;

    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    scope.yawObject.rotation.y -= movementX * 0.002;
    scope.pitchObject.rotation.x -= movementY * 0.002;

    scope.pitchObject.rotation.x = Math.max( - scope.PI_2, Math.min( scope.PI_2, scope.pitchObject.rotation.x ) );
}

PointerLockControls.prototype.onMouseDown = function (time)
{
    var t=this.frames[this.state][1]-this.frames[this.state][0];
    //document.getElementById("rotacija").innerHTML = time - rememberedTime;
    if ((time - this.rememberedTime)>t*(1/this.frames[this.state][2])) 
    {
        //document.getElementById("rotacija").innerHTML = this.frames[state][1];
        if (this.attack == "bow_prep") 
        {
            this.state = this.attack;
            this.rememberedTime=time;
        }            
            
    }  

} 

PointerLockControls.prototype.onMouseUp = function (time)
{
    var t=this.frames[this.state][1]-this.frames[this.state][0];
    //document.getElementById("rotacija").innerHTML = time - rememberedTime;
    if ((time - this.rememberedTime)>t*(1/this.frames[this.state][2])) 
    {
        //document.getElementById("rotacija").innerHTML = this.frames[state][1];
        if (this.attack == "bow_prep") 
        {
            this.state = "bow";
            this.rememberedTime=time;
        }            
            
    }  

} 

PointerLockControls.prototype.onKeyDown = function (scope) 
{
    switch ( event.keyCode ) 
    {

        case 38: // up
        case 87: // w
            scope.moveForward = true;
            scope.state="run";
            break;

        case 37: // left
        case 65: // a
            scope.moveLeft = true; 
            break;

        case 40: // down
        case 83: // s
            scope.moveBackward = true;
            break;

        case 39: // right
        case 68: // d
            scope.moveRight = true;
            break;

        case 32: // space
            if ( scope.canJump === true ){
                scope.velocity.y = scope.jumpVelocity;
            }
            scope.canJump = false;
            break;
        //------------------------------------------
        case 49: // space
            scope.attack=scope.availableAttacs[0];
            scope.weapon=scope.availableWeapons[0];
            break;
            break;
        case 50: // space
            if (scope.availableAttacs[1]!==undefined)
            {
                scope.attack=scope.availableAttacs[1];
                scope.weapon=scope.availableWeapons[1];
            }
            break;
        case 51: // space
        if (scope.availableAttacs[1]!==undefined)
            {
                scope.attack=scope.availableAttacs[1];
                scope.weapon=scope.availableWeapons[2];
            }
            break;
        case 52: // space
        if (scope.availableAttacs[2]!==undefined)
            {
                scope.attack=scope.availableAttacs[2];
                scope.weapon=scope.availableWeapons[3];
            }
            break;
        case 53: // space
        if (scope.availableAttacs[3]!==undefined)
            {
                scope.attack=scope.availableAttacs[3];
                scope.weapon=scope.availableWeapons[4];
            }
            break;
        //------------------------------------------
    }

}

PointerLockControls.prototype.onKeyUp = function (scope) 
{

    switch( event.keyCode ) {

        case 38: // up
        case 87: // w
            scope.moveForward = false;
            scope.state="stat";
            break;

        case 37: // left
        case 65: // a
            scope.moveLeft = false;
            break;

        case 40: // down
        case 83: // a
            scope.moveBackward = false;
            break;

        case 39: // right
        case 68: // d
            scope.moveRight = false;
            break;

    }
}

