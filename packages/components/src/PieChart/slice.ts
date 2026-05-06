/**
 * Data transformation pipeline for pie/donut slices.
 */
import _ from "lodash"
import { PieCategory, PieDataStyle, PieLabel } from "./types"

/** A fully resolved pie slice ready for SVG rendering. */
export type Slice = {
    /** Label for slice */
    label: PieLabel
    /** Angle range of slice (start and end) */
    angles: {
        /** Start angle in radians. */
        start: number
        /** End angle in radians. */
        end: number
    }
}

/**
 * Transforms raw category data into renderable Slice objects.
 *
 * Pipeline:
 * 1. Sort by value descending and take the top `maxCategories`.
 * 2. Normalize raw values to radians so the total spans 0–2π.
 * 3. Optionally collapse trailing small-angle slices into a single "other" bucket.
 * 4. Assign cumulative start/end angles to each slice.
 */
export function toSlices(categories: PieCategory[], data: PieDataStyle): Slice[] {
    // Data-Related style
    let maxCategories = data.maxCategories || categories.length

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
        .map((cat) => _.update(cat, "value", (x) => (Math.PI * 2 * x) / total))
        .value()

    // Collapse small angles
    if (data?.collapse) {
        let { label, minAngle } = data.collapse
        let value = 0
        while (angles.length > 0 && value < minAngle) {
            value += angles.pop()?.value || 0
        }
        angles.push({ label, value })
    }

    // Generate slices
    let start = 0
    let slices: Slice[] = []
    for (const { label, value } of angles) {
        let end = start + value
        slices.push({ label, angles: { start, end } })
        start = end
    }
    return slices
}

/** Returns the midpoint angle of a slice in radians. */
export const midAngle = ({ angles: { start, end } }: Slice) => (start + end) / 2
