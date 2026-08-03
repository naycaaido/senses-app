import { Link } from "react-router-dom";

const featuredServices = [
  {
    name: "HydraGlow Facial",
    image: "/assets/service-hydraglow.png",
    description: "Our signature multi-step treatment to cleanse, extract, and deeply hydrate.",
    duration: "60 min",
    price: "Rp 850.000",
    popular: true,
  },
  {
    name: "Laser Rejuvenation",
    image: "/assets/service-laser.png",
    description: "Advanced laser technology to stimulate collagen and refine skin texture.",
    duration: "45 min",
    price: "Rp 1.200.000",
  },
  {
    name: "Skin Consultation",
    image: "/assets/service-skin-consult.png",
    description: "In-depth analysis by our experts to create your personalized treatment roadmap.",
    duration: "30 min",
    price: "Rp 300.000",
  },
];

const reasons = [
  {
    title: "Personalized Care",
    icon: "/assets/icon-care.svg",
    description: "We understand that no two skin profiles are alike. Every treatment plan is meticulously crafted for your unique biology.",
  },
  {
    title: "Evidence-Based Science",
    icon: "/assets/icon-science.svg",
    description: "Our protocols rely strictly on proven dermatological science, utilizing state-of-the-art equipment for safe, effective results.",
  },
  {
    title: "Holistic Tranquility",
    icon: "/assets/icon-tranquility.svg",
    description: "We move beyond the sterile clinical feel to provide a sanctuary where your mind can rest while your skin heals.",
  },
];

export default function LandingPage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-24">
        <div className="grid items-center gap-12 min-[901px]:min-h-[700px] min-[901px]:grid-cols-[5fr_7fr]">
          <div className="flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d8c7b5] bg-[#efe2d2] px-[17px] py-[5px] text-[13px] font-semibold tracking-[0.04em] text-[#2b241e]">
              <span className="size-2 shrink-0 rounded-full bg-[#3f7d58]" />
              Premium Dermatology
            </span>
            <h1 className="m-0 font-serif text-4xl font-bold leading-[42px] text-[#082518] md:text-5xl md:leading-[53.76px]">
              Awaken Your Skin&rsquo;s
              <br />
              True Vitality
            </h1>
            <p className="m-0 max-w-md text-base leading-[26px] text-[#6f6257]">
              Experience personalized care rooted in advanced science and profound tranquility. Our minimalist approach reveals the healthiest version of you.
            </p>
            <Link to="/login" className="inline-flex items-center justify-center rounded-full bg-[#082518] px-8 py-3.5 text-[13px] font-semibold tracking-[0.04em] text-white hover:bg-[#0c3320]">
              Reservasi Sekarang
            </Link>
          </div>

          <div className="relative h-[420px] overflow-hidden rounded-[32px] border border-[#d8c7b5]/50 min-[901px]:h-[700px]">
            <img className="size-full object-cover" src="/assets/hero-clinic.png" alt="Sense's Clinic treatment" />
            <div className="absolute bottom-6 left-6 w-[calc(100%-48px)] rounded-xl border border-white/20 bg-[#fffdf8]/80 p-[25px] shadow-lg backdrop-blur-[6px] md:w-80">
              <div className="mb-[7px] flex items-center gap-4">
                <img className="size-5" src="/assets/icon-calm.svg" alt="" />
                <span className="text-[22px] font-bold leading-[28.6px] text-[#082518]">Calm &amp; Care</span>
              </div>
              <p className="m-0 text-sm leading-[21.7px] text-[#6f6257]">Healing starts the moment you walk through our doors.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#faf3e9]">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-16">
          <div className="mb-12">
            <h2 className="mb-2 font-serif text-[32px] font-bold leading-[39px] text-[#082518]">Signature Highlights</h2>
            <p className="m-0 max-w-3xl text-base leading-[26.4px] text-[#6f6257]">Curated treatments designed to restore balance and enhance your natural radiance.</p>
          </div>
          <div className="flex flex-col items-stretch gap-6 min-[901px]:flex-row">
            <article className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#d8c7b5] bg-[#fffdf8]">
              <img className="h-64 w-full object-cover" src="/assets/service-facial.png" alt="Facial Treatment" />
              <div className="flex flex-1 flex-col justify-between p-8">
                <div>
                  <h3 className="mb-[7px] text-[22px] font-bold leading-[28.6px] text-[#082518]">Facial Treatment</h3>
                  <p className="mb-6 text-sm leading-[21.7px] text-[#6f6257]">Deep cleansing, exfoliation, and intense hydration tailored to your specific skin profile for a luminous glow.</p>
                </div>
                <a href="#layanan" className="inline-flex items-center gap-1 text-[13px] font-semibold tracking-[0.04em] text-[#7a573e]">Pelajari Lebih Lanjut <img className="size-3" src="/assets/icon-arrow.svg" alt="" /></a>
              </div>
            </article>
            <article className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#d8c7b5] bg-[#f4ede3]">
              <div className="flex flex-1 flex-col justify-between p-8">
                <div>
                  <h3 className="mb-[7px] text-[22px] font-bold leading-[28.6px] text-[#082518]">Acne Treatment</h3>
                  <p className="mb-6 text-sm leading-[21.7px] text-[#6f6257]">Comprehensive, medically-backed protocols to clear congestion, reduce inflammation, and prevent future breakouts while respecting your skin barrier.</p>
                </div>
                <a href="#layanan" className="inline-flex items-center gap-1 text-[13px] font-semibold tracking-[0.04em] text-[#7a573e]">Pelajari Lebih Lanjut <img className="size-3" src="/assets/icon-arrow.svg" alt="" /></a>
              </div>
              <img className="h-64 w-full object-cover" src="/assets/service-acne.png" alt="Acne Treatment" />
            </article>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#fffdf8]" id="layanan">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-16">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="mb-2 font-serif text-[32px] font-bold leading-[39px] text-[#082518]">Featured Services</h2>
              <p className="m-0 text-base leading-[26.4px] text-[#6f6257]">Transparent pricing and clear expectations for your journey.</p>
            </div>
            <a href="#layanan" className="rounded-full border border-[#082518] bg-transparent px-[25px] py-[9px] text-[13px] font-semibold text-[#082518] hover:bg-[#082518]/5">Lihat Semua Layanan</a>
          </div>
          <div className="flex flex-col gap-6 min-[901px]:flex-row">
            {featuredServices.map((service) => (
              <article key={service.name} className="flex flex-1 flex-col rounded-xl border border-[#d8c7b5] bg-[#fffdf8] p-[17px]">
                <img className="mb-6 h-48 w-full rounded-lg object-cover" src={service.image} alt={service.name} />
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="m-0 text-[22px] font-bold leading-[28.6px] text-[#082518]">{service.name}</h3>
                  {service.popular && <span className="rounded-full bg-[#efe2d2] px-2 py-1 text-[13px] font-semibold tracking-[0.04em] text-[#3f7d58]">Populer</span>}
                </div>
                <p className="mb-4 min-h-[43px] text-sm leading-[21.7px] text-[#6f6257]">{service.description}</p>
                <div className="flex items-center justify-between border-t border-[#d8c7b5] pt-[17px]">
                  <span className="inline-flex items-center gap-1 text-sm text-[#9a8b7c]"><img className="size-[15px]" src="/assets/icon-clock.svg" alt="" />{service.duration}</span>
                  <span className="text-[13px] font-semibold tracking-[0.04em] text-[#082518]">{service.price}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#e8e2d8] py-24">
        <div className="absolute -right-24 -top-24 size-96 rounded-full bg-[#aeceb9]/20 blur-3xl" />
        <div className="relative mx-auto flex max-w-[1440px] flex-col items-center gap-10 px-5 min-[901px]:flex-row min-[901px]:gap-16 md:px-16">
          <div className="min-w-0 flex-1">
            <h2 className="mb-6 font-serif text-[32px] font-bold leading-[39px] text-[#082518]">Why Sense&rsquo;s Clinic?</h2>
            <div className="flex flex-col gap-8">
              {reasons.map((reason) => (
                <div key={reason.title} className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#d8c7b5] bg-[#fffdf8]"><img className="size-5 object-contain" src={reason.icon} alt="" /></div>
                  <div>
                    <h3 className="mb-[3px] text-lg font-bold leading-7 text-[#082518]">{reason.title}</h3>
                    <p className="m-0 text-sm leading-[21.7px] text-[#6f6257]">{reason.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <img className="h-[360px] w-full min-w-0 flex-1 rounded-[32px] object-cover min-[901px]:h-[600px]" src="/assets/why-choose-us.png" alt="Sense's Clinic interior" />
        </div>
      </section>
    </div>
  );
}
