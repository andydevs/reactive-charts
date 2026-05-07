const React = require("react")
const ReactDOM = require("react-dom/client")
import { App } from "./app/index.jsx"
import "./styles.css"

const element = document.getElementById("app")
const root = ReactDOM.createRoot(element)
root.render(<App />)
