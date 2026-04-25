import React, { useEffect, useState } from "react"
import { PieChart, PieStencil } from "reactive-charts"

const degrees = Math.PI / 180

const pieStyle = {
    svg: {
        width: 900,
        height: 600,
    },
    data: {
        maxCategories: 10,
        collapse: {
            label: "other",
            color: "#444",
            minAngle: 10 * degrees,
        },
    },
    angleGap: 1 * degrees,
    maxRadius: 210,
    donutThickness: 50,
    cornerRadius: 3,
    labelOffset: 35,
    labelPadding: 4,
    labelHeight: 2,
}

function PieChartExample() {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        setTimeout(() => {
            setCategories([
                { label: "Technology", value: 340, color: "#4e79a7" },
                { label: "Healthcare", value: 280, color: "#f28e2b" },
                { label: "Finance", value: 210, color: "#e15759" },
                { label: "Energy", value: 175, color: "#76b7b2" },
                { label: "Consumer", value: 130, color: "#59a14f" },
                { label: "Industrials", value: 95, color: "#edc948" },
                { label: "Materials", value: 42, color: "#b07aa1" },
                { label: "Utilities", value: 28, color: "#ff9da7" },
                { label: "Real Estate", value: 18, color: "#9c755f" },
                { label: "Telecom", value: 12, color: "#bab0ac" },
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
