import { Color, DoubleSide, Mesh, PlaneBufferGeometry, ReplaceStencilOp, ShaderMaterial, TextureLoader, Vector2 } from 'three'

import World from '@js/World'
import { Store } from './Store'

import vertex from '@glsl/vertex.vert'
import fragment from '@glsl/fragment.frag'

const tVec2a = new Vector2()

class Images {
   constructor(opt) {
      this.meshStorage = []
      this.imageStorage = []

      this.imagePlane = {}

      this.images = [...document.querySelectorAll('.images')]

      this.initialized = false

      this.init()
   }
   
   init() {
      this.setGeometry()
      this.resize()
      
      this.loader = new TextureLoader()

      this.addImages()
      .then( () => {
         console.log('done')
         this.initialized = true
      })
   }
  
   async addImages() {
      return Promise.all(this.images.map( imgD => {
         new Promise ( resolve => {
            new Promise ( resolve => {
               const imgT = this.loader.load(imgD.src)

               setTimeout(() => {
                  resolve(imgT)
               }, 100);
            })
            .then( e => {
               const image = {
                  imageDom: imgD,
                  imageTexture: e
               }
         
               this.addImage(image)
               .then( e => {
                  resolve(e)
               })
            })
         })
      })).then( () => {
         this.initialized = true
      })
   }
   
   setGeometry() {
      this.imagePlane.geometry = new PlaneBufferGeometry(1, 1, 30, 30)
   }

   async addImage(image) {
      return new Promise ( resolve => {
         const width = image.imageDom.getBoundingClientRect().width
         const height = image.imageDom.getBoundingClientRect().height
   
         this.imagePlane.material = new ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
               uTime: { value: 0 },
               uTexture: { value: image.imageTexture },
               uColor: { value: new Color(0xffffff) },
               uStrength: { value: 0 },
               uAlpha: { value: .7 },
               uAspect: { value: tVec2a.set(Store.sizes.width, Store.sizes.height) },
               uPixelRatio: { value: window.devicePixelRatio }
            },
            side: DoubleSide,
            transparent: true
         })
   
         this.imagePlane.mesh = new Mesh(this.imagePlane.geometry, this.imagePlane.material)
         this.imagePlane.mesh.frustumCulled = false
   
         this.imagePlane.mesh.scale.set(width, height, 1)
   
         this.setPositions(this.imagePlane.mesh, image.imageDom)
   
         this.meshStorage.push(this.imagePlane.mesh)
         this.imageStorage.push(image.imageDom)
   
         World.add(this.imagePlane.mesh)

         resolve()
      })
   }

   setPositions(mesh, img) {
      const x = img.getBoundingClientRect().left - Store.sizes.width / 2 + img.getBoundingClientRect().width / 2
      const y = -img.getBoundingClientRect().top + Store.sizes.height / 2 - img.getBoundingClientRect().height / 2

      mesh.position.set(x, y, 0)
   }

   resize() {
      window.addEventListener('resize', () => {
         this.imagePlane.material.uniforms.uAspect.value = tVec2a.set(Store.sizes.width, Store.sizes.height)
         this.imagePlane.material.uniforms.uPixelRatio.value = window.devicePixelRatio
      })
   }

   update(et) {
      if (!this.initialized) return

      this.meshStorage.forEach( (mesh, i) => {
         this.setPositions(mesh, this.imageStorage[i])
         mesh.material.uniforms.uTime.value = et
         mesh.material.uniforms.uStrength.value = window.smoothScrollProgress
     })
   }
}

export default Images