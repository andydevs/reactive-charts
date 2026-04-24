import React, { ReactElement, useMemo } from "react"
import _ from "lodash"
import { PieCategory, PieStyle } from "./types"
import { Slice, slicePath, toSlices } from "./slice"
import { labelAnchor, labelPath } from "./label"

export interface PieStencilProps {
    style: PieStyle
}

export interface PieChartProps {
    style: PieStyle
    categories: PieCategory[]
}

export function PieStencil({ style }: PieStencilProps): ReactElement {
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

export function PieChart({ style, categories }: PieChartProps): ReactElement {
    let slices = toSlices(categories, style)
    let { width, height } = style.svg
    return (
        <svg viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}>
            {slices.map((slice) => (
                <g key={slice.label} xlinkTitle={slice.label}>
                    <path d={slicePath(style, slice)} fill={slice.color} />
                    <line {...labelPath(style, slice)} stroke={slice.color} />
                    <text {...labelAnchor(style, slice)} fill="white">
                        {slice.label}
                    </text>
                </g>
            ))}
        </svg>
    )
}
