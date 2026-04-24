import { SVGAttributes } from "react"
import { midAngle, Slice } from "./slice"
import { PieStyle } from "./types"
import { inRange } from "lodash"
import { angleRadius } from "../support/point"

export interface LabelAnchor {
    x: number
    y: number
    textAnchor: "end" | "start"
}

const isAngleLeft = (th: number): boolean => inRange(th, Math.PI / 2, (3 * Math.PI) / 2)

export function labelAnchor(style: PieStyle, slice: Slice): LabelAnchor {
    let mid = midAngle(slice)
    let y = -Math.sin(mid) * style.maxRadius - style.labelHeight
    let x = (isAngleLeft(mid) ? -1 : 1) * (style.maxRadius + style.labelOffset)
    return { x, y, textAnchor: isAngleLeft(mid) ? "end" : "start" }
}

export function labelPath(style: PieStyle, slice: Slice): Partial<SVGAttributes<SVGLineElement>> {
    let mid = midAngle(slice)
    let { x: x2, y: y2 } = labelAnchor(style, slice)
    x2 -= (isAngleLeft(mid) ? -1 : 1) * style.labelPadding
    y2 += style.labelHeight
    let [x1, y1] = angleRadius(mid, style.maxRadius)
    return { x1, y1, x2, y2 }
}
