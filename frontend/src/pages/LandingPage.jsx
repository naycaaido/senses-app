import styles from "../styles/landing.module.css";
import cx from "../utils/classNames.js";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className={cx(styles, "landing")}>
        {/* Hero */}
        <section className={cx(styles, "hero")}>
          <div className={cx(styles, "hero__grid")}>
            <div className={cx(styles, "hero__content")}>
              <span className={cx(styles, "badge")}>
                <span className={cx(styles, "badge__dot")}></span>
                Premium Dermatology
              </span>
              <h1 className={cx(styles, "hero__title")}>
                Awaken Your Skin&rsquo;s
                <br />
                True Vitality
              </h1>
              <p className={cx(styles, "hero__text")}>
                Experience personalized care rooted in advanced science and
                profound tranquility. Our minimalist approach reveals the
                healthiest version of you.
              </p>
              <Link to='/login' className={cx(styles, "btn btn--dark")}>
                Reservasi Sekarang
              </Link>
            </div>

            <div className={cx(styles, "hero__media")}>
              <img
                src='/assets/hero-clinic.png'
                alt="Sense's Clinic treatment"
              />
              <div className={cx(styles, "glass")}>
                <div className={cx(styles, "glass__head")}>
                  <img className={cx(styles, "glass_icon")}  src='/assets/icon-calm.svg' alt='' />
                  <span className={cx(styles, "glass__title")}>Calm &amp; Care</span>
                </div>
                <p className={cx(styles, "glass__text")}>
                  Healing starts the moment you walk through our doors.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Highlights (Bento) */}
        <section className={cx(styles, "section bento")}>
          <div className={cx(styles, "section__inner")}>
            <div className={cx(styles, "bento__head")}>
              <h2 className={cx(styles, "section__eyebrow")}>Signature Highlights</h2>
              <p className={cx(styles, "section__lead")}>
                Curated treatments designed to restore balance and enhance your
                natural radiance.
              </p>
            </div>

            <div className={cx(styles, "bento__grid")}>
              <article className={cx(styles, "bento-card")}>
                <div className={cx(styles, "bento-card__img")}>
                  <img
                    src='/assets/service-facial.png'
                    alt='Facial Treatment'
                  />
                </div>
                <div className={cx(styles, "bento-card__body")}>
                  <div>
                    <h3 className={cx(styles, "bento-card__title")}>Facial Treatment</h3>
                    <p className={cx(styles, "bento-card__text")}>
                      Deep cleansing, exfoliation, and intense hydration
                      tailored to your specific skin profile for a luminous
                      glow.
                    </p>
                  </div>
                  <a href='#layanan' className={cx(styles, "learn-link")}>
                    Pelajari Lebih Lanjut
                    <img src='/assets/icon-arrow.svg' alt='' />
                  </a>
                </div>
              </article>

              <article className={cx(styles, "bento-card bento-card--soft")}>
                <div className={cx(styles, "bento-card__body")}>
                  <div>
                    <h3 className={cx(styles, "bento-card__title")}>Acne Treatment</h3>
                    <p className={cx(styles, "bento-card__text")}>
                      Comprehensive, medically-backed protocols to clear
                      congestion, reduce inflammation, and prevent future
                      breakouts while respecting your skin barrier.
                    </p>
                  </div>
                  <a href='#layanan' className={cx(styles, "learn-link")}>
                    Pelajari Lebih Lanjut
                    <img src='/assets/icon-arrow.svg' alt='' />
                  </a>
                </div>
                <div className={cx(styles, "bento-card__img")}>
                  <img src='/assets/service-acne.png' alt='Acne Treatment' />
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <section className={cx(styles, "section featured")} id='layanan'>
          <div className={cx(styles, "section__inner")}>
            <div className={cx(styles, "featured__head")}>
              <div>
                <h2 className={cx(styles, "featured__title")}>Featured Services</h2>
                <p className={cx(styles, "featured__lead")}>
                  Transparent pricing and clear expectations for your journey.
                </p>
              </div>
              <a href='#layanan' className={cx(styles, "btn btn--outline")}>
                Lihat Semua Layanan
              </a>
            </div>

            <div className={cx(styles, "featured__grid")}>
              <article className={cx(styles, "svc-card")}>
                <div className={cx(styles, "svc-card__img")}>
                  <img
                    src='/assets/service-hydraglow.png'
                    alt='HydraGlow Facial'
                  />
                </div>
                <div className={cx(styles, "svc-card__title-row")}>
                  <h3 className={cx(styles, "svc-card__title")}>HydraGlow Facial</h3>
                  <span className={cx(styles, "svc-card__badge")}>Populer</span>
                </div>
                <p className={cx(styles, "svc-card__desc")}>
                  Our signature multi-step treatment to cleanse, extract, and
                  deeply hydrate.
                </p>
                <div className={cx(styles, "svc-card__foot")}>
                  <span className={cx(styles, "svc-card__time")}>
                    <img src='/assets/icon-clock.svg' alt='' />
                    60 min
                  </span>
                  <span className={cx(styles, "svc-card__price")}>Rp 850.000</span>
                </div>
              </article>

              <article className={cx(styles, "svc-card")}>
                <div className={cx(styles, "svc-card__img")}>
                  <img
                    src='/assets/service-laser.png'
                    alt='Laser Rejuvenation'
                  />
                </div>
                <div className={cx(styles, "svc-card__title-row")}>
                  <h3 className={cx(styles, "svc-card__title")}>Laser Rejuvenation</h3>
                </div>
                <p className={cx(styles, "svc-card__desc")}>
                  Advanced laser technology to stimulate collagen and refine
                  skin texture.
                </p>
                <div className={cx(styles, "svc-card__foot")}>
                  <span className={cx(styles, "svc-card__time")}>
                    <img src='/assets/icon-clock.svg' alt='' />
                    45 min
                  </span>
                  <span className={cx(styles, "svc-card__price")}>Rp 1.200.000</span>
                </div>
              </article>

              <article className={cx(styles, "svc-card")}>
                <div className={cx(styles, "svc-card__img")}>
                  <img
                    src='/assets/service-skin-consult.png'
                    alt='Skin Consultation'
                  />
                </div>
                <div className={cx(styles, "svc-card__title-row")}>
                  <h3 className={cx(styles, "svc-card__title")}>Skin Consultation</h3>
                </div>
                <p className={cx(styles, "svc-card__desc")}>
                  In-depth analysis by our experts to create your personalized
                  treatment roadmap.
                </p>
                <div className={cx(styles, "svc-card__foot")}>
                  <span className={cx(styles, "svc-card__time")}>
                    <img src='/assets/icon-clock.svg' alt='' />
                    30 min
                  </span>
                  <span className={cx(styles, "svc-card__price")}>Rp 300.000</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className={cx(styles, "why")}>
          <div className={cx(styles, "why__decor")}></div>
          <div className={cx(styles, "why__inner")}>
            <div className={cx(styles, "why__col")}>
              <h2 className={cx(styles, "why__title")}>Why Sense&rsquo;s Clinic?</h2>
              <div className={cx(styles, "why__list")}>
                <div className={cx(styles, "why__item")}>
                  <div className={cx(styles, "why__icon")}>
                    <img src='/assets/icon-care.svg' alt='' />
                  </div>
                  <div>
                    <h4 className={cx(styles, "why__item-title")}>Personalized Care</h4>
                    <p className={cx(styles, "why__item-text")}>
                      We understand that no two skin profiles are alike. Every
                      treatment plan is meticulously crafted for your unique
                      biology.
                    </p>
                  </div>
                </div>
                <div className={cx(styles, "why__item")}>
                  <div className={cx(styles, "why__icon")}>
                    <img src='/assets/icon-science.svg' alt='' />
                  </div>
                  <div>
                    <h4 className={cx(styles, "why__item-title")}>Evidence-Based Science</h4>
                    <p className={cx(styles, "why__item-text")}>
                      Our protocols rely strictly on proven dermatological
                      science, utilizing state-of-the-art equipment for safe,
                      effective results.
                    </p>
                  </div>
                </div>
                <div className={cx(styles, "why__item")}>
                  <div className={cx(styles, "why__icon")}>
                    <img src='/assets/icon-tranquility.svg' alt='' />
                  </div>
                  <div>
                    <h4 className={cx(styles, "why__item-title")}>Holistic Tranquility</h4>
                    <p className={cx(styles, "why__item-text")}>
                      We move beyond the sterile clinical feel to provide a
                      sanctuary where your mind can rest while your skin heals.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={cx(styles, "why__media")}>
              <img
                src='/assets/why-choose-us.png'
                alt="Sense's Clinic interior"
              />
            </div>
          </div>
        </section>
    </div>
  );
}
