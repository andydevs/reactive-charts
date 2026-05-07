/**
 * Data transformation pipeline for pie/donut slices.
 */
import _ from 'lodash'
import { PieCategory, PieCollapsedStyle, PieLabel, PieStyle } from './types'
import { Slice, slicePath, sliceLabel } from './slice'

/** Converts each category's raw value to its proportional angle in the full circle (0–2π). */
function normalize(cats: PieCategory[]): PieCategory[] {
    let total = _(cats).map('value').sum()
    return cats.map((cat) => _.update(cat, 'value', (x) => (Math.PI * 2 * x) / total))
}

/**
 * Pops categories from the end (smallest values first, since the list is sorted descending)
 * until their combined angle meets `collapse.minAngle`, then replaces them with
 * a single collapsed category using the provided label and accumulated value.
 */
function collapseSmallCategories(collapse: PieCollapsedStyle, groups: PieCategory[]): PieCategory[] {
    let groupsClone = _.cloneDeep(groups)
    let { label, minAngle } = collapse
    let value = 0
    while (groupsClone.length > 0 && value < minAngle) {
        value += groupsClone.pop()?.value || 0
    }
    groupsClone.push({ label, value })
    return groupsClone
}

/** Converts an array of angular widths into sequential [startAngle, endAngle] pairs. */
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

/** Pairs each group with its angle range and produces the final Slice objects. */
function createSlices(style: PieStyle, groups: PieCategory[], ranges: [number, number][]): Slice[] {
    console.groupCollapsed('PieChart/createSlices')
    let slices = _.zipWith(groups, ranges, ({ label }, [startAngle, endAngle]) => {
        let labelStyle = sliceLabel(style, startAngle, endAngle)
        let path = slicePath(style, label, startAngle, endAngle)
        return { label, labelStyle, path }
    })
    console.groupEnd()
    return slices
}

/**
 * Main data transformation pipeline.
 *
 * 1. Sort categories by value (descending) and take at most `style.maxCategories`.
 * 2. Normalize values to angular proportions (0–2π).
 * 3. Optionally collapse small trailing slices into a single "other" bucket.
 * 4. Compute sequential angle ranges and generate Slice geometry.
 */
export function toSlices(categories: PieCategory[], style: PieStyle): Slice[] {
    console.group('PieChart/toSlices')
    let maxCategories = style.maxCategories || categories.length
    let sortedAndTruncated = _(categories).sortBy(['value']).reverse().take(maxCategories).value()
    let groups = normalize(sortedAndTruncated)
    if (style.categoryCollapse) {
        groups = collapseSmallCategories(style.categoryCollapse, groups)
    }
    console.log('Groups:', groups)
    let ranges = angleRanges(_.map(groups, 'value'))
    let slices = createSlices(style, groups, ranges)
    console.log('Slices:', slices)
    console.groupEnd()
    return slices
}
