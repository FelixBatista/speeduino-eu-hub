import { Link } from "react-router-dom";
import { vehicles } from "@/data/vehicles";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { useState } from "react";

export default function Vehicles() {
  const [search, setSearch] = useState("");

  const filtered = vehicles.filter((v) =>
    `${v.name} ${v.engine} ${v.platform}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="pt-24 pb-20">
      <div className="container">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Vehicles</span>
        </nav>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Supported Vehicles</h1>
        <p className="text-muted-foreground max-w-2xl mb-10">
          Browse vehicle-specific guides, wiring notes, and recommended kits. Can't find your vehicle? Speeduino supports most engines — <Link to="/find-my-kit" className="text-primary hover:underline">check compatibility</Link>.
        </p>

        {/* Search */}
        <div className="relative max-w-md mb-10">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by vehicle, engine, or platform..."
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((vehicle, i) => (
            <motion.div
              key={vehicle.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link to={`/vehicles/${vehicle.slug}`} className="card-motorsport p-6 flex flex-col h-full group block">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{vehicle.engine}</span>
                  <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">{vehicle.years}</span>
                </div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {vehicle.name}
                </h2>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{vehicle.heroDescription}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{vehicle.difficulty} · {vehicle.communityBuilds}+ builds</span>
                  <span className="text-primary flex items-center gap-1">
                    View <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No vehicles match your search.</p>
            <Link to="/find-my-kit" className="text-primary hover:underline">Use the Find My Kit wizard instead →</Link>
          </div>
        )}
      </div>
    </main>
  );
}
