
import React from 'react';
import { Globe, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center">
                <img
                  src="https://i.ibb.co/5g7gFLQz/Logo-PRDX.jpg"
                  alt="PropertyDEX logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-white">
                  PropertyDEX · RE Tokenization Scout
                </p>
                <p className="text-xs text-slate-500">
                  NYC Deal-Flow &amp; MVP Development
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-xs">
              Bridging real-world real estate with digital ownership rails.
              Scouting NYC and global deals, running tokenization simulations,
              and helping you shape investor-ready MVPs inside the PropertyDEX
              ecosystem.
            </p>
          </div>

          {/* Ecosystem links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-3">
              PropertyDEX Ecosystem
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://propertydex.xyz"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:text-blue-400 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>propertydex.xyz</span>
                </a>
              </li>
              <li>
                <a
                  href="https://blockyorkfoodhall.propertydex.xyz"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:text-blue-400 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>blockyorkfoodhall.propertydex.xyz</span>
                </a>
              </li>
              <li>
                <a
                  href="https://dev.propertydex.xyz"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:text-blue-400 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>dev.propertydex.xyz</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-3">
              Connect with the Scout
            </h3>
            <p className="text-sm text-slate-400 mb-3">
              Best channels: LinkedIn and direct email.  
              Use these links as a bridge to talk about deals, simulations, or
              MVP ideas.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center hover:border-blue-500 hover:text-blue-400 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center hover:border-blue-500 hover:text-blue-400 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center hover:border-pink-500 hover:text-pink-400 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Or reach out via email:{" "}
              <a
                href="mailto:scout@propertydex.xyz"
                className="underline hover:text-blue-400"
              >
                scout@propertydex.xyz
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-3">
          <span>
            © {new Date().getFullYear()} PropertyDEX · RE Tokenization Scout
          </span>
          <span>Built from NYC · Real assets, not hype.</span>
        </div>
      </div>
    </footer>
  );
}
