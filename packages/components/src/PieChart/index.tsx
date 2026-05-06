/**
 * PieChart and PieStencil React components.
 *
 * Use PieStencil as a loading placeholder while data is being fetched,
 * then swap to PieChart once the data is ready. Both accept the same PieStyle
 * object so the layout remains consistent across the transition.
 */
import React, { ReactElement, useMemo } from "react"
import _ from "lodash"
import { PieCategory, PieStyle, SvgParams } from "./types"
import { toSlices } from "./slice"
import { slicePath } from "./path"
import { labelAnchor, labelPath } from "./label"

/** Props for PieStencil. */
export interface PieStencilProps {
    style: PieStyle
}

/** Props for PieChart. */
export interface PieChartProps {
    style: PieStyle
    categories: PieCategory[]
}

/** Converts SvgParams to an SVG viewBox string centered at the origin. */
const toViewBox = ({ width: w, height: h }: SvgParams) => `${-w / 2} ${-h / 2} ${w} ${h}`

/**
 * Loading skeleton for PieChart.
 * Renders an animated rotating gradient ring sized to match the given PieStyle,
 * using an SVG animateTransform so no CSS or JS animation is required.
 */
export function PieStencil({ style }: PieStencilProps): ReactElement {
    return (
        <svg viewBox={toViewBox(style.svg)}>
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
                r={style.sliceMaxRadius - style.sliceThickness / 2}
                stroke="url(#gray-dient)"
                fillOpacity={0}
                strokeWidth={style.sliceThickness}
            />
        </svg>
    )
}

/**
 * Interactive SVG donut/pie chart.
 * Renders each PieCategory as a colored arc slice with a connecting label line and text.
 * Slice geometry and label positions are derived from the PieStyle configuration.
 */
export function PieChart({ style, categories }: PieChartProps): ReactElement {
    let slices = useMemo(() => toSlices(categories, style), [categories, style])
    return (
        <svg viewBox={toViewBox(style.svg)}>
            {slices.map((slice) => (
                <g key={slice.label.text} xlinkTitle={slice.label.text}>
                    <path d={slicePath(style, slice)} fill={slice.label.color} />
                    <line {...labelPath(style, slice)} stroke={slice.label.color} />
                    <text {...labelAnchor(style, slice)} fontStyle={slice.label.fontStyle} fill="white">
                        {slice.label.text}
                    </text>
                </g>
            ))}
        </svg>
    )
}
