import { NavLink } from "react-router";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-8 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><NavLink to="#" className="hover:underline">About Us</NavLink></li>
              <li><NavLink to="#" className="hover:underline">Contact</NavLink></li>
              <li><NavLink to="#" className="hover:underline">Careers</NavLink></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Explore</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><NavLink to="/search" className="hover:underline">Broker Reviews</NavLink></li>
              <li><NavLink to="/rankings" className="hover:underline">Rankings</NavLink></li>
              <li><NavLink to="/compare" className="hover:underline">Compare Brokers</NavLink></li>
              <li><NavLink to="/search" className="hover:underline">Regulators</NavLink></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><NavLink to="/news" className="hover:underline">Market News</NavLink></li>
              <li><NavLink to="/news" className="hover:underline">Regulatory Alerts</NavLink></li>
              <li><NavLink to="/news" className="hover:underline">Trading Insights</NavLink></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><NavLink to="#" className="hover:underline">Privacy Policy</NavLink></li>
              <li><NavLink to="#" className="hover:underline">Terms & Conditions</NavLink></li>
              <li><NavLink to="#" className="hover:underline">Disclaimer</NavLink></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} VTINDEX. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
