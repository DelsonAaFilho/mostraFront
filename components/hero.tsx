import {
  ArrowRight,
  Sparkles,
  Code2,
  Lightbulb,
  Orbit,
  Asterisk,
} from "lucide-react";
import { PersonAvatar } from "@/components/person-avatar";

function OrbitalArtwork() {
  return (
    <div className="orbital-art" aria-hidden="true">
      <div className="orbital-grid" />
      <div className="orb-glow" />
      <svg className="orbital-svg" viewBox="0 0 600 450" fill="none">
        <defs>
          <radialGradient id="sphere-fill" cx="35%" cy="25%" r="80%">
            <stop stopColor="#8c6ee5" stopOpacity=".32" />
            <stop offset=".6" stopColor="#41256f" stopOpacity=".13" />
            <stop offset="1" stopColor="#16101f" stopOpacity=".4" />
          </radialGradient>
          <linearGradient
            id="orbit-stroke"
            x1="70"
            y1="390"
            x2="500"
            y2="50"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#b09ce5" stopOpacity=".05" />
            <stop offset=".45" stopColor="#ad8bff" stopOpacity=".9" />
            <stop offset=".75" stopColor="#c5b2f8" stopOpacity=".6" />
            <stop offset="1" stopColor="#9d73ed" stopOpacity=".05" />
          </linearGradient>
          <clipPath id="sphere-clip">
            <circle cx="307" cy="220" r="137" />
          </clipPath>
          <radialGradient id="orb-dot">
            <stop stopColor="#fff" />
            <stop offset=".35" stopColor="#dfcfff" />
            <stop offset="1" stopColor="#9671ed" />
          </radialGradient>
        </defs>
        <ellipse
          cx="307"
          cy="220"
          rx="247"
          ry="76"
          transform="rotate(-32 307 220)"
          stroke="#695287"
          strokeOpacity=".35"
        />
        <ellipse
          cx="307"
          cy="220"
          rx="228"
          ry="94"
          transform="rotate(30 307 220)"
          stroke="#695287"
          strokeOpacity=".25"
        />
        <circle
          cx="307"
          cy="220"
          r="137"
          fill="url(#sphere-fill)"
          stroke="#a888e5"
          strokeOpacity=".55"
        />
        <g
          clipPath="url(#sphere-clip)"
          transform="rotate(-24 307 220)"
          stroke="#aa8be1"
          strokeOpacity=".38"
          strokeWidth=".65"
        >
          {Array.from({ length: 15 }, (_, i) => (
            <ellipse
              key={`v${i}`}
              cx="307"
              cy="220"
              rx={8 + i * 9.2}
              ry="137"
            />
          ))}
          {Array.from({ length: 17 }, (_, i) => {
            const y = 94 + i * 15.75;
            const r = Math.sqrt(Math.max(0, 137 ** 2 - (y - 220) ** 2));
            return (
              <ellipse
                key={`h${i}`}
                cx="307"
                cy={y}
                rx={r}
                ry={9 + 18 * Math.sin((i / 16) * Math.PI)}
              />
            );
          })}
        </g>
        <ellipse
          cx="307"
          cy="220"
          rx="248"
          ry="76"
          transform="rotate(-32 307 220)"
          stroke="url(#orbit-stroke)"
          strokeWidth="1.5"
          strokeDasharray="470 900"
          strokeDashoffset="-110"
        />
        <circle cx="112" cy="306" r="6" fill="url(#orb-dot)" />
        <circle cx="477" cy="106" r="4.5" fill="url(#orb-dot)" />
        <circle cx="445" cy="300" r="3" fill="#b39adf" />
        <circle cx="210" cy="80" r="2.5" fill="#b39adf" />
        <path
          d="M510 204v10m-5-5h10M139 148v8m-4-4h8M373 383v8m-4-4h8"
          stroke="#bca2e8"
          strokeOpacity=".6"
        />
        <circle
          cx="307"
          cy="220"
          r="169"
          stroke="#9b7bc4"
          strokeOpacity=".1"
          strokeDasharray="2 7"
        />
      </svg>
      <div className="orbit-label orbit-label-top">
        <span className="floating-icon">
          <Code2 size={18} />
        </span>
        <div>
          <span>Built by curious minds</span>
          <small>Powered by possibility.</small>
        </div>
      </div>
      <div className="orbit-label orbit-label-bottom">
        <span className="floating-icon">
          <Lightbulb size={18} />
        </span>
        <div>
          <span>Ideas into impact</span>
          <small>From campus to the world.</small>
        </div>
        <ArrowRight size={15} />
      </div>
      <span className="art-caption">
        <Orbit size={13} /> A little curiosity changes everything.
      </span>
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero page-container" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="status-dot" /> WHERE CURIOSITY BECOMES POSSIBILITY
        </div>
        <h1 id="hero-title">
          Projects that
          <br />
          <span>inspire.</span>
          <Sparkles className="heading-spark" strokeWidth={1.2} />
        </h1>
        <p className="hero-description">
          Big ideas start here. Discover academic projects that bring students,
          professors, and the wider community together to make a difference.
        </p>
        <a href="#projects" className="primary-link">
          Explore projects <ArrowRight size={17} />
        </a>
        <div className="hero-community">
          <div className="community-avatars">
            {["47", "12", "44", "53"].map((image, i) => (
              <PersonAvatar
                key={image}
                name={
                  [
                    "Ana Silva",
                    "Lucas Almeida",
                    "Julia Costa",
                    "Gabriel Pereira",
                  ][i]
                }
                image={`/images/avatar-${image}.jpg`}
              />
            ))}
          </div>
          <div>
            <strong>A community of possibility.</strong>
            <span>Students. Mentors. Tomorrow’s changemakers.</span>
          </div>
        </div>
      </div>
      <OrbitalArtwork />
      <div className="hero-bottom">
        <p>
          <Asterisk size={18} /> A little research. A lot of potential.
        </p>
        <div>
          <span>Student-led.</span>
          <span>Professor-guided.</span>
          <span>Open to everyone.</span>
        </div>
      </div>
    </section>
  );
}
