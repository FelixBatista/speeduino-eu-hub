import Hero from "@/components/home/Hero";
import WhySwitch from "@/components/home/WhySwitch";
import ComparisonSection from "@/components/home/ComparisonSection";
import CompatibilityWizard from "@/components/home/CompatibilityWizard";
import BundleShowcase from "@/components/home/BundleShowcase";
import ElectronicsSection from "@/components/home/ElectronicsSection";
import CaseStudy from "@/components/home/CaseStudy";
import InstallSteps from "@/components/home/InstallSteps";
import ConfigSnapshot from "@/components/home/ConfigSnapshot";
import FAQSection from "@/components/home/FAQSection";
import SEOHead from "@/components/SEOHead";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Wrench over Wallet",
  url: "https://wrenchoverwallet.com",
  logo: "https://wrenchoverwallet.com/favicon.png",
  description: "Europe's most affordable aftermarket ECU shop. Open-source Speeduino ECU kits, sensors, and modules shipped from the EU. Cheaper alternative to Haltech, Link ECU, MaxxECU, and ECUMaster.",
  email: "support@wrenchoverwallet.com",
  address: {
    "@type": "PostalAddress",
    addressCountry: "SE",
    addressRegion: "Sweden",
  },
  areaServed: [
    "SE", "DE", "FR", "NL", "BE", "AT", "DK", "NO", "FI", "PL",
    "CZ", "SK", "HU", "RO", "BG", "HR", "SI", "IT", "ES", "PT",
    "IE", "GB", "LT", "LV", "EE",
  ],
  knowsAbout: [
    "Aftermarket ECU", "Standalone ECU", "Engine Management System",
    "Speeduino", "Open-source ECU", "DIY engine management",
    "Fuel injection tuning", "TunerStudio", "ECU kits Europe",
  ],
  sameAs: [
    "https://github.com/noisymime/speeduino",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "support@wrenchoverwallet.com",
    areaServed: "EU",
    availableLanguage: "English",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Wrench over Wallet",
  url: "https://wrenchoverwallet.com",
  description: "Open-source Speeduino ECU kits for Europe. Affordable aftermarket engine management shipped from within the EU.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://wrenchoverwallet.com/shop?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function Index() {
  return (
    <main>
      <SEOHead
        title="Wrench over Wallet | Affordable Aftermarket ECU Kits for Europe — Speeduino"
        description="Europe's aftermarket ECU shop. Open-source Speeduino ECU kits from €149 inc. VAT. Affordable alternative to Haltech, Link ECU, MaxxECU & ECUMaster. Ships from the EU — no customs."
        canonical="/"
        ogType="website"
        schema={[organizationSchema, websiteSchema]}
      />
      <Hero />
      <WhySwitch />
      <ConfigSnapshot />
      <ComparisonSection />
      <CompatibilityWizard />
      <BundleShowcase />
      <ElectronicsSection />
      <CaseStudy />
      <InstallSteps />
      <FAQSection />
    </main>
  );
}
