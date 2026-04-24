export interface PieCategory {
    label: string
    color: string
    value: number
}

export interface PieCollapsedStyle {
    minAngle: number
    label: string
    color: string
}

export interface PieStyle {
    svg: {
        width: number
        height: number
    }
    data?: {
        maxCategories?: number
        collapse?: {
            minAngle: number
            color: string
            label: string
        }
    }
    angleGap: number
    maxRadius: number
    labelOffset: number
    donutThickness: number
    cornerRadius?: number
    labelPadding: number
    labelHeight: number
}
