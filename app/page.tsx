"use client";

import { LogoIcon } from "@/components/icons";
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
            className="px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors duration-200"
          >
            Start Selling
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="">
            <div>
              <h2 className="text-5xl font-extrabold leading-tight">
                From home-grown
              </h2>
              <h2 className="text-5xl font-extrabold leading-tight">
                to well-known
              </h2>
              <h2 className="text-5xl font-extrabold leading-tight text-orange-500">
                with Viraaj Heritage Tech
              </h2>
            </div>

            <p className="text-lg text-black py-6">
              Register with a valid GSTIN and an active bank account to become a
              Viraaj.in seller.
            </p>

            <Link
              href="/auth"
              className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors duration-200 text-lg"
            >
              Start Selling
            </Link>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <img
              src="https://m.media-amazon.com/images/G/31/amazonservices/Banner_image_new_new.webp"
              alt="Seller Central Banner"
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Conveyor Belt Animation */}
      <div className="bg-white py-8 flex items-center justify-center">
        <img
          src="https://m.media-amazon.com/images/G/31/amazonservices/ATF_Conveyor_moving.gif"
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
    </div>
  );
}
