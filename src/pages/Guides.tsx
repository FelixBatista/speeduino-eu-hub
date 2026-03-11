import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { motion } from "framer-motion";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import { SPEEDUINO_WIKI } from "@/data/speeduinoLinks";
import SEOHead from "@/components/SEOHead";

export default function Guides() {
  return (
    <>
      <SEOHead
        title="Speeduino ECU Guides & Blog | Aftermarket ECU Tutorials for Europe"
        description="Practical guides for Speeduino and aftermarket ECU builds in Europe. Wiring basics, sensor selection, boost control, first start, and tuning guides."
        canonical="/guides"
      />
      <div className="container max-w-3xl pt-24 pb-20">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Guides & Blog</span>
        </nav>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Guides & Blog</h1>
        <p className="text-muted-foreground max-w-2xl mb-6">
          Practical, technical guides for Speeduino builds — wiring, tuning, sensor selection, and more.
        </p>
        <p className="text-sm text-muted-foreground mb-12 flex flex-wrap items-center gap-1">
          <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
          The official, up-to-date manual lives on the project:{" "}
          <a href={SPEEDUINO_WIKI} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
            Official Speeduino documentation
          </a>
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="card-motorsport p-6 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{post.category}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {post.readTime}
                </span>
              </div>
              <Link to={`/guides/${post.slug}`}>
                <h2 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
              </Link>
              <p className="text-sm text-muted-foreground mb-4">{post.intro}</p>
              <div className="mb-4">
                <p className="data-label text-[10px] mb-2">Topics covered</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {post.outline.slice(0, 3).map((item, j) => (
                    <li key={j}>• {item}</li>
                  ))}
                </ul>
              </div>
              <Link to={`/guides/${post.slug}`} className="text-primary text-sm font-medium flex items-center gap-1">
                Read more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </>
  );
}
