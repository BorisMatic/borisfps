Light = function()
{
    this.ambient = new THREE.AmbientLight( 0x282828 );

    this.light = new THREE.DirectionalLight(0xC7C7C7, 1);
    this.light.position.set(1, 8, -2);
    this.castShadow();

}

Light.prototype.getModel= function()
{
    return this.light;
}

Light.prototype.getAmbient= function()
{
    return this.ambient;
}

Light.prototype.castShadow= function()
{
    this.light.castShadow = true;
    this.light.shadowDarkness = 0.5;
    this.light.shadowMapWidth = 2048;
    this.light.shadowMapHeight = 2048;
    this.light.position.set(-100, 150, -300);
    this.light.shadowCameraFar = 1000;
    // this.light.shadowCameraVisible = true;

    // Directional light only; not necessary for Point light
    this.light.shadowCameraLeft = -200;
    this.light.shadowCameraRight = 200;
    this.light.shadowCameraTop = 200;
    this.light.shadowCameraBottom = -200;
}
