JsonObjects = function()
{
    this.loader = new THREE.JSONLoader();
    this.loader.showStatus = true;
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
    var kk =this.loader.load( fileName, function( geometry,materials ) {
        materials = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( uv ),ambient: 0x999999, color: 0xffffff, specular: 0xffffff, shininess: 25 } );

        var obj = new THREE.Mesh( geometry, materials );      
        obj.scale.set(2,2,2);
        obj.castShadow = true;
        obj.receiveShadow = true;
        scene.add(obj);
        return obj;
    });
    return kk;
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
    /* this.loader.load( "json/terrain.json", this.modelToScene );
     this.loader.load( "json/drvo.json", this.treeToScene );*/
    this.kkStaticObject("json/terrain.json", "terrain");
    this.kkStaticObject("json/drvo.json", "tree");
    this.kkStaticObject("json/knifeStatic.json", "knife");
    this.kkStaticObject("json/arrow.json", "arrow");
    this.kkStaticObject("json/temple.json", "temple");
    this.kkStaticObject("json/bigTemple.json", "bigTemple");
    this.kkStaticObject("json/chestjoj.json","chest","images/chestTexture.png");
}

JsonObjects.prototype.getAnimatedObject = function(name)
{
    return this.animatedObjects[name];
}

JsonObjects.prototype.getStaticObject = function(name)
{
    return this.staticObjects[name];
}


JsonObjects.prototype.kkStaticObject = function(fileName,name)
{
    var staticObjects = this.staticObjects;
    this.loader.load( fileName, function( geometry, materials,obj ) {
        var material = new THREE.MeshFaceMaterial( materials );
        var obj = new THREE.Mesh( geometry, material );
        obj.name=name;  
        obj.receiveShadow=true;
       // obj.castShadow=true;

        if (name == "tree") {
            var pom1 = obj.clone();
            pom1.position.set(-55,7,25);
            scene.add(pom1);
            var pom2 = obj.clone();
            pom2.position.set(-55,6,0);
            scene.add(pom2);
            var pom3 = obj.clone();
            pom3.scale.set(2,0.75,2);
            pom3.rotation.set(3,0.75,3);
            pom3.position.set(-75,10,-55);
            scene.add(pom3);
        }
            staticObjects[name]=obj;   
        if (name!="chest") 
        {
            scene.add( obj ); 
        }        
    });

}



