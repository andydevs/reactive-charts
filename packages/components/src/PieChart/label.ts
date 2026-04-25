/**
 * Label positioning utilities for PieChart slice labels.
 *
 * Each label is composed of a connecting line from the slice outer edge to a
 * text anchor positioned outside the donut ring, on the left or right side
 * depending on which half of the chart the slice falls in.
 */
import { SVGAttributes } from "react"
import { midAngle, Slice } from "./slice"
import { PieStyle } from "./types"
import { inRange } from "lodash"
import { angleRadius } from "../support/point"

/** SVG attributes for a label text element. */
export interface LabelAnchor {
    x: number
    y: number
    /** "end" for slices on the left half, "start" for slices on the right half. */
    textAnchor: "end" | "start"
}

/** Returns true when angle `th` (radians) falls in the left half of the chart (90°–270°). */
const isAngleLeft = (th: number): boolean => inRange(th, Math.PI / 2, (3 * Math.PI) / 2)

/**
 * Computes the x/y position and text alignment for a slice's label text element.
 * Labels are placed at a fixed horizontal distance outside the ring, vertically
 * aligned to the slice midpoint angle.
 */
export function labelAnchor(style: PieStyle, slice: Slice): LabelAnchor {
    let mid = midAngle(slice)
    let y = -Math.sin(mid) * style.maxRadius - style.labelHeight
    let x = (isAngleLeft(mid) ? -1 : 1) * (style.maxRadius + style.labelOffset)
    return { x, y, textAnchor: isAngleLeft(mid) ? "end" : "start" }
}

/**
 * Computes SVG line attributes connecting the slice outer edge to its label anchor.
 * The line starts at the midpoint angle on the outer radius and ends just before
 * the label text, offset inward by `labelPadding`.
 */
export function labelPath(style: PieStyle, slice: Slice): Partial<SVGAttributes<SVGLineElement>> {
    let mid = midAngle(slice)
    let { x: x2, y: y2 } = labelAnchor(style, slice)
    x2 -= (isAngleLeft(mid) ? -1 : 1) * style.labelPadding
    y2 += style.labelHeight
    let [x1, y1] = angleRadius(mid, style.maxRadius)
    return { x1, y1, x2, y2 }
}
