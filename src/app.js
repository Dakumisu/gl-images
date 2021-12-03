import './main.scss'

import luge from '@waaark/luge' // do you know luge ?

import World from '@src/js/World' // Création de la scène + renderer + camera
import Mouse from '@js/Mouse' // Obtenir la position de la souris dans tous les environnement
import Raycaster from '@js/Raycaster' // Création de raycasters si besoin
import Settings from '@js/Settings' // Dat.gui (toujours pour le debbugage)
import Device from '@js/Device'
import Raf from '@js/Raf'
import Images from '@js/Images'

const images = new Images()

document.addEventListener('keydown', e => {
    console.log(`${e.key} touch pressed`)
})

Raf.suscribe('update', () => { update() })

function update() {
    World.render()

    images.update(Raf.timeElapsed)
}