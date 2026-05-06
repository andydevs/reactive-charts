import React, { useEffect, useState } from 'react'
import { PieChart, PieStencil } from 'reactive-charts'

const degrees = Math.PI / 180

const pieStyle = {
    svg: {
        width: 900,
        height: 600,
    },
    maxCategories: 10,
    categoryCollapse: {
        label: { text: 'others...', color: '#666', fontStyle: 'italic' },
        minAngle: 10 * degrees,
    },
    sliceAngleGap: 1 * degrees,
    sliceMaxRadius: 210,
    sliceThickness: 90,
    sliceCornerRadius: 3,
    labelOffset: 35,
    labelPadding: 4,
    labelHeight: 2,
}

function PieChartExample() {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        setTimeout(() => {
            setCategories([
                { label: { text: 'Technology', color: '#4e79a7', fontStyle: 'normal' }, value: 340 },
                { label: { text: 'Healthcare', color: '#f28e2b', fontStyle: 'normal' }, value: 280 },
                { label: { text: 'Finance', color: '#e15759', fontStyle: 'normal' }, value: 210 },
                { label: { text: 'Energy', color: '#76b7b2', fontStyle: 'normal' }, value: 175 },
                { label: { text: 'Consumer', color: '#59a14f', fontStyle: 'normal' }, value: 130 },
                { label: { text: 'Industrials', color: '#edc948', fontStyle: 'normal' }, value: 95 },
                { label: { text: 'Materials', color: '#b07aa1', fontStyle: 'normal' }, value: 42 },
                { label: { text: 'Utilities', color: '#ff9da7', fontStyle: 'normal' }, value: 28 },
                { label: { text: 'Real Estate', color: '#9c755f', fontStyle: 'normal' }, value: 18 },
                { label: { text: 'Telecom', color: '#bab0ac', fontStyle: 'normal' }, value: 12 },
            ])
        }, Math.random() * 10000)
    }, [])

    if (categories.length == 0) {
        return <PieStencil style={pieStyle} />
    } else {
        return <PieChart style={pieStyle} categories={categories} />
    }
}

export function App() {
    return (
        <div className="app-container">
            <h1>Reactive Charts Examples!</h1>
            <div className="examples">
                <div className="example">
                    <h2>Pie Chart</h2>
                    <PieChartExample />
                </div>
            </div>
        </div>
    )
}
