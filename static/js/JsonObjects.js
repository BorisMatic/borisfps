JsonObjects = function()
{
    this.loader = new THREE.JSONLoader();
    this.animatedObjects = [];
    this.staticObjects = [];
    this.animatedObjects["punch"]=undefined;
    this.addanimatedObjects();
    this.addStaticObjects();
}

JsonObjects.prototype.loadAnimatedObject = function(fileName,name,uv,animatedObjects)
{
    this.loader.load( fileName, function( geometry ) {
        var material = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( uv ), ambient: 0x999999, color: 0xffffff, specular: 0xffffff, shininess: 25, morphTargets: true } );
        material.morphTargets =true;

        var object = new THREE.MorphAnimMesh( geometry, material );      
        animatedObjects[name]= object;
    });
}

JsonObjects.prototype.loadStaticObject = function(fileName,name,uv)
{
    this.loader.load( fileName, function( geometry,materials ) {
        materials = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( uv ),ambient: 0x999999, color: 0xffffff, specular: 0xffffff, shininess: 25 } );

        var obj = new THREE.Mesh( geometry, materials );      
        obj.scale.set(2,2,2);
        obj.castShadow = true;
        obj.receiveShadow = true;
        scene.add(obj);
    });
}

JsonObjects.prototype.addanimatedObjects = function()
{
    this.loadAnimatedObject("json/sve.json","player","images/UV.png",this.animatedObjects);
    this.loadAnimatedObject("json/middleSword.json","middleSword","images/middleSword.png",this.animatedObjects);
    this.loadAnimatedObject("json/bigSword.json","longSword","images/bigswordUV.png",this.animatedObjects);
    this.loadAnimatedObject("json/knife.json","knife","images/bigswordUV.png",this.animatedObjects);
    this.loadAnimatedObject("json/bow.json","bow","images/lukUV.png",this.animatedObjects);
    this.loadAnimatedObject("json/chestjoj.json","chest","images/chestTexture.png",this.animatedObjects);
   
}

JsonObjects.prototype.addStaticObjects = function()
{
    //this.loadStaticObject("stubovi4.json","pillars");
     this.loader.load( "json/terrain.json", this.modelToScene );
}

JsonObjects.prototype.getAnimatedObject = function(name)
{
    return this.animatedObjects[name];
}

JsonObjects.prototype.getStaticObject = function(name)
{
    return this.staticObjects[name];
}

JsonObjects.prototype.modelToScene = function( geometry, materials,obj ) {
     var material = new THREE.MeshFaceMaterial( materials );
     var obj = new THREE.Mesh( geometry, material );
     obj.name="terrain";
     obj.scale.set(3.8,0.5,3.8);
     obj.receiveShadow=true;
    scene.add( obj );
}

