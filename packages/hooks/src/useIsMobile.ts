import { useState, useEffect } from 'react';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(undefined);

  useEffect(() => {
    const isBrowser = () => typeof window !== "undefined";
    if (isBrowser()) {
      // Handler to call on window resize
      const handleResize = () => {
        // Set state based on viewport width
        setIsMobile(window.innerWidth < 768);
      };

      // Call the handler right away so state gets updated with initial window size
      handleResize();

      // Add event listener
      window.addEventListener("resize", handleResize);

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return isMobile;
};

export default useIsMobile;