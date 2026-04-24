import _ from "lodash"
import { moveAngleRadius, angleRadius } from "../support/point"
import { PieCategory, PieCollapsedStyle, PieStyle } from "./types"

export type Slice = {
    label: string
    color: string
    angles: {
        start: number
        end: number
    }
}

export function toSlices(categories: PieCategory[], { data }: PieStyle): Slice[] {
    // Data-Related style
    let maxCategories = data?.maxCategories || categories.length

    // Get top n categories and normalize values
    let sortedAndTruncated = _(categories)
        // Sort and get top n cats
        .sortBy(["value"])
        .reverse()
        .take(maxCategories)
        .value()

    // Normalize values to angles
    let total = _(sortedAndTruncated).map("value").sum()
    let angles = _(sortedAndTruncated)
        .map((cat) => _.update(cat, "value", (v) => (2 * Math.PI * v) / total))
        .value()

    // Collapse small angles
    if (data?.collapse) {
        let { label, color, minAngle } = data.collapse
        let value = 0
        while (angles.length > 0 && value < minAngle) {
            value += angles.pop()?.value || 0
        }
        angles.push({ label, color, value })
    }

    // Generate slices
    let last = 0
    let slices: Slice[] = []
    for (const { label, color, value } of angles) {
        let next = last + value
        let angles = { start: last, end: next }
        slices.push({ label, color, angles })
        last = next
    }
    return slices
}

export const midAngle = ({ angles: { start, end } }: Slice) => (start + end) / 2

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
