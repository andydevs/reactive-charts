const React = require("react")
const ReactDOM = require("react-dom/client")
import { App } from "./app/index.jsx"

const element = document.getElementById("app")
const root = ReactDOM.createRoot(element)
root.render(<App />)
