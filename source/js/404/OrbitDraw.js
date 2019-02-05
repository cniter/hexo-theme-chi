// from: http://www.jb51.net/jiaoben/576717.html

createScene();
createObjects();
loop();

function createScene() {
    width = $('#scene').width();
    height = $('#scene').height();
    ratio = width / height;
    w2 = width / 2;
    h2 = height / 2;
    fov = 60;
    near = 1;
    far = 20000;
    scene = new THREE.Scene();
    // scene.fog = new THREE.Fog(0x363d3d, -1, 3000 );
    camera = new THREE.PerspectiveCamera(fov, ratio, near, far);
    camera.position.z = $('#scene').height() + $('#scene').width()/2;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    container = document.getElementById('scene');
    container.appendChild(renderer.domElement);
    addListeners();
    controls = new THREE.OrbitControls(camera, renderer.domElement);
}

function addListeners() {
    function handleMouseMove(event) {
        mouse = { x: event.clientX, y: event.clientY };
    }
    function handleMouseDown(event) {
        //
    }
    function handleMouseUp(event) {
        //
    }
    function handleTouchStart(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
            mousePos = { x: event.touches[0].pageX, y: event.touches[0].pageY };
        }
    }
    function handleTouchEnd(event) {
        mousePos = { x: windowHalfX, y: windowHalfY };
    }
    function handleTouchMove(event) {
        if (event.touches.length == 1) {
            event.preventDefault();
            mousePos = { x: event.touches[0].pageX, y: event.touches[0].pageY };
        }
    }
    function onWindowResize() {
        width = $('#scene').width();
        height = $('#scene').height();
        w2 = width / 2;
        h2 = height / 2;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', handleMouseMove, false);
    document.addEventListener('mousedown', handleMouseDown, false);
    document.addEventListener('mouseup', handleMouseUp, false);
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchend', handleTouchEnd, false);
    document.addEventListener('touchmove', handleTouchMove, false);
}

function createObjects() {
    var texture = new THREE.CanvasTexture(sprite());
    var geometry = new THREE.Geometry();
    var material = new THREE.PointsMaterial({
        size: 8,
        map: texture,
        vertexColors: THREE.VertexColors,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
    });
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function sprite() {
    var canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    var ctx = canvas.getContext('2d');
    var gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(240,255,240,1)');
    gradient.addColorStop(0.22, 'rgba(0,150,255,.2)');
    gradient.addColorStop(1, 'rgba(0,50,255,0)');
    ctx.fillStyle = gradient; // "#FFFFFF"; // gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
}

function loop(time) {
    vortex();
    particles.rotation.z -= 0.0025;
    render();
    requestAnimationFrame(loop);
}

var tick = 0;
var axis = new THREE.Vector3(0, 0, 1);
function vortex() {
    if (tick % 2 === 0 && params && params.vortex !== 0) {
        for (var i = 0; i < particles.geometry.vertices.length; i++) {
            var vertex = particles.geometry.vertices[i];
            var angle = -Math.PI / 180;
            if (params.vortex > 0) {
                angle *= (1 - vertex.length() / params.radius) * params.vortex;
            } else {
                angle *= vertex.length() / params.radius * Math.abs(params.vortex);
            }
            vertex.applyAxisAngle(axis, angle);
        }
        particles.geometry.verticesNeedUpdate = true;
    }
    tick++;
}

var params = function GalaxyParameters() {
    function GalaxyParameters() {
        this.arms = 6, this.stops = 5000, this.revolutions = 1.7, this.radius = Math.min($('#scene').height(), $('#scene').width()), this.sparse = 0.1, this.dispersion = 1, // more 0 - less 1
            this.bulge = 0.6, this.vortex = 0.8,
            this.armTheta = function () {
                return Math.PI * 2 / this.arms;
            };
        this.modulus = function () {
            return Math.pow(2, 31);
        };
    }
    return new GalaxyParameters();
}();
onChange(params);

function onChange(params) {
    var dx = 10 - 10 * params.dispersion * (1 - params.bulge);
    var dy = 10 - 10 * params.dispersion * (1 - params.bulge);
    var dz = 40 - 40 * params.dispersion * (1 - params.bulge);
    // let geometry = particles.geometry;
    var geometry = new THREE.Geometry();
    // geometry.vertices.splice(0, geometry.vertices.length);
    var points = spiral(params).toArray();
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        var distance = Math.pow(Math.pow(point.x, 2) + Math.pow(point.y, 2), 0.5);
        var pow = Math.max(0, (params.radius * .8 - distance) / (params.radius * .8));
        pow = (1 - Math.cos(pow * Math.PI)) * params.bulge;
        // console.log(distance);
        var vertex = new THREE.Vector3();
        vertex.x = point.x;
        vertex.y = point.y;
        vertex.z = (-dz + dz * 2 * Math.random()) * pow; // (Math.random() * 180 - 90) * (pow * pow * pow);
        geometry.vertices.push(vertex);
        geometry.colors.push(new THREE.Color(pow, pow, 1));
        var t = Math.round(pow * 5),
            n = 0;
        while (n < t) {
            var _vertex = new THREE.Vector3();
            _vertex.x = point.x - dx + Math.random() * (dx * 2);
            _vertex.y = point.y - dy + Math.random() * (dy * 2);
            _vertex.z = (-dz + dz * 2 * Math.random()) * pow;
            geometry.vertices.push(_vertex);
            geometry.colors.push(new THREE.Color(pow, pow, 1));
            n++;
        }
    }
    geometry.mergeVertices();
    geometry.verticesNeedUpdate = true;
    particles.geometry = geometry;
}

function spiral(params) {
    function lcg(value) {
        var modulus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Math.pow(2, 31);
        var multiplier = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1103515245;
        var increment = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 12345;

        return (value * multiplier + increment) % modulus;
    }
    return {
        toArray: function toArray() {
            var now = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            var time = now / -60000,
                modulus = params.modulus(),
                theta = params.armTheta();
            var points = [];
            var value = 0;
            for (var arm = 0; arm < params.arms; arm++) {
                for (var stop = 0; stop < params.stops; stop++) {
                    value = lcg(value, modulus);
                    var pow = stop / params.stops,
                        c = 1 - pow + 1 - params.dispersion,
                        r = value / modulus,
                        cr = (r - .5) * 2,
                        angle = pow * Math.PI * 2 * params.revolutions + theta * arm,
                        radians = time + angle + Math.PI * c * cr * params.sparse,
                        distance = Math.sqrt(pow) * params.radius,
                        x = Math.cos(radians) * distance,
                        y = Math.sin(radians) * distance,
                        z = 0,
                        size = (r - .5) * 2 + Math.pow(1.125, (1 - pow) * 8),
                        alpha = (Math.sin((r + time + pow) * Math.PI * 2) + 1) * 0.5;
                    points.push({
                        x: x, y: y, z: z,
                        size: size, alpha: alpha
                    });
                }
            }
            return points;
        }
    };
}

function render() {
    if (controls) {
        controls.update();
    }
    renderer.render(scene, camera);
}