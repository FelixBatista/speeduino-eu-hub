import { useParams, Link } from "react-router-dom";
import { getBlogPostBySlug, blogPosts, BlogReference } from "@/data/blogPosts";
import { motion } from "framer-motion";
import { Clock, ArrowLeft, ArrowRight, Calendar, BookOpen, MessageSquare, Wrench, ExternalLink } from "lucide-react";
import SEOHead from "@/components/SEOHead";

/**
 * Renders a plain-text body string with inline markdown support:
 * - **bold text** → <strong>
 * - [link text](url) → <a> (external) or <Link> (internal, starting with /)
 */
function renderInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*|\[([^\]]+)\]\(((?:https?:\/\/|\/)[^)]+)\)/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      parts.push(
        <strong key={key++} className="font-semibold text-foreground">
          {match[1]}
        </strong>
      );
    } else if (match[2] !== undefined) {
      const url = match[3];
      if (url.startsWith("/")) {
        parts.push(
          <Link key={key++} to={url} className="text-primary hover:underline">
            {match[2]}
          </Link>
        );
      } else {
        parts.push(
          <a
            key={key++}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {match[2]}
          </a>
        );
      }
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

const REFERENCE_TYPE_META: Record<
  BlogReference["type"],
  { label: string; Icon: React.FC<{ className?: string }> }
> = {
  wiki: { label: "Official Wiki", Icon: BookOpen },
  forum: { label: "Forum Discussion", Icon: MessageSquare },
  tool: { label: "Tools & Downloads", Icon: Wrench },
};

export default function BlogArticle() {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug || "");

  if (!post) {
    return (
      <main className="pt-32 pb-20 container text-center">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">Article Not Found</h1>
        <Link to="/guides" className="text-primary hover:underline">← All Guides</Link>
      </main>
    );
  }

  const idx = blogPosts.findIndex((p) => p.slug === post.slug);
  const prev = idx > 0 ? blogPosts[idx - 1] : null;
  const next = idx < blogPosts.length - 1 ? blogPosts[idx + 1] : null;

  const referenceTypes = (["wiki", "forum", "tool"] as BlogReference["type"][]).filter(
    (type) => post.references?.some((r) => r.type === type)
  );

  return (
    <>
      <SEOHead
        title={post.metaTitle}
        description={post.metaDescription}
        canonical={`/guides/${post.slug}`}
        ogType="article"
        schema={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.metaDescription,
          url: `https://wrenchoverwallet.com/guides/${post.slug}`,
          author: { "@type": "Organization", name: "Wrench over Wallet" },
          datePublished: post.date,
          publisher: {
            "@type": "Organization",
            name: "Wrench over Wallet",
            url: "https://wrenchoverwallet.com",
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://wrenchoverwallet.com/guides/${post.slug}`,
          },
        }}
      />
    <main className="pt-24 pb-20">

      <div className="container max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/guides" className="hover:text-foreground">Guides</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{post.title}</span>
        </nav>

        <Link to="/guides" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> All Guides
        </Link>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-mono text-primary bg-primary/10 px-3 py-1 rounded">{post.category}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.readTime}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {post.date}
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">{post.title}</h1>
          <p className="text-lg text-muted-foreground mb-4">{post.intro}</p>
          <p className="text-xs text-muted-foreground mb-10">By {post.author}</p>

          {/* Table of contents */}
          <div className="card-motorsport p-5 mb-10">
            <p className="data-label text-primary mb-3">In this article</p>
            <ul className="space-y-2">
              {post.content.map((section, i) => (
                <li key={i}>
                  <a href={`#section-${i}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {i + 1}. {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Content */}
          <div className="space-y-10">
            {post.content.map((section, i) => (
              <section key={i} id={`section-${i}`}>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">{section.heading}</h2>
                <div className="prose-custom">
                  {section.body.split("\n\n").map((paragraph, j) => (
                    <p key={j} className="text-secondary-foreground text-sm leading-relaxed mb-4 whitespace-pre-line">
                      {renderInlineMarkdown(paragraph)}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* References & Further Reading */}
          {post.references && post.references.length > 0 && (
            <div className="mt-12 card-motorsport p-5">
              <p className="data-label text-primary mb-4">References & Further Reading</p>
              <div className="space-y-4">
                {referenceTypes.map((type) => {
                  const items = post.references!.filter((r) => r.type === type);
                  const { label, Icon } = REFERENCE_TYPE_META[type];
                  return (
                    <div key={type}>
                      <p className="text-xs font-mono text-muted-foreground mb-2 flex items-center gap-1.5">
                        <Icon className="w-3 h-3" />
                        {label}
                      </p>
                      <ul className="space-y-1.5 ml-4">
                        {items.map((ref, i) => (
                          <li key={i}>
                            <a
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                            >
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                              {ref.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Prev/Next navigation */}
          <div className="mt-10 pt-8 border-t border-border grid grid-cols-2 gap-4">
            {prev ? (
              <Link to={`/guides/${prev.slug}`} className="card-motorsport p-4 group">
                <p className="data-label text-xs mb-1">← Previous</p>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{prev.title}</p>
              </Link>
            ) : <div />}
            {next ? (
              <Link to={`/guides/${next.slug}`} className="card-motorsport p-4 group text-right">
                <p className="data-label text-xs mb-1">Next →</p>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{next.title}</p>
              </Link>
            ) : <div />}
          </div>
        </motion.article>
      </div>

    </main>
    </>
  );
}
