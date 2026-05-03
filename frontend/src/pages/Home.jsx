import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import TrustedBy from '../components/TrustedBy'
import Grauberg from '../components/Grauberg'
import Testimonials from '../components/Testimonials'
import Pricing from '../components/Pricing'
import Features from '../components/Features'
import FAQ from '../components/FAQ'
import ReadyToStart from '../components/ReadyToStart'
import Footer from '../components/Footer'
import Dashboard from '../components/Dashboard'

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Dashboard />
      <TrustedBy />
      <Grauberg />
      <Testimonials />
      <Features />
      <Pricing />
      <FAQ />
      <ReadyToStart />
      <Footer />
    </>
  )
}

export default Home
