/** A single data category represented as one slice in the pie chart. */
export interface PieCategory {
    /** Display label rendered next to the slice. */
    label: string
    /** Fill color for the slice and its label line — any valid CSS color string. */
    color: string
    /** Numeric value used to compute the slice's angular size relative to the total. */
    value: number
}

/** Configuration for collapsing small slices into a single "other" bucket. */
export interface PieCollapsedStyle {
    /** Slices whose computed angle is smaller than this (radians) are folded into the bucket. */
    minAngle: number
    /** Label shown for the collapsed bucket. */
    label: string
    /** Fill color for the collapsed bucket slice. */
    color: string
}

/**
 * Visual and data configuration shared by PieChart and PieStencil.
 * All size values are in SVG user units.
 */
export interface PieStyle {
    /** Dimensions of the SVG viewport. */
    svg: {
        width: number
        height: number
    }
    /** Optional data-shaping options applied before rendering. */
    data?: {
        /** Maximum number of slices to display; excess categories are dropped or collapsed. */
        maxCategories?: number
        /** Collapse trailing small slices into a single bucket. */
        collapse?: {
            minAngle: number
            color: string
            label: string
        }
    }
    /** Angular gap between adjacent slices, in radians. */
    angleGap: number
    /** Outer radius of the donut ring. */
    maxRadius: number
    /** Horizontal distance from the outer edge to the label line endpoint. */
    labelOffset: number
    /** Radial thickness of the donut ring (inner radius = maxRadius − donutThickness). */
    donutThickness: number
    /** Corner radius applied to slice edges, in SVG units. Defaults to 0 if omitted. */
    cornerRadius?: number
    /** Gap between the label line endpoint and the start of the label text. */
    labelPadding: number
    /** Vertical offset applied to position label text above the label line. */
    labelHeight: number
}
