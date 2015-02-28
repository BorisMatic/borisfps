Walls = function () 
{
    this.axis = new THREE.Vector3(0,1,0);
    this.angle= Math.PI/2;
    this.scale=100;
    this.wallGeometry = new THREE.Geometry();

    this.halfExtents = new CANNON.Vec3(this.scale,10,1);
    this.boxShape = new CANNON.Box(this.halfExtents);
    this.boxGeometry = new THREE.BoxGeometry(this.halfExtents.x*2,this.halfExtents.y*2,this.halfExtents.z*2); 

    this.addTexture(); 
    this.wallMaterial = new THREE.MeshPhongMaterial({ map: this.wallTexture});      
    this.addSpecular();
    this.addBumpMaps();
    this.setWalls();

    this.wallMesh = new THREE.Mesh( this.wallGeometry, this.wallMaterial);
    this.wallMesh.castShadow = true;
    this.wallMesh.receiveShadow = true;
}

Walls.prototype.addSpecular= function()
{
    var specularMap    = THREE.ImageUtils.loadTexture('images/wall3Spectral3.jpg');
    specularMap.wrapS = specularMap.wrapT = THREE.RepeatWrapping;
    specularMap.repeat.set(20, 2);
    this.wallMaterial.specularMap    = specularMap;
    this.wallMaterial.specular  = new THREE.Color('grey');
}

Walls.prototype.addBumpMaps = function()
{
    var bumpTexture    = THREE.ImageUtils.loadTexture('images/wall3Bump.jpg')
    bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;
    bumpTexture.repeat.set(20, 2);
    this.wallMaterial.bumpMap    = bumpTexture;
    this.wallMaterial.bumpScale = 0.015;
}

Walls.prototype.addTexture = function()
{
    this.wallTexture = THREE.ImageUtils.loadTexture( "images/wall3.jpg" );
    this.wallTexture.wrapS = THREE.RepeatWrapping;
    this.wallTexture.wrapT = THREE.RepeatWrapping;
    this.wallTexture.repeat.set(20,2);
}

Walls.prototype.setWalls =function()
{
    for (var i = 4; i > 0; i--) 
    {
        var newAngle=this.angle*i;
        var boxBody = new CANNON.Body();
        boxBody.addShape(this.boxShape);

        var wall = new THREE.Mesh(this.boxGeometry.clone());
        wall.position.set(Math.round(Math.sin(newAngle))*this.scale,10,Math.round(Math.cos(newAngle))*this.scale);
        this.rotateAroundObjectAxis(wall,this.axis,this.angle*i);
        wall.updateMatrix();
        this.wallGeometry.merge( wall.geometry, wall.matrix );

        boxBody.position.set(Math.round(Math.sin(newAngle))*this.scale,10,Math.round(Math.cos(newAngle))*this.scale);
        boxBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), wall.rotation.y);

        world.add(boxBody);        
        boxes.push(boxBody);
    }

}
Walls.prototype.getModel = function()
{
    return this.wallMesh;
}

Walls.prototype.rotateAroundObjectAxis = function(object, axis, radians) {
    rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
    object.matrix.multiply(rotObjectMatrix);
    object.rotation.setFromRotationMatrix(object.matrix);
}