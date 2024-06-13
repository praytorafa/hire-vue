import React, { useEffect } from "react";

const KeepWebsiteAlive = () => {
  useEffect(() => {
    // URL of the spun-down website
    const websiteUrl = "https://hire-vue.onrender.com/";

    // Function to make a GET request to the website URL
    const pingWebsite = () => {
      fetch(websiteUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
        })
        .catch((error) => console.error("Error pinging website:", error));
    };

    // Ping the website every 10 minutes (600,000 milliseconds)
    const pingInterval = setInterval(pingWebsite, 600000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(pingInterval);
  }, []);

  return null; // This component doesn't render anything visible
};

export default KeepWebsiteAlive;
