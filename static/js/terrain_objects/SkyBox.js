SkyBox = function () 
{
    this.imagePrefix = "images/";
    this.directions  = ["left", "right", "up", "down", "front", "back"];
    this.imageSuffix = ".png";
    this.skyGeometry = new THREE.BoxGeometry( 500, 500, 500 );  
    this.materialArray = [];

    for (var i = 0; i < 6; i++)
    {
        this.materialArray.push( new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture( this.imagePrefix + this.directions[i] + this.imageSuffix ),
            side: THREE.BackSide
            }));
    }

    this.skyMaterial = new THREE.MeshFaceMaterial( this.materialArray );
    this.model = new THREE.Mesh( this.skyGeometry, this.skyMaterial );
    this.model.name ="skyBox"; 
}

SkyBox.prototype.setPosition = function(position)
{
    this.model.position.x = position.x;
    this.model.position.y = position.y;
    this.model.position.z = position.z;
}

SkyBox.prototype.getModel = function()
{
    return this.model;
}