# reactive-charts

A React component library for building SVG-based interactive charts. No external charting libraries — all geometry and path generation is pure TypeScript.

## Installation

```bash
yarn add reactive-charts
# or
npm install reactive-charts
```

## Usage

### PieChart

Import the component, define a `PieStyle` config object, provide your data as `PieCategory[]`, and render:

```tsx
import { PieChart, PieCategory, PieStyle } from 'reactive-charts'

const style: PieStyle = {
  svg: { width: 900, height: 600 },
  sliceAngleGap: 0.017,       // gap between slices, in radians (~1°)
  sliceMaxRadius: 210,         // outer radius of the donut ring
  sliceThickness: 50,          // radial thickness of the ring
  sliceCornerRadius: 3,        // rounded corners on each slice edge
  labelOffset: 35,             // horizontal distance from ring to label line endpoint
  labelPadding: 4,             // gap between label line endpoint and label text
  labelHeight: 2,              // vertical offset for label text above the line
  maxCategories: 10,           // show at most 10 slices
  categoryCollapse: {
    label: { text: 'Other', color: '#444', fontStyle: 'normal' },
    minAngle: 0.175,           // collapse slices smaller than ~10° into "Other"
  },
}

const categories: PieCategory[] = [
  { label: { text: 'Technology', color: '#4e79a7', fontStyle: 'normal' }, value: 340 },
  { label: { text: 'Healthcare',  color: '#f28e2b', fontStyle: 'normal' }, value: 280 },
  { label: { text: 'Finance',     color: '#e15759', fontStyle: 'normal' }, value: 210 },
]

function MyChart() {
  return <PieChart style={style} categories={categories} />
}
```

### Loading state with PieStencil

`PieStencil` renders an animated rotating gradient ring that matches the chart dimensions. Render it while data is loading, then swap in `PieChart`:

```tsx
import { PieChart, PieStencil, PieStyle } from 'reactive-charts'

function MyChart({ isLoading, categories }) {
  if (isLoading) {
    return <PieStencil style={style} />
  }
  return <PieChart style={style} categories={categories} />
}
```

Both components accept the same `PieStyle` object, so the layout stays consistent during the transition.
