import {
  Newspaper,
  Network,
  UserCog,
  CalendarClock,
  MousePointer2,
  Sparkles,
} from "lucide-react";

//Components
import SlidingText from "../../components/SlidingText";
import ScrollableContainer from "../../components/ScrollableContainer";

//Motion,React
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const HomeSections = ({ isMobile, containerRef, token }) => {
  const iconSize = 30;
  const navigate = useNavigate();
  const randomInRange = (min, max) => Math.random() * (max - min) + min;

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

  const aboutSections = [
    {
      id: "teams",
      img: "/InvoiceRegistry/company.png",
      title: "Built for teams, designed for control.",
      description: `Invoxly gives your team full control…`,
    },
    {
      id: "review",
      img: "/InvoiceRegistry/documents.png",
      title: "Powerful Document Review",
      description: `Browse and filter invoices…`,
    },
    {
      id: "scanning",
      img: "/InvoiceRegistry/document-add.png",
      title: "Effortless Document Scanning",
      description: `Invoxly lets you quickly scan…`,
    },
  ].map((section) => {
    // dla każdej sekcji dorzuć losowe przesunięcia
    const x1 = randomInRange(-40, 0); // od lewej poza ekran aż do środka
    const x2 = randomInRange(0, 40); // aż po prawo poza ekran
    const y1 = randomInRange(-20, 20); // góra/dół ±20vh
    const y2 = randomInRange(-20, 20);
    const damping = randomInRange(50, 200);
    const factor = 5;
    return {
      ...section,
      motionOffsets: {
        x: [`${x1 * factor}%`, `${x2 * factor}%`],
        y: [`${y1 * factor}%`, `${y2 * factor}%`],
      },
      damping,
    };
  });

  const sections = [
    //Navbar
    {
      section: (
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
      ),
      scrollable: false,
    },
    //Hero title
    {
      section: (
        <motion.section
          className="hero"
          initial={{
            opacity: 0,
            y: 50,
            skewY: "3deg",
            filter: "blur(5px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            skewY: "0deg",
            filter: "blur(0px)",
          }}
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
      ),
      scrollable: false,
    },
    //Features
    {
      section: (
        <motion.section className="features" viewport={{ once: true }}>
          <div className="container">
            <h2 className="section-title">Key Features</h2>
            <p className="section-subtitle">
              Powerful tools to improve your invoicing process
            </p>
            <div className="features__grid">
              {features.map((feature, index) => (
                <ScrollableContainer
                  key={index}
                  style={{ height: "100%" }}
                  isMobile={isMobile}
                  containerRef={containerRef}
                >
                  <article className="feature-card">
                    <div className="feature-card__icon">{feature.icon}</div>
                    <h3 className="feature-card__title">{feature.title}</h3>
                    <p className="feature-card__text">{feature.description}</p>
                  </article>
                </ScrollableContainer>
              ))}
            </div>
          </div>
        </motion.section>
      ),
      scrollable: true,
    },
    //About
    {
      section: aboutSections.map((section, index) => {
        return (
          <ScrollableContainer
            isMobile={isMobile}
            key={index}
            containerRef={containerRef}
            initialscale={isMobile ? 0.5 : 0.7}
            initialRotateX={isMobile ? "60deg" : "20deg"}
          >
            <motion.section className="home-about" key={section.id}>
              <div className="container about__content">
                <div className="about__text">
                  <h2 className="section-title">{section.title}</h2>
                  <p className="about__description">{section.description}</p>
                </div>
                <motion.div className="about__image">
                  <motion.div
                    style={{ position: "absolute", width: "fit-content" }}
                    animate={{
                      x: section.motionOffsets.x,
                      y: section.motionOffsets.y,
                    }}
                    transition={{
                      type: "spring",
                      damping: section.damping,
                      repeat: Infinity,
                      repeatType: "mirror",
                    }}
                  >
                    <MousePointer2 stroke="gray" />
                  </motion.div>
                  <motion.img src={section.img} alt={section.title} />
                </motion.div>
              </div>
            </motion.section>
          </ScrollableContainer>
        );
      }),
      scrollable: false,
    },
    //Footer
    {
      section: (
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
      ),
      scrollable: false,
    },
  ];

  return (
    <>
      {sections.map((section, index) => {
        return section.scrollable == true ? (
          <ScrollableContainer
            style={{width:"100%"}}
            isMobile={isMobile}
            key={index}
            containerRef={containerRef}
          >
            {section.section}
          </ScrollableContainer>
        ) : (
          section.section
        );
      })}
    </>
  );
};
