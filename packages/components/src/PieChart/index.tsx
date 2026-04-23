import React, { ReactElement, SVGAttributes, useMemo } from "react"
import _, { slice } from "lodash"

export interface PieCategory {
    label: string
    value: number
    color: string
}

export const mrlCatLabel = _.property<PieCategory, PieCategory["label"]>(
    "label",
)
export const mrlCatValue = _.property<PieCategory, PieCategory["value"]>(
    "value",
)
export const mrlCatColor = _.property<PieCategory, PieCategory["color"]>(
    "color",
)

export interface PieStyle {
    svg: {
        width: number
        height: number
    }
    data?: {
        maxCategories?: number
        minimumSliceWidth?: number
    }
    angleGap: number
    maxRadius: number
    labelOffset: number
    donutThickness: number
    cornerRadius?: number
    labelPadding: number
    labelHeight: number
}

export type Point = [number, number]

export const ZERO: Point = [0, 0]

export const degrees = Math.PI / 180

export const quarter = Math.PI / 2

export const isLeft = (th: number): boolean =>
    _.inRange(th, quarter, 3 * quarter)

type Slice = {
    label: string
    color: string
    angles: {
        start: number
        end: number
    }
}

const midAngle = ({ angles: { start, end } }: Slice) => (start + end) / 2

const moveAngleRadius = (p: Point, th: number, r: number): Point => [
    p[0] + r * Math.cos(th),
    p[1] - r * Math.sin(th),
]

function slicePath(style: PieStyle, slice: Slice): string {
    let { maxRadius, donutThickness, angleGap } = style
    let cornerRadius = style.cornerRadius || 0
    let minRadius = style.maxRadius - donutThickness
    let start = slice.angles.start + angleGap
    let end = slice.angles.end - angleGap
    let [x0, y0] = moveAngleRadius(
        moveAngleRadius(ZERO, start, minRadius),
        start,
        cornerRadius,
    )
    let [x0b, y0b] = moveAngleRadius(
        moveAngleRadius(ZERO, start, minRadius),
        start + quarter,
        cornerRadius,
    )
    let [x1, y1] = moveAngleRadius(
        moveAngleRadius(ZERO, end, minRadius),
        end - quarter,
        cornerRadius,
    )
    let [x1b, y1b] = moveAngleRadius(
        moveAngleRadius(ZERO, end, minRadius),
        end,
        cornerRadius,
    )
    let [x2, y2] = moveAngleRadius(
        moveAngleRadius(ZERO, end, maxRadius),
        end,
        -cornerRadius,
    )
    let [x2b, y2b] = moveAngleRadius(
        moveAngleRadius(ZERO, end, maxRadius),
        end - quarter,
        cornerRadius,
    )
    let [x3, y3] = moveAngleRadius(
        moveAngleRadius(ZERO, start, maxRadius),
        start + quarter,
        cornerRadius,
    )
    let [x3b, y3b] = moveAngleRadius(
        moveAngleRadius(ZERO, start, maxRadius),
        start,
        -cornerRadius,
    )
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

function labelAnchor(
    style: PieStyle,
    slice: Slice,
): { x: number; y: number; textAnchor: "end" | "start" } {
    let mid = midAngle(slice)
    let y = -Math.sin(mid) * style.maxRadius - style.labelHeight
    let x = (isLeft(mid) ? -1 : 1) * (style.maxRadius + style.labelOffset)
    return { x, y, textAnchor: isLeft(mid) ? "end" : "start" }
}

function labelPath(
    style: PieStyle,
    slice: Slice,
): Partial<SVGAttributes<SVGLineElement>> {
    let { x: x2, y: y2 } = labelAnchor(style, slice)
    x2 -= (isLeft(midAngle(slice)) ? -1 : 1) * style.labelPadding
    y2 += style.labelHeight
    let angle = midAngle(slice)
    let x1 = style.maxRadius * Math.cos(angle)
    let y1 = -style.maxRadius * Math.sin(angle)
    return { x1, y1, x2, y2 }
}

export function PieStencil({ style }: { style: PieStyle }): ReactElement {
    let { width, height } = style.svg
    return (
        <svg viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}>
            <linearGradient id="gray-dient">
                <stop offset="0%" stopColor="#999" />
                <stop offset="100%" stopColor="white" />
                <animateTransform
                    attributeName="gradientTransform"
                    attributeType="XML"
                    type="rotate"
                    from="0"
                    to="360"
                    dur="5s"
                    repeatCount="indefinite"
                />
            </linearGradient>
            <circle
                x={0}
                y={0}
                r={style.maxRadius - style.donutThickness / 2}
                stroke="url(#gray-dient)"
                fillOpacity={0}
                strokeWidth={style.donutThickness}
            />
        </svg>
    )
}

const COLLAPSE_GROUP_LABEL = "others"
const COLLAPSE_GROUP_COLOR = "#555"

export function PieChart({
    style,
    categories,
}: {
    style: PieStyle
    categories: PieCategory[]
}) {
    console.groupCollapsed("<PieChart/>")
    console.log("Style:", style)

    // Sort and truncate to max categories
    let sorted = useMemo(
        () =>
            _(_.cloneDeep(categories)).sortBy([mrlCatValue]).reverse().value(),
        [categories],
    )
    let truncated = useMemo(
        () => _.take(sorted, style.data?.maxCategories || sorted.length),
        [sorted, style.data?.maxCategories],
    )
    console.log(`Truncated:`, truncated)

    // Normalize categories to angle widths
    let total = truncated.map(mrlCatValue).reduce(_.add)
    let angles = truncated.map((category) => ({
        label: category.label,
        color: category.color,
        value: (2 * Math.PI * category.value) / total,
    }))
    console.log("Angles:", angles)

    // Collapse angles smaller than minimum width
    if (style.data?.minimumSliceWidth) {
        console.group("[collapse angles]")
        let group = angles.pop()
        console.log("Group", group)
        if (group) {
            if (group.value < style.data.minimumSliceWidth) {
                group.label = COLLAPSE_GROUP_LABEL
                group.color = COLLAPSE_GROUP_COLOR
                while (
                    angles.length > 0 &&
                    group.value < style.data.minimumSliceWidth
                ) {
                    let nextGroup = angles.pop()
                    group.value += nextGroup?.value || 0
                }
            }
            angles.push(group)
        }
        console.groupEnd()
    }

    // Create slices with angle ranges from angle widths
    let lastAngle = 0
    let slices: Slice[] = []
    angles.forEach((category) => {
        slices.push({
            label: category.label,
            color: category.color,
            angles: {
                start: lastAngle,
                end: lastAngle + category.value,
            },
        })
        lastAngle += category.value
    })
    console.log("Slices:", slices)

    console.log(
        "Slice Paths:",
        slices.map((s) => slicePath(style, s)),
    )
    console.groupEnd()

    // Build SVG
    let { width, height } = style.svg
    return (
        <svg viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}>
            {slices.map((slice) => (
                <g key={slice.label} xlinkTitle={slice.label}>
                    <path d={slicePath(style, slice)} fill={slice.color} />
                    <line {...labelPath(style, slice)} stroke={slice.color} />
                    <text
                        {...labelAnchor(style, slice)}
                        fill="white"
                        fontStyle={
                            slice.label == COLLAPSE_GROUP_LABEL
                                ? "italic"
                                : "normal"
                        }
                    >
                        {slice.label}
                    </text>
                </g>
            ))}
        </svg>
    )
}
