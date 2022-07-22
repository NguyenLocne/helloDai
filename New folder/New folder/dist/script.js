window.addEventListener("DOMContentLoaded", () => {
  const app = new App();

  app.init();
  app.render();
  window.addEventListener("resize", () => {
    app.onResize();
  });
});

class App {
  //レンダラーセッティング
  static get RENDERER_SETTING() {
    return {
      clearColor: 0xffffff,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  //マテリアルセッティング
  static get MATERIAL_SETTING() {
    return {
      color: 0xffffff,
    };
  }

  //コンストラクタ
  constructor() {
    this.renderer;
    this.scene;
    this.camera;
    this.geometory;
    this.material;
    this.curve;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.render = this.render.bind(this);
  }

  _setRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(new THREE.Color(App.RENDERER_SETTING.clearColor));
    this.renderer.setSize(App.RENDERER_SETTING.width, App.RENDERER_SETTING.height);
    const canvas = document.querySelector("#webgl");
    canvas.appendChild(this.renderer.domElement);
  }

  _setScene() {
    this.scene = new THREE.Scene();
  }

  _setCamera() {
    this.camera = new THREE.PerspectiveCamera((2 * Math.atan(this.height / 2 / 100) * 180) / Math.PI, this.width / this.height, 1, 1000);
    this.camera.position.set(0, 0, 100);
    this.camera.updateProjectionMatrix();
  }

  _setMesh() {
    this.geometory = new THREE.PlaneBufferGeometry(this.width, this.height, 100, 100);
    this.material = new THREE.ShaderMaterial({
      vertexShader: `
      varying vec2 vUv;
      uniform vec2 uResolution;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
      
      `,
      fragmentShader: `
      varying vec2 vUv;
      uniform float motion;
      float PI = 3.141529;

      void main() {
        vec2 newUV = vUv;
        float bottom = abs(1.0 - motion);
        float curveStrength = 0.8;
        float waveStrength = 1.0;
        float curve = motion + (sin(newUV.y * PI * waveStrength) * motion - motion) * bottom * curveStrength;
        float color = step(curve,newUV.x);
        gl_FragColor = vec4(color,color,color,1.0);
      }
      `,
      transparent: true,
      uniforms: {
        motion: {
          value: 0.0,
        },
      },
    });
    this.curve = new THREE.Mesh(this.geometory, this.material);
    this.scene.add(this.curve);
  }

  //初期化処理
  init() {
    this._setRenderer();
    this._setScene();
    this._setCamera();
    this._setMesh();

    const tl = gsap.timeline();
    const imgElement = document.querySelector(".img");
    tl.to(this.material.uniforms.motion, {
      value: 1,
      duration: 1,
    })
      .to(
        imgElement,
        {
          width: '500px',
          duration: 0.8,
        },
        "<0.9"
      )
  }

  //描画処理
  render() {
    requestAnimationFrame(this.render);
    this.renderer.render(this.scene, this.camera);
  }
  //リサイズ処理
  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.camera.updateProjectionMatrix();
  }
}
var animateButton = function(e) {

  e.preventDefault;
  //reset animation
  e.target.classList.remove('animate');
  
  e.target.classList.add('animate');
  setTimeout(function(){
    e.target.classList.remove('animate');
  },700);
};

var bubblyButtons = document.getElementsByClassName("bubbly-button");

for (var i = 0; i < bubblyButtons.length; i++) {
  bubblyButtons[i].addEventListener('click', animateButton, false);
}