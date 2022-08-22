import { useThree } from "@react-three/fiber"
import { useLayoutEffect } from "react"   

export default function Camera({ startPosition = [0, -26, 10] }) {
    let { camera } = useThree()

    useLayoutEffect(() => {
        camera.position.set(...startPosition)
        camera.lookAt(0, 0, 0)
    }, [camera, ...startPosition]) 

    return null
}