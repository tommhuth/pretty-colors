import { useFrame, useThree } from "@react-three/fiber"
import { Color, MeshBasicMaterial } from "three"
import { useShader } from "../utils/hooks"
import { glsl } from "../utils/utils"
import noise from "../shaders/noise.glsl"

let colors = [
    new Color("#8400ff"),
    new Color("#ff333d"),
    new Color("#90e0ff"),
    new Color("#ffcb57")
]

for (let color of colors) {
    console.log("%c" + color, "color:#" + color.getHexString() + "; background-color: #" + color.getHexString() + ";")
}

export default function Plane() {
    let { viewport } = useThree()
    let height = Math.ceil(viewport.height * 3)
    let width = Math.ceil(viewport.width)
    let x = Math.ceil(viewport.width / .42)
    let y = Math.ceil((height) / .42)
    let [material, uniforms] = useShader({
        base: MeshBasicMaterial,
        wireframe: false,
        dithering: true,
        uniforms: {
            uTime: 0,
            uColors: colors,
            uHeight: height,
            uWidth: width,
            uActiveLayers: [0, 1, 1, 1],
            uLayers: [
                { // purple 
                    speed: [0, 0, 0],
                    clamp: [0, 1],
                    offset: [0, 0, 0],
                    frequency: 0,
                    strength: 0,
                },
                { // red
                    speed: [10, 1, 13.25],
                    clamp: [0.2, .6],
                    offset: [1, 0, 0],
                    frequency: .05,
                    strength: 1.5,
                },
                { // blue
                    speed: [6.4, .2, 9.1],
                    clamp: [.1, .8],
                    offset: [-5, -5, -5],
                    frequency: .125,
                    strength: 1,
                },
                {  //yellow
                    speed: [5, 4, 7],
                    clamp: [.1, .7],
                    offset: [5, 5, -5],
                    frequency: .075,
                    strength: 1,
                }
            ],
            uBaseColor: colors[0]
        },
        fragment: {
            pre: glsl`
                varying vec3 vColor;  
                uniform float uHeight;  
                varying vec4 vPosition; 
            `,
            main: glsl` 
                vec3 fog = mix(vColor, vec3(1., 1., 1.), 0.); //length(vPosition.xyz - cameraPosition) / 115.);

                gl_FragColor = vec4(fog, 1.0);
            `,
        },
        vertex: {
            pre: glsl` 
                uniform float uTime;
                varying vec3 vColor;
                varying vec4 vPosition;
                uniform float uActiveLayers[${colors.length}];
                uniform float uHeight;
                uniform float uWidth;
                uniform vec3 uBaseColor;
                uniform vec3 uColors[${colors.length}]; 
                uniform struct Layer {
                    vec3 speed; 
                    float frequency;
                    vec2 clamp; 
                    float strength;
                    vec3 offset;
                } uLayers[${colors.length}]; 

                vec3 blendNormal(vec3 base, vec3 blend) {
                    return blend;
                }
                
                vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
                    return (blendNormal(base, blend) * opacity + base * (1.0 - opacity));
                }

                ${noise}
            `,
            main: glsl`
                vColor = uBaseColor; 
                vPosition = modelViewMatrix * vec4(position, 1.);

                vec3 p = position * vec3(.15, .25, .15) + vec3(uTime, 0., uTime * .25);
                float magicExtra = .2;

                for (int i = 0; i < uColors.length(); i++) { 
                    if (uActiveLayers[i] == 1.) { 
                        Layer layer = uLayers[i];   
    
                        vColor = blendNormal(
                            vColor, 
                            uColors[i], 
                            smoothstep(
                                layer.clamp[0], 
                                layer.clamp[1],   
                                noise((position + layer.offset + uTime * layer.speed) * vec3(.5, 1, 1) * layer.frequency) * layer.strength + magicExtra
                            ) 
                        );   
                    }
                }

                float yScale = 1. - abs((position.y) / (uHeight * .5));
 
                // z is facing camera
                transformed.z = noise(p) * 2. * max(yScale, .35);  
            `
        }
    }) 

    useFrame((stat, delta) => {
        uniforms.uTime.value += .12 * delta
        uniforms.uTime.needsUpdate = true  
    })

    return (
        <mesh material={material} position={[0, 0, 0]}>
            <planeBufferGeometry args={[width, height, x, y]} />
        </mesh>
    )
}