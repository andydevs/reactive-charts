import React from "react"

export interface ButtonProps {
    onClick: () => void
}

export function Button({ onClick }: ButtonProps) {
    return <button onClick={onClick}>Click me Yay!</button>
}
