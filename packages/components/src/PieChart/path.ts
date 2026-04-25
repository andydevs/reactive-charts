/**
 * SVG arc path generation for donut slices.
 */
import { moveAngleRadius, angleRadius } from "../support/point"
import { PieStyle } from "./types"
import { Slice } from "./slice"

/**
 * Generates the SVG `d` attribute string for a donut slice with optional rounded corners.
 *
 * The path traces the inner arc, two corner arcs at each radial edge, and the outer arc,
 * forming a closed donut segment. Corner arcs are approximated with SVG `A` commands.
 */
export function slicePath(style: PieStyle, slice: Slice): string {
    let { maxRadius, donutThickness, angleGap } = style
    let cornerRadius = style.cornerRadius || 0
    let minRadius = style.maxRadius - donutThickness
    let start = slice.angles.start + angleGap
    let end = slice.angles.end - angleGap
    let [x0, y0] = moveAngleRadius(angleRadius(start, minRadius), start, cornerRadius)
    let [x0b, y0b] = moveAngleRadius(angleRadius(start, minRadius), start + Math.PI / 2, cornerRadius)
    let [x1, y1] = moveAngleRadius(angleRadius(end, minRadius), end - Math.PI / 2, cornerRadius)
    let [x1b, y1b] = moveAngleRadius(angleRadius(end, minRadius), end, cornerRadius)
    let [x2, y2] = moveAngleRadius(angleRadius(end, maxRadius), end, -cornerRadius)
    let [x2b, y2b] = moveAngleRadius(angleRadius(end, maxRadius), end - Math.PI / 2, cornerRadius)
    let [x3, y3] = moveAngleRadius(angleRadius(start, maxRadius), start + Math.PI / 2, cornerRadius)
    let [x3b, y3b] = moveAngleRadius(angleRadius(start, maxRadius), start, -cornerRadius)
    let lrg = end - start > Math.PI ? 1 : 0
    return `
        M ${x0} ${y0}
        A ${cornerRadius} ${cornerRadius} 0 0 1 ${x0b} ${y0b}
        A ${minRadius} ${minRadius} 0 ${lrg} 0 ${x1} ${y1}
        A ${cornerRadius} ${cornerRadius} 0 0 1 ${x1b} ${y1b}
        L ${x2} ${y2}
        A ${cornerRadius} ${cornerRadius} 0 0 1 ${x2b} ${y2b}
        A ${maxRadius} ${maxRadius} 0 ${lrg} 1 ${x3} ${y3}
        A ${cornerRadius} ${cornerRadius} 0 0 1 ${x3b} ${y3b}
        L ${x0} ${y0}
        Z
    `
}
