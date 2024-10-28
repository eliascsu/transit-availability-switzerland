import styled from "@emotion/styled";
import { useState, useEffect, useRef } from "react";

import Typography from "@mui/material/Typography";

// Define the sliding animation styles with styled-components
const SlideInDiv = styled.div`
  position: relative;
  transform: translateY(15vh);
  opacity: 0;
  transition: 1.5s all ease;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 5rem;
  gap: 2rem;

  &.active {
    transform: translateY(0);
    opacity: 1;
  }

  &.inactive {
    transform: translateY(15vh);
    opacity: 0;
  }
`;

const SlideInComponent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const divRef = useRef(null); // Create a ref to target the div

  // Use IntersectionObserver to detect when the element is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Toggle the `active` class based on visibility
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }, // Element must be 10% visible before activating
    );

    if (divRef.current) {
      observer.observe(divRef.current); // Observe the div
    }

    return () => {
      if (divRef.current) {
        observer.unobserve(divRef.current); // Clean up observer when component unmounts
      }
    };
  }, []);

  return (
    <SlideInDiv ref={divRef} className={isVisible ? "active" : ""}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        gap: "2rem",
      }}>
        <Typography variant="h6"><b>Guideline</b></Typography>
        <Typography variant="body1">
          On the following page you can try to improve the transit connectivity of Switzerland.
          To start drawing a new line, press the button on the right and
          click on the map to add as many points(stations) as you'd like. To finish creating a line, you need to select the type of transportation
          and the interval in which the line runs. The number of people, which didn't have access to public transit,
          but you have connected will then be displayed on the right,
          and the public transit availability map will be updated accordingly.

          You can add as many lines as you'd like, and as many stops as you want. Just be aware
          that it might not be feasible to build a train station in the middle of a forest, or create a bus line that is
          hundreds of kilometers long ;).
        </Typography>
      </div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "2rem",
      }}>
        <Typography variant="h6"><b>Unserved population</b></Typography>
        <Typography variant="body1">
          This layer displays the population that isn't served adequately by public transportation
          and should serve as an aid to help you identify areas that are not connected to public transit when creating your custom lines.
          Consider adding lines that connect people from these areas to bigger
          transit hubs to improve the likelihood of people using public transit and make Switzerland a more connected country.
        </Typography>
      </div>
    </SlideInDiv>
  );
};

export default SlideInComponent;
