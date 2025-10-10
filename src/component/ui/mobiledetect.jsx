import React, { useEffect, useState } from "react";
import Colors from "../../core/constant";

const MobileDetect = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [deviceModel, setDeviceModel] = useState("Unknown Device");

  const getDeviceModel = () => {
    const userAgent = navigator.userAgent;
    let model = "Unknown Device";

    if (/Android/i.test(userAgent)) {
      const androidMatch = userAgent.match(/Android.*; ([^\)]+)/);
      if (androidMatch) {
        model = androidMatch[1].trim().replace(/Build\/.*$/, "");
      } else {
        model = "Android Device";
      }
    } else if (/iPhone/i.test(userAgent)) {
      const iPhoneMatch = userAgent.match(/iPhone.*OS ([\d_]+)/);
      model = iPhoneMatch
        ? `iPhone ${iPhoneMatch[1].replace(/_/g, ".")}`
        : "iPhone";
    } else if (/iPad/i.test(userAgent)) {
      model = "iPad";
    } else if (/Windows NT/i.test(userAgent)) {
      model = "Windows PC";
    } else if (/Macintosh/i.test(userAgent)) {
      model = "Mac";
    } else if (/Linux/i.test(userAgent)) {
      model = "Linux Device";
    }

    return model;
  };

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 640);
    };
    setDeviceModel(getDeviceModel());
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const sharedStyles = {
    container: "w-full flex items-center justify-center py-8",
    card: "bg-orange-50 shadow-lg rounded-xl border border-gray-200 flex flex-col items-center text-center p-6 max-w-sm w-full",
    title: `font-bold text-xl mb-3 text-${Colors.primaryMain}`,
    model: "font-semibold text-lg text-gray-800 mb-2",
    subtitle: "text-sm text-gray-500",
  };

  const mobile = () => {
    return (
      <div className={sharedStyles.container}>
        <div className={sharedStyles.card}>
          <div className={sharedStyles.title}>Your Device</div>
          <div className={sharedStyles.model}>{deviceModel}</div>
          <div className={sharedStyles.subtitle}>Detected on mobile</div>
        </div>
      </div>
    );
  };

  const desktop = () => {
    return (
      <div className={sharedStyles.container}>
        <div className={`${sharedStyles.card} p-10 gap-4`}>
          <div className={sharedStyles.title}>📱Your Device Model</div>
          <div className={sharedStyles.model}>{deviceModel}</div>
          <div className={sharedStyles.subtitle}>Running on desktop view</div>
        </div>
      </div>
    );
  };

  return isMobile ? mobile() : desktop();
};

export default MobileDetect;
