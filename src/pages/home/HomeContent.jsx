const iconSize = 30;

export const features = [
  {
    icon: <Network size={iconSize} />,
    title: "Company Structure",
    description:
      "Assign users to departments and view structured invoice access.",
  },
  {
    icon: <UserCog size={iconSize} />,
    title: "Client Management",
    description: "Easily manage clients and assign them to specific invoices.",
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

export const scrollableSections = ({ isMobile, containerRef, navigate }) => [
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
  </motion.section>,

  <motion.section className="home-about">
    <div className="container about__content">
      <div className="about__text">
        <h2 className="section-title">
          Built for teams, designed for control.
        </h2>
        <p className="about__description">
          Invoxly gives your team full control over document flow across units
          and departments. Designed for accountants, loved by managers.
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
  </motion.section>,

  <motion.section className="home-about">
    <div className="container about__content">
      <div className="about__text">
        <h2 className="section-title">Powerful Document Review</h2>
        <p className="about__description">
          Browse and filter invoices in seconds, search by client name, invoice
          number or date range, and customize exactly which fields you want to
          see for a streamlined workflow.
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
  </motion.section>,

  <motion.section className="home-about">
    <div className="container about__content">
      <div className="about__text">
        <h2 className="section-title">Effortless Document Scanning</h2>
        <p className="about__description">
          Invoxly lets you quickly scan, upload, and organize your documents in
          just a few clicks, no extra hardware needed.
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
          <h2 className="section-title">Ready to streamline your invoicing?</h2>
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
  </motion.section>,
];
