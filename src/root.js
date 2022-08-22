import "../assets/styles/app.scss"

import { createRoot, extend } from "@react-three/fiber"
import { MeshBasicMaterial } from "three"
import App from "./App"

extend({
    MeshBasicMaterial, 
})

const root = createRoot(document.getElementById("canvas")) 

window.addEventListener("resize", () => {
    root.configure({
        size: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        orthographic: true,
        camera: {
            zoom: 80  
        },
        dpr: window.devicePixelRatio * .4,
        linear: true,
        flat: true,
        gl: {
            antialias: true,
            depth: false,
            stencil: false,
            alpha: false
        }
    })
    root.render(<App />) 
}) 

window.dispatchEvent(new Event("resize"))