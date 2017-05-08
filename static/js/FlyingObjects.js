FlyingObjects = function()
{
    this.ballShape = new CANNON.Sphere(0.2);
    this.ballGeometry = new THREE.SphereGeometry(this.ballShape.radius, 32, 32);
    this.arrowsMesh = [];
    this.arrowBodies =[];
    this.knifeMesh =[];
}

FlyingObjects.prototype.addObjects = function(msg)
{
        var x = msg.ballPosition.x;
        var y = msg.ballPosition.y;
        var z = msg.ballPosition.z;
        var ballBody = new CANNON.Body({ mass: 1 });
        ballBody.addShape(this.ballShape);
        var ballMesh = new THREE.Mesh( this.ballGeometry, material );
        var kn;

        if (msg.attackType =="knife") {
            kn = jsonObjectLoader.getStaticObject("knife").clone();
            this.shootVelo=50;
        } else {
            kn = jsonObjectLoader.getStaticObject("arrow").clone();
            this.shootVelo=70;
        }
        world.add(ballBody);
    //    scene.add(ballMesh);
        scene.add(kn);
        ballMesh.castShadow = true;
        ballMesh.receiveShadow = true;
        ballBody.addEventListener("collide",function(e){
            var contact = e.contact;
            if(contact.bi.id == sphereBody.id || contact.bj.id == sphereBody.id) {
                controls.damageMe(10);
            }  
            
        });
        this.arrowBodies.push(ballBody);
        this.knifeMesh.push(kn);
        this.arrowsMesh.push(ballMesh);
        ballBody.velocity.set(  msg.ballVelocity.x,
                                msg.ballVelocity.y,
                                msg.ballVelocity.z
                                );
        kn.rotation.set(msg.ballRotation.x,msg.ballRotation.y,msg.ballRotation.z);
        ballBody.quaternion.copy(kn.quaternion);
        ballBody.position.set(x,y,z);
        ballMesh.position.set(x,y,z);
        kn.position.set(x,y,z);
        kn.rotation.set(msg.ballRotation.x,msg.ballRotation.y,msg.ballRotation.z);
        ballBody.quaternion.copy(kn.quaternion);
}

FlyingObjects.prototype.animateObjects = function()
{
        for(var i=0; i<this.arrowBodies.length; i++){
       this.arrowsMesh[i].position.copy(this.arrowBodies[i].position);
       this.arrowsMesh[i].quaternion.copy(this.arrowBodies[i].quaternion);
        this.knifeMesh[i].position.copy(this.arrowBodies[i].position);
       this.knifeMesh[i].quaternion.copy(this.arrowBodies[i].quaternion);
   }
}
