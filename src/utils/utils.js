export function glsl(t) {
    for (var o = [t[0]], i = 1, l = arguments.length; i < l; i++) {
        o.push(arguments[i], t[i])
    }

    return o.join("")
}