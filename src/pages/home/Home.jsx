//Style + icons
import "../../styles/Home.css";

import { useEffect, useRef, useState } from "react";

//My Hooks
import { useUser } from "../../contexts/UserContext.jsx";

//Components
import { HomeSections } from "./HomeSections.jsx";

export default function Home({ isMobile }) {
  const { token } = useUser();
  const containerRef = useRef();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      setIsReady(true);
    }
  }, []);

  return (
    <main className="home-page-wrapper" ref={containerRef}>
      <div className="home-page">
        {/* Content */}
        {isReady && (
          <>
            {/* Sections */}
            <HomeSections
              isMobile={isMobile}
              containerRef={containerRef}
              token={token}
            />
          </>
        )}
      </div>
    </main>
  );
}
