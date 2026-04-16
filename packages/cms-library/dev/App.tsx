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

      <TestimonialCarrousel length={4} apiKey="cms-api-key:eyBOG4wwzP7OLYaUJHTTsw:zrM4bC8qVCR2nTlS9Dptpi6aaGJh_lf4dTLCdyzjsy5iuUhfl8tzoltMjbIp92lvt3-wrfPoLLcPjeMRgb0g993QXYVjzdOz-pse0PJwlIKiaaLtTSm-W2jTWn13yO1qC6PWogERok1na86y4yha5w" />

      <section id="spacer"></section>
    </>
  );
}

export default App;
