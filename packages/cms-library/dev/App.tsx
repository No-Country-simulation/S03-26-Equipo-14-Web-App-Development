import reactLogo from '../public/assets/react.svg';
import viteLogo from '../public/assets/vite.svg';
import heroImg from '../public/assets/hero.png';
import './App.css';
import TestimonialCarrousel from '../src/components/TestimonialCrousel';

function App() {
  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>CMS Library</h1>
          <h2>Preview Components</h2>
        </div>
      </section>

      <TestimonialCarrousel apiKey="cms-api-key:DRAG954HBGPTuML0KvR0_g:Wt1_pWvPMg22Y0x6r6poJcNygqyVUU9FDTVJ-F60XeqW2o9Nkuux4ND_1XvHah3m8OL93JRPyv1cHO0dreVWYFLPk-QhGQlTlIEQ1PAF8WgwdZnf6Km4vKQu_rcx_CpWqQ2vx4RJT9Rx-VqjNjunIQ" />

      <section id="spacer"></section>
    </>
  );
}

export default App;
