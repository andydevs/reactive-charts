/**
 * PieChart and PieStencil React components.
 *
 * Use PieStencil as a loading placeholder while data is being fetched,
 * then swap to PieChart once the data is ready. Both accept the same PieStyle
 * object so the layout remains consistent across the transition.
 */
import React, { ReactElement, useMemo } from 'react'
import _ from 'lodash'
import { PieCategory, PieStyle } from './types'
import { toSlices } from './toSlices'
import { ChartSvg } from '../support/svg'

/** Props for PieStencil. */
export interface PieStencilProps {
    style: PieStyle
}

/** Props for PieChart. */
export interface PieChartProps {
    style: PieStyle
    categories: PieCategory[]
}

/**
 * Loading skeleton for PieChart.
 * Renders an animated rotating gradient ring sized to match the given PieStyle,
 * using an SVG animateTransform so no CSS or JS animation is required.
 */
export function PieStencil({ style }: PieStencilProps): ReactElement {
    return (
        <ChartSvg params={style.svg}>
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
        </ChartSvg>
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
        <ChartSvg params={style.svg}>
            {slices.map((slice) => (
                <g key={slice.label.text} xlinkTitle={slice.label.text}>
                    <path d={slice.path} fill={slice.label.color} />
                    <line {...slice.labelStyle.line} stroke={slice.label.color} />
                    <text {...slice.labelStyle.anchor} fontStyle={slice.label.fontStyle} fill="white">
                        {slice.label.text}
                    </text>
                </g>
            ))}
        </ChartSvg>
    )
}
