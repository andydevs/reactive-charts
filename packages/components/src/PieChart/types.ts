import { SvgParams } from '../types'

/** Text label rendered next to a pie slice. */
export interface PieLabel {
    /** Display text for the label. */
    text: string
    /** CSS color value applied to the label text. */
    color: string
    /** CSS font-style value (e.g. `"normal"`, `"italic"`) applied to the label text. */
    fontStyle: string
}

/** A single data category represented as one slice in the pie chart. */
export interface PieCategory {
    /** Category label for the pie category */
    label: PieLabel
    /** Numeric value used to compute the slice's angular size relative to the total. */
    value: number
}

/** Configuration for collapsing small slices into a single "other" bucket. */
export interface PieCollapsedStyle {
    /** Label for the collapsed group */
    label: PieLabel
    /** Slices whose computed angle is smaller than this (radians) are folded into the bucket. */
    minAngle: number
}

/**
 * Visual and data configuration shared by PieChart and PieStencil.
 * All size values are in SVG user units.
 */
export interface PieStyle {
    /** Dimensions of the SVG viewport. */
    svg: SvgParams
    /** Maximum number of slices to display; excess categories are dropped or collapsed. */
    maxCategories?: number
    /** Collapse trailing small categories into a single bucket. */
    categoryCollapse?: PieCollapsedStyle
    /** Angular gap between adjacent slices, in radians. */
    sliceAngleGap: number
    /** Outer radius of the donut ring. */
    sliceMaxRadius: number
    /** Radial thickness of the donut ring (inner radius = maxRadius − donutThickness). */
    sliceThickness: number
    /** Corner radius applied to slice edges, in SVG units. Defaults to 0 if omitted. */
    sliceCornerRadius?: number
    /** Horizontal distance from the outer edge to the label line endpoint. */
    labelOffset: number
    /** Gap between the label line endpoint and the start of the label text. */
    labelPadding: number
    /** Vertical offset applied to position label text above the label line. */
    labelHeight: number
}
