"use client";

import {
  Facebook,
  Instagram,
  LinkedInIcon,
  LogoIcon,
  MailIcon,
  PhoneIcon,
  SmallLocationIcon,
  Twitter,
} from "@/components/icons";
import { COMPANY_INFO, SOCIAL_MEDIA_LINKS } from "@/lib/constant";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white sticky top-0 z-1000">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <LogoIcon />
          </div>
          <Link
            href="/auth"
            className="px-6 py-2.5 bg-gradient-to-r from-[#FF8F38] to-[#EA6000] text-white font-semibold rounded-full"
          >
            Start Selling
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-2 gap-4 md:gap-12 items-center">
          <div className="">
            <div className="font-(family-name:--font-baloo) text-black">
              <h2 className="text-xl md:text-5xl font-extrabold leading-tight">
                From home-grown
              </h2>
              <h2 className="text-xl md:text-5xl font-extrabold leading-tight">
                to well-known
              </h2>
              <h2 className="text-xl md:text-5xl font-extrabold leading-tight text-orange-500">
                with Viraaj Heritage Tech
              </h2>
            </div>

            <p className="text-sm md:text-lg text-black py-3 md:py-6">
              Register with a valid GSTIN and an active bank account to become a
              ViRaaJ Heritage Tech seller.
            </p>

            <Link
              href="/auth"
              className="inline-block px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-[#FF8F38] to-[#EA6000] text-white font-semibold rounded-full text-sm md:text-lg"
            >
              Start Selling
            </Link>
          </div>

          <div className="relative">
            <img
              src="/seller_central_banner.webp"
              alt="Seller Central Banner"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      <div className="bg-white py-8 flex items-center justify-center">
        <img
          src="/viraaj-delivery.gif"
          alt="Conveyor Belt Animation"
          className="w-full max-w-7xl h-auto"
        />
      </div>

      {/* Footer */}
      <div className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-white text-center text-lg">
            On an average 71% of the new sellers get their first sales within 4
            weeks of starting their business.<sup>1</sup>
          </p>
        </div>
      </div>

      <footer className="bg-gradient-to-b from-[#0F1F3D] via-[#1A2D4D] to-[#0F1F3D] text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
            <div className="text-center lg:text-left">
              <div className="mb-6 flex justify-center lg:justify-start">
                <LogoIcon />
              </div>
              <p className="text-[#B8C5D6] mb-8 text-base leading-relaxed max-w-sm mx-auto lg:mx-0">
                Connecting exceptional talent with outstanding opportunities
                across industries. Your trusted partner in building world-class
                teams.
              </p>

              <div className="flex justify-center lg:justify-start space-x-4">
                <a
                  href={SOCIAL_MEDIA_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#1A3557] hover:bg-[#244166] rounded-full flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon />
                </a>
                <a
                  href={SOCIAL_MEDIA_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#1A3557] hover:bg-[#244166] rounded-full flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter />
                </a>
                <a
                  href={SOCIAL_MEDIA_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#1A3557] hover:bg-[#244166] rounded-full flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram />
                </a>
                <a
                  href={SOCIAL_MEDIA_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#1A3557] hover:bg-[#244166] rounded-full flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook />
                </a>
              </div>
            </div>

            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold mb-6 text-white relative inline-block">
                Contact Us
                <span className="absolute bottom-0 left-0 top-8 w-12 h-1 bg-gradient-to-b from-[#51A2FF] to-[#8EC5FF]"></span>
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center justify-center lg:justify-start gap-3">
                  <div className="mt-1">
                    <MailIcon color="#B8C5D6" />
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-xs text-[#8B9DB3]">Email</p>
                    <a
                      href={`mailto:${COMPANY_INFO.email}`}
                      className="text-[#B8C5D6] hover:text-white transition-colors text-[15px]"
                    >
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-center justify-center lg:justify-start gap-3">
                  <div className="mt-1">
                    <PhoneIcon color="#B8C5D6" />
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-xs text-[#8B9DB3]">Phone</p>
                    <a
                      href={`tel:${COMPANY_INFO.phone}`}
                      className="text-[#B8C5D6] hover:text-white transition-colors text-[15px]"
                    >
                      {COMPANY_INFO.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-center justify-center lg:justify-start gap-3">
                  <div className="mt-1">
                    <SmallLocationIcon color="#B8C5D6" />
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-xs text-[#8B9DB3]">Location</p>
                    <p className="text-[#B8C5D6] text-[15px]">
                      {COMPANY_INFO.address}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1A3557] pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-[#8B9DB3]">
              <p className="mb-4 md:mb-0">
                © 2026 ViRaaj Services. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <a
                  href="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms-of-service"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
