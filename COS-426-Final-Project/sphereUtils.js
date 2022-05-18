
export default function createSphere(radius){
    let geometry = new THREE.SphereGeometry(radius, 50, 70);

    let sMaterial = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        specular: 0x0800ff,
        shininess: 100,
        flatShading: true,
    });

    let sphere = new THREE.Mesh(geometry, sMaterial);
    sphere.position.set(4.5, 0, 0);
    return sphere;
};

