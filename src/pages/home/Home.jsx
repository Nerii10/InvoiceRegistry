//Style + icons
import "../../styles/Home.css";
import {
  Newspaper,
  Network,
  UserCog,
  CalendarClock,
  MousePointer2,
  Sparkles,
} from "lucide-react";

//Lib
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

//My Hooks
import { useUser } from "../../contexts/UserContext.jsx";

//Components
import SlidingText from "../../components/SlidingText.jsx";
import ScrollableContainer from "../../components/ScrollableContainer.jsx";

export default function Home({ isMobile }) {
  const iconSize = 30;
  const containerRef = useRef();
  const navigate = useNavigate();
  const { token } = useUser();
  const [isReady, setIsReady] = useState(false);

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

  const features = [
    {
      icon: <Network size={iconSize} />,
      title: "Company Structure",
      description:
        "Assign users to departments and view structured invoice access.",
    },
    {
      icon: <UserCog size={iconSize} />,
      title: "Client Management",
      description:
        "Easily manage clients and assign them to specific invoices.",
    },
    {
      icon: <CalendarClock size={iconSize} />,
      title: "Smart Calendar",
      description: "Stay on top of deadlines and payment dates.",
    },
    {
      icon: <Newspaper size={iconSize} />,
      title: "Invoice Tracking",
      description: "Track and manage your invoices in real time.",
    },
  ];

  useEffect(() => {
    if (containerRef) {
      setIsReady(true);
    }
  }, [containerRef]);

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

        {/* Scrollable Content */}
        {isReady && (
          <>
            {/* Features Section */}

            <ScrollableContainer
              isMobile={isMobile}
              containerRef={containerRef}
            >
              <motion.section className="features" viewport={{ once: true }}>
                <div className="container">
                  <h2 className="section-title">Key Features</h2>
                  <p className="section-subtitle">
                    Powerful tools to improve your invoicing process
                  </p>
                  <div className="features__grid">
                    {features.map((feature) => (
                      <ScrollableContainer
                        style={{ height: "100%" }}
                        isMobile={isMobile}
                        containerRef={containerRef}
                      >
                        <article className="feature-card">
                          <div className="feature-card__icon">
                            {feature.icon}
                          </div>
                          <h3 className="feature-card__title">
                            {feature.title}
                          </h3>
                          <p className="feature-card__text">
                            {feature.description}
                          </p>
                        </article>
                      </ScrollableContainer>
                    ))}
                  </div>
                </div>
              </motion.section>
            </ScrollableContainer>

            {/* About Section */}

            <ScrollableContainer
              isMobile={isMobile}
              containerRef={containerRef}
            >
              <motion.section className="home-about">
                <div className="container about__content">
                  <div className="about__text">
                    <h2 className="section-title">
                      Built for teams, designed for control.
                    </h2>
                    <p className="about__description">
                      Invoxly gives your team full control over document flow
                      across units and departments. Designed for accountants,
                      loved by managers.
                    </p>
                  </div>
                  <motion.div className="about__image">
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
                      src="/InvoiceRegistry/company.png"
                      alt="Team collaboration illustration"
                    />
                  </motion.div>
                </div>
              </motion.section>
            </ScrollableContainer>

            {/* Document review section */}

            <ScrollableContainer
              isMobile={isMobile}
              containerRef={containerRef}
            >
              <motion.section className="home-about">
                <div className="container about__content">
                  <div className="about__text">
                    <h2 className="section-title">Powerful Document Review</h2>
                    <p className="about__description">
                      Browse and filter invoices in seconds, search by client
                      name, invoice number or date range, and customize exactly
                      which fields you want to see for a streamlined workflow.
                    </p>
                  </div>
                  <motion.div className="about__image">
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
                    ></motion.div>
                    <motion.img
                      src="/InvoiceRegistry/documents.png"
                      alt="Team collaboration illustration"
                    />
                  </motion.div>
                </div>
              </motion.section>
            </ScrollableContainer>

            {/* Document scan section */}

            <ScrollableContainer
              isMobile={isMobile}
              containerRef={containerRef}
            >
              <motion.section className="home-about">
                <div className="container about__content">
                  <div className="about__text">
                    <h2 className="section-title">
                      Effortless Document Scanning
                    </h2>
                    <p className="about__description">
                      Invoxly lets you quickly scan, upload, and organize your
                      documents in just a few clicks, no extra hardware needed.
                    </p>
                  </div>
                  <motion.div className="about__image">
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
                    ></motion.div>
                    <motion.img
                      src="/InvoiceRegistry/document-add.png"
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
            </ScrollableContainer>
          </>
        )}

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
