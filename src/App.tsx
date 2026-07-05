import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import { LandingPage } from './pages/LandingPage'
import { Prototype } from './pages/Prototype'
import { KomIGang } from './pages/KomIGang'
import { Eksempelsaker } from './pages/Eksempelsaker'
import { EksempelsakDetalj } from './pages/EksempelsakDetalj'
import { Vilkarsleser } from './pages/Vilkarsleser'
import { MineSaker } from './pages/MineSaker'
import { Finansklagenemnda } from './pages/Finansklagenemnda'
import { Personvern } from './pages/Personvern'
import { Admin } from './pages/Admin'

/** Scroll to top on navigation, or to the #hash target when present. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sak" element={<Prototype />} />
        <Route path="/kom-i-gang" element={<KomIGang />} />
        <Route path="/eksempelsaker" element={<Eksempelsaker />} />
        <Route path="/eksempelsak" element={<EksempelsakDetalj />} />
        <Route path="/vilkar" element={<Vilkarsleser />} />
        <Route path="/mine-saker" element={<MineSaker />} />
        <Route path="/finansklagenemnda" element={<Finansklagenemnda />} />
        <Route path="/personvern" element={<Personvern />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </>
  )
}
