Floor =function()
{
    grassGeometry = new THREE.PlaneGeometry(200, 200);

    this.grassTexture= this.setTexture();
    grassMaterial = new THREE.MeshLambertMaterial( { map: this.grassTexture } );

    this.model = new THREE.Mesh( grassGeometry, grassMaterial );
    this.model.rotation.set(-90 * (Math.PI / 180),0,0);
    this.model.receiveShadow = true;
}

Floor.prototype.getModel=function()
{
    return this.model;
}

Floor.prototype.setTexture=function()
{
    var texture = THREE.ImageUtils.loadTexture( "images/grass.jpg" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(40,40);
    return texture;
}

