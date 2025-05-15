import "../../styles/Home.css";
import {
  Newspaper,
  Network,
  UserCog,
  CalendarClock,
  MousePointer2,
  Sparkles,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useUser } from "../../contexts/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import SlidingText from "../../components/SlidingText.jsx";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const iconSize = 30;
  const imageRef = useRef();
  const containerRef = useRef();
  const navigate = useNavigate();
  const { token } = useUser();

  function useIsMobile(breakpoint = 700) {
    const [isMobile, setIsMobile] = useState(
      () => window.innerWidth <= breakpoint
    );

    useEffect(() => {
      const onResize = () => {
        setIsMobile(window.innerWidth <= breakpoint);
        console.log("window.innerWidth", window.innerWidth);
      };

      window.addEventListener("resize", onResize);
      // od razu wywołaj, żeby złapać wartość przy mount
      onResize();

      return () => {
        window.removeEventListener("resize", onResize);
      };
    }, [breakpoint]);

    return isMobile;
  }
  const isMobile = useIsMobile(700);
  const { scrollYProgress } = useScroll({
    ...(isMobile ? { container: containerRef } : {}),
    target: imageRef,
    offset: ["start end", "start center"],
  });

  const blur = useTransform(scrollYProgress, [0, 1], [-0.5, 1]);
  const perspective = useTransform(scrollYProgress, [0, 1], ["250px", "300px"]);
  const rotateX = useTransform(scrollYProgress, [0, 1], ["20deg", "0deg"]);

  const animationVariant = {
    hidden: {
      opacity: 0,
      y: 50,
      skewY: "3deg",
      filter: "blur(5px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      skewY: "0deg",
      filter: "blur(0px)",
    },
  };

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      console.log(v);
    });
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <main className="home-page-wrapper" ref={containerRef}>
      <main className="home-page">
        {/* Navbar */}
        <header className="home-page-navbar">
          <div className="container navbar__content">
            <a className="navbar__logo">
              <Newspaper size={iconSize} />
              Invoxly
            </a>
            <nav className="navbar__nav">
              {token ? (
                <a
                  onClick={() => {
                    navigate("/dashboard/documents");
                  }}
                  className="navbar__link"
                >
                  Dashboard
                </a>
              ) : (
                <>
                  <a
                    onClick={() => {
                      navigate("/auth");
                    }}
                    className="navbar__link"
                  >
                    Login
                  </a>
                </>
              )}
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <motion.section
          className="hero"
          variants={animationVariant}
          initial="hidden"
          animate="visible"
          transition={{ type: "spring", damping: 23, delay: 0 }}
          viewport={{ once: true }}
        >
          <div className="container hero__content">
            <div className="hero__text">
              <motion.h1 className="hero__title">
                Manage invoices{" "}
                <SlidingText inputs={["faster", "better", "easier"]} /> than
                ever.
              </motion.h1>
              <p className="hero__subtitle">
                A simple and secure application to register and keep track of
                invoices and structure of your company.
              </p>
              <div className="hero__actions">
                <motion.div
                  style={{
                    position: "absolute",
                    right: "-10px",
                    top: "-10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    filter: "drop-shadow(0px 0px 5px gold)",
                  }}
                  animate={{ rotate: ["0deg", "360deg"] }}
                  transition={{
                    type: "tween",
                    ease: "linear",
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles stroke="gold" />
                </motion.div>
                <button
                  onClick={() => {
                    token ? navigate("/dashboard/user") : navigate("/auth");
                  }}
                  className="hero__btn--primary"
                >
                  {token ? "Open Dashboard" : "Get Started"}
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className="features"
          variants={animationVariant}
          initial="hidden"
          animate="visible"
          transition={{ type: "spring", damping: 23, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="container">
            <h2 className="section-title">Key Features</h2>
            <p className="section-subtitle">
              Powerful tools to improve your invoicing process
            </p>
            <div className="features__grid">
              <article className="feature-card">
                <div className="feature-card__icon">
                  <Newspaper size={iconSize} />
                </div>
                <h3 className="feature-card__title">Invoice Tracking</h3>
                <p className="feature-card__text">
                  Track and manage your invoices in real time.
                </p>
              </article>
              <article className="feature-card">
                <div className="feature-card__icon">
                  <Network size={iconSize} />
                </div>
                <h3 className="feature-card__title">Company Structure</h3>
                <p className="feature-card__text">
                  Assign users to departments and view structured invoice
                  access.
                </p>
              </article>
              <article className="feature-card">
                <div className="feature-card__icon">
                  <UserCog size={iconSize} />
                </div>
                <h3 className="feature-card__title">Client Management</h3>
                <p className="feature-card__text">
                  Easily manage clients and assign them to specific invoices.
                </p>
              </article>
              <article className="feature-card">
                <div className="feature-card__icon">
                  <CalendarClock size={iconSize} />
                </div>
                <h3 className="feature-card__title">Smart Calendar</h3>
                <p className="feature-card__text">
                  Stay on top of deadlines and payment dates.
                </p>
              </article>
            </div>
          </div>
        </motion.section>

        {/* About Section */}
        <motion.section
          className="home-about"
          variants={animationVariant}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 23, delay: 0.8 }}
        >
          <div className="container about__content">
            <div className="about__text">
              <h2 className="section-title">
                Built for teams, designed for control.
              </h2>
              <p className="about__description">
                Invoxly gives your team full control over document flow across
                units and departments. Designed for accountants, loved by
                managers.
              </p>
            </div>
            <motion.div
              className="about__image"
              style={{ perspective: perspective }}
            >
              {/* Illustration placeholder */}
              <motion.div
                style={{ position: "absolute", width: "fit-content" }}
                animate={{ x: ["-20vw", "-18vw"], y: ["10vh", "11vh"] }}
                transition={{
                  type: "spring",
                  damping: 50,
                  repeat: Infinity,
                  repeatType: "mirror",
                }}
              >
                <MousePointer2 />
              </motion.div>
              <motion.img
                ref={imageRef}
                style={{ opacity: blur, rotateX }}
                src="/InvoiceRegistry/placeholder.png"
                alt="Team collaboration illustration"
              />
            </motion.div>

            <section className="cta">
              <div className="container cta__content">
                <h2 className="section-title">
                  Ready to streamline your invoicing?
                </h2>
                <button
                  onClick={() => {
                    navigate("/auth");
                  }}
                  className="hero__btn--primary"
                >
                  Create your free account
                </button>
              </div>
            </section>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="home-footer">
          <div className="home-footer__content">
            <p className="footer__description">
              Simplify your invoicing process with Invoxly.
            </p>
            <p style={{ textAlign: "end" }} className="footer__description">
              made by nerii
            </p>
          </div>
        </footer>
      </main>
    </main>
  );
}
