/** Polar-coordinate math helpers used by SVG path generation. */

/** A 2-D Cartesian point as [x, y]. */
export type Point = [number, number]

/**
 * Converts polar coordinates to a Cartesian point.
 * The y-axis is inverted relative to standard math (positive y is down in SVG),
 * so the angle increases clockwise from the 3-o'clock position.
 */
export const angleRadius = (th: number, r: number): Point => [
    r * Math.cos(th),
    -r * Math.sin(th),
]

/**
 * Translates point `p` by distance `r` in direction `th`.
 * Used to offset corner-radius arc control points along a slice edge tangent.
 */
export const moveAngleRadius = (p: Point, th: number, r: number): Point => [
    p[0] + r * Math.cos(th),
    p[1] - r * Math.sin(th),
]
