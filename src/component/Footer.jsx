import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import logo from "../assets/hukmee.png";
import { useEffect, useState } from "react";
import GetInTouch from "../backend/footer/getintouch";
import { Link } from "react-router-dom";

const Footer = () => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await GetInTouch();
        console.log("Footer info fetched:", data);

        // Pick first item if array has data
        if (Array.isArray(data) && data.length > 0) {
          setInfo(data[0]);
        }
      } catch (error) {
        console.log("Fetching footer info error", error);
      }
    };
    fetchInfo();
  }, []);

  const formatLink = (url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `https://${url}`;
  };

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-100 text-gray-700 py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Social */}
          <div className="flex flex-col space-y-5">
            <div
              onClick={() => (window.location.href = "/")}
              className="flex items-center cursor-pointer group space-x-3"
            >
              <img
                src={logo}
                alt="WePrettify Logo"
                className="w-45 h-30 rounded-[3px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-4">
              {info?.Link1 && (
                <a
                  href={formatLink(info.Link1)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-orange-50 text-[#FA7D09] hover:bg-[#FA7D09] hover:text-white transition-colors duration-300"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {info?.Link2 && (
                <a
                  href={formatLink(info.Link2)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-orange-50 text-[#FA7D09] hover:bg-[#FA7D09] hover:text-white transition-colors duration-300"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {info?.Link3 && (
                <a
                  href={formatLink(info.Link3)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-orange-50 text-[#FA7D09] hover:bg-[#FA7D09] hover:text-white transition-colors duration-300"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Services (static) */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-5">
              Our Services
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "Screen Replacement",
                "Battery Replacement",
                "Charging Port Repair",
                "Camera Repair",
                "Water Damage Repair",
                "Software Troubleshooting",
                "Unlocking & Reset Services",
              ].map((service, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-[#FA7D09] transition-colors duration-300 hover:underline"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products (static) */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-5">
              Products
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "Replacement Screens",
                "Batteries",
                "Chargers & Cables",
                "Camera Modules",
                "Phone Cases & Covers",
                "Tempered Glass",
                "Mobile Accessories",
              ].map((product, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-[#FA7D09] transition-colors duration-300 hover:underline"
                  >
                    {product}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-5">
              Get In Touch
            </h4>
            <ul className="space-y-5 text-sm text-gray-600">
              {info?.Address && (
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#FA7D09] flex-shrink-0 mt-0.5" />
                  <span>{info.Address}</span>
                </li>
              )}
              {info?.Phone && (
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#FA7D09] flex-shrink-0" />
                  <span>{info.Phone}</span>
                </li>
              )}
              {info?.Email && (
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#FA7D09] flex-shrink-0" />
                  <span>{info.Email}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t pt-8 border-gray-200 text-sm flex flex-col lg:flex-row justify-between items-center gap-4 text-gray-600">
          <span>© 2025 Hukmee. All rights reserved.</span>
          <div className="flex gap-6 flex-wrap justify-center">
            <Link
              to="/privacy"
              className="text-gray-600 hover:text-[#FA7D09] transition-colors duration-300 hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-600 hover:text-[#FA7D09] transition-colors duration-300 hover:underline"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
