import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'

// Import Slick Carousel CSS
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// Import custom CSS
import './assets/css/plugins/animation.css'
import './assets/css/plugins/feature.css'
import './assets/css/plugins/bootstrap-select.min.css'
import './assets/css/plugins/prism.css'
import './assets/css/style.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)