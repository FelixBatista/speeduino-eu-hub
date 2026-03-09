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

export default function Index() {
  return (
    <main>
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

      {/* JSON-LD Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Wrench over Wallet",
            url: "https://wrenchoverwallet.com",
            description: "Open-source ECU components for Europe. DIY boards, sensors, modules, and accessories with EU shipping.",
            address: { "@type": "PostalAddress", addressCountry: "SE" },
          }),
        }}
      />
    </main>
  );
}
