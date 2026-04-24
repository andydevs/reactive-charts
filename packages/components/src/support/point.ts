export type Point = [number, number]

export const angleRadius = (th: number, r: number): Point => [
    r * Math.cos(th),
    -r * Math.sin(th),
]

export const moveAngleRadius = (p: Point, th: number, r: number): Point => [
    p[0] + r * Math.cos(th),
    p[1] - r * Math.sin(th),
]
