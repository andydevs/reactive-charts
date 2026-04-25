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
  angleGap: 0.017,        // gap between slices, in radians (~1°)
  maxRadius: 210,         // outer radius of the donut ring
  donutThickness: 50,     // radial thickness of the ring
  cornerRadius: 3,        // rounded corners on each slice edge
  labelOffset: 35,        // horizontal distance from ring to label line endpoint
  labelPadding: 4,        // gap between label line endpoint and label text
  labelHeight: 2,         // vertical offset for label text above the line
  data: {
    maxCategories: 10,    // show at most 10 slices
    collapse: {
      label: 'Other',
      color: '#444',
      minAngle: 0.175,    // collapse slices smaller than ~10° into "Other"
    },
  },
}

const categories: PieCategory[] = [
  { label: 'Technology', value: 340, color: '#4e79a7' },
  { label: 'Healthcare',  value: 280, color: '#f28e2b' },
  { label: 'Finance',     value: 210, color: '#e15759' },
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
