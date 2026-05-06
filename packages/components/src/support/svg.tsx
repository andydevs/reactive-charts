import { PropsWithChildren, ReactElement } from 'react'
import { SvgParams } from '../types'

export type SvgProps = { params: SvgParams }

/** Converts SvgParams to an SVG viewBox string centered at the origin. */
export const toViewBox = ({ width: w, height: h }: SvgParams) => `${-w / 2} ${-h / 2} ${w} ${h}`

/** SVG root element with a viewBox centered at the origin, sized to the given SvgParams. */
export function ChartSvg({ params, children }: PropsWithChildren<SvgProps>): ReactElement {
    return <svg viewBox={toViewBox(params)}>{children}</svg>
}
