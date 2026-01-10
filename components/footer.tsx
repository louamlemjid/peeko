export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white">
              Peeko 🤖
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Peeko is a smart companion designed to interact, notify,
              and assist using embedded intelligence and connected systems.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
              Contact
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>📍 Kelibia, Tunisia</li>
              <li>
                📧{" "}
                <a
                  href="mailto:contact@peeko.ai"
                  className="hover:text-white transition"
                >
                  contact@peeko.ai
                </a>
              </li>
              <li>📞 +216 XX XXX XXX</li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
              Resources
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Peeko. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
