import React, { useMemo } from "react";

import WhiteLogo from "../assets/images/header-logo-white.svg";
import LumanagiCoin from "../assets/images/lumanagi-coin 1.png";

import Twitter from "../assets/images/social-media/twitter.svg";
import Fb from "../assets/images/social-media/fb.svg";
import Linkedin from "../assets/images/social-media/linkedin.svg";
import Insta from "../assets/images/social-media/instagram.svg";
import Discord from "../assets/images/social-media/discord.svg";
import Telegram from "../assets/images/social-media/telegram.svg";
import Button from "../UI/Button";

const SocialMedia = () => {
  const handleClick = (type: string) => {
    console.log("social media icon clicked: ", type);
  };

  const socialMediaIcons = useMemo(() => {
    return [
      {
        icon: Twitter,
        type: "twitter",
      },
      {
        icon: Fb,
        type: "facebook",
      },
      {
        icon: Linkedin,
        type: "linkedin",
      },
      {
        icon: Insta,
        type: "instagram",
      },
      {
        icon: Discord,
        type: "discord",
      },
      {
        icon: Telegram,
        type: "telegram",
      },
    ];
  }, []);

  return (
    <>
      <div className="flex my-8 space-x-8">
        {socialMediaIcons.map((data, index) => (
          <React.Fragment key={`social-media-icon-item-${index}`}>
            <img
              src={data.icon}
              alt={data.type}
              onClick={() => handleClick(data.type)}
            />
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

const Company = () => {
  const pages = useMemo(() => {
    return [
      {
        label: "About us",
        path: "/about-us",
      },
      {
        label: "Blog",
        path: "/blog",
      },
      {
        label: "Press",
        path: "/press",
      },
      {
        label: "Careers",
        path: "/careers",
      },
    ];
  }, []);

  const handleRoute = (path: string) => {
    console.log("Routing to : ", path);
  };

  return (
    <>
      <div className="flex flex-col space-y-2 text-xl font-medium">
        <p className="mb-2 text-gray-600">Company</p>
        {pages.map((page, index) => (
          <React.Fragment key={`company-item-${index}`}>
            <p className="text-white" onClick={() => handleRoute(page.path)}>
              {page.label}
            </p>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

const Legal = () => {
  const pages = useMemo(() => {
    return [
      {
        label: "Privacy Policy",
        path: "/privacy-policy",
      },
      {
        label: "Terms & Conditions",
        path: "/terms-conditions",
      },
      {
        label: "Cookies",
        path: "/cookies",
      },
    ];
  }, []);

  const handleRoute = (path: string) => {
    console.log("Routing to : ", path);
  };

  return (
    <>
      <div className="flex flex-col space-y-2 text-xl font-medium">
        <p className="mb-2 text-gray-600">Legal</p>
        {pages.map((page, index) => (
          <React.Fragment key={`company-item-${index}`}>
            <p className="text-white" onClick={() => handleRoute(page.path)}>
              {page.label}
            </p>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export function Footer() {
  return (
    <div className="relative bottom-0 w-full">
      <div className="flex justify-between mx-20 mt-40">
        <div className="flex flex-col justify-center">
          <img src={WhiteLogo} alt="logo" className="max-w-full w-72" />
          <SocialMedia />
        </div>
        <div className="flex space-x-20">
          <Company />
          <Legal />
        </div>
      </div>
      <hr className="mx-20 mt-8 mb-4 text-white"></hr>
      <div className="flex justify-between mx-20 mb-10">
        <div className="text-lg text-white">
          <p className="opacity-50">© Lumanagi</p>
          <p className="mt-2">
            <span className="opacity-50">HU</span> EN
          </p>
        </div>
        <div className="flex items-center space-x-2 text-lg">
          <img src={LumanagiCoin} alt="lumanagi coin" />
          <p className="text-sm text-white">0.002 ETH</p>
          <Button
            customStyle="rounded-xl"
            label={
              <div className="flex items-center justify-between gap-2">
                <div>BUY LMNG</div>
                <svg
                  width="25"
                  height="15"
                  viewBox="0 0 25 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.9287 8.33308C24.3192 7.94256 24.3192 7.30939 23.9287 6.91887L17.5647 0.554909C17.1742 0.164384 16.541 0.164384 16.1505 0.554909C15.76 0.945433 15.76 1.5786 16.1505 1.96912L21.8073 7.62598L16.1505 13.2828C15.76 13.6734 15.76 14.3065 16.1505 14.697C16.541 15.0876 17.1742 15.0876 17.5647 14.697L23.9287 8.33308ZM0.134766 8.62598H23.2216V6.62598H0.134766V8.62598Z"
                    fill="white"
                  />
                </svg>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Footer;
