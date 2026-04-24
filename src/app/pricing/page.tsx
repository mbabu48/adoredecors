import PriceCalculator from "@/components/PriceCalculator";

export const metadata = { title: "Pricing Estimator" };

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-10">
        <div className="text-[11px] text-rose tracking-[0.22em] mb-2">ESTIMATE YOUR EVENT</div>
        <h1 className="font-serif text-4xl sm:text-5xl text-burgundy">Transparent, tailored pricing.</h1>
        <p className="text-stone mt-3 max-w-xl mx-auto text-[14px]">
          Tell us a few details and see an instant estimate. This is indicative — we'll send a precise
          quote after a short consultation.
        </p>
      </div>
      <PriceCalculator />
    </div>
  );
}
