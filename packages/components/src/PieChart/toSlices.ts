/**
 * Data transformation pipeline for pie/donut slices.
 */
import _ from 'lodash'
import { PieCategory, PieCollapsedStyle, PieLabel, PieStyle } from './types'
import { Slice, slicePath, sliceLabel } from './slice'

type Group = { label: PieLabel; value: number }

function normalize(cats: PieCategory[]): PieCategory[] {
    let total = _(cats).map('value').sum()
    return cats.map((cat) => _.update(cat, 'value', (x) => (Math.PI * 2 * x) / total))
}

function collapseSmallAngles(collapse: PieCollapsedStyle, groups: Group[]): Group[] {
    let groupsClone = _.cloneDeep(groups)
    let { label, minAngle } = collapse
    let value = 0
    while (groupsClone.length > 0 && value < minAngle) {
        value += groupsClone.pop()?.value || 0
    }
    groupsClone.push({ label, value })
    return groupsClone
}

function angleRanges(angles: number[]): [number, number][] {
    let startAngle = 0
    let ranges: [number, number][] = []
    for (const value of angles) {
        let endAngle = startAngle + value
        ranges.push([startAngle, endAngle])
        startAngle = endAngle
    }
    console.log('Angle Ranges:', ranges)
    return ranges
}

function createSlices(style: PieStyle, groups: Group[], ranges: [number, number][]): Slice[] {
    console.groupCollapsed('PieChart/createSlices')
    let slices = _.zipWith(groups, ranges, ({ label }, [startAngle, endAngle]) => {
        let labelStyle = sliceLabel(style, startAngle, endAngle)
        let path = slicePath(style, label, startAngle, endAngle)
        return { label, labelStyle, path }
    })
    console.groupEnd()
    return slices
}

export function toSlices(categories: PieCategory[], style: PieStyle): Slice[] {
    console.group('PieChart/toSlices')
    let maxCategories = style.maxCategories || categories.length
    let sortedAndTruncated = _(categories).sortBy(['value']).reverse().take(maxCategories).value()
    let groups = normalize(sortedAndTruncated)
    if (style.categoryCollapse) {
        groups = collapseSmallAngles(style.categoryCollapse, groups)
    }
    console.log('Groups:', groups)
    let ranges = angleRanges(_.map(groups, 'value'))
    let slices = createSlices(style, groups, ranges)
    console.log('Slices:', slices)
    console.groupEnd()
    return slices
}
