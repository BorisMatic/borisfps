Terrain = function()
{
    this.light = new Light();
    this.floor = new Floor();
    this.skyBox= new SkyBox();
    this.walls = new Walls();
    this.pillars = jsonObjectLoader.loadStaticObject("json/stubovi4.json","pillars","images/pillartexture.png");
}

Terrain.prototype.addToScene = function(scene)
{
    scene.add(this.light.getModel());
    scene.add(this.light.getAmbient());
 //   scene.add(this.floor.getModel());
    scene.add(this.skyBox.getModel());
    scene.add(this.walls.getModel());
    scene.add(this.walls.getModel());
   // scene.add(this.pillars);
}

Terrain.prototype.setSkyBoxPosition = function(position)
{
    this.skyBox.setPosition(position);
}