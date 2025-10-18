import React from "react"
import { Button } from "reactive-charts"

export function App() {
    return (
        <>
            <h1>Reactive Charts Examples!</h1>
            <div className="example">
                <Button onClick={() => console.log("Clicked!")} />
            </div>
        </>
    )
}
