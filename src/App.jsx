import AppRoutes from './routes/AppRoutes'
import TrafficTracker from './components/common/TrafficTracker'
import LoadingScreen from './components/common/LoadingScreen'
import ScrollToTop from './components/common/ScrollToTop'
import { useCatalog } from './contexts/CatalogContext'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <TrafficTracker />
      <AppRoutes />
    </>
  )
}

