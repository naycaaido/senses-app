import { Link } from "react-router-dom";
import "../styles/landing.css";

function Navbar() {
  return (
    <header className='navbar'>
      <div className='navbar__inner'>
        <Link to='/' className='brand'>
          <span className='brand__name'>SENSE&rsquo;S</span>
          <span className='brand__sub'>clinic</span>
        </Link>

        <nav className='nav-links'>
          <Link to='/'>Beranda</Link>
          <a href='#layanan'>Layanan</a>
        </nav>

        <div className='nav-auth'>
          <Link to='/login' className='btn btn--login'>
            Login
          </Link>
          <Link to='/register' className='btn btn--register'>
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className='footer'>
      <div className='footer__inner'>
        <div>
          <div className='footer__brand'>Sense&rsquo;s Clinic</div>
          <div className='footer__copy'>
            &copy; 2024 Sense&rsquo;s Clinic. Premium Dermatology &amp;
            Wellness.
          </div>
        </div>
        <div className='footer__links'>
          <a href='#layanan'>Tentang Kami</a>
          <a href='#layanan'>Kebijakan Privasi</a>
          <a href='#layanan'>Kontak</a>
          <a href='#layanan'>Bantuan</a>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className='landing'>
      <Navbar />

      <main>
        {/* Hero */}
        <section className='hero'>
          <div className='hero__grid'>
            <div className='hero__content'>
              <span className='badge'>
                <span className='badge__dot'></span>
                Premium Dermatology
              </span>
              <h1 className='hero__title'>
                Awaken Your Skin&rsquo;s
                <br />
                True Vitality
              </h1>
              <p className='hero__text'>
                Experience personalized care rooted in advanced science and
                profound tranquility. Our minimalist approach reveals the
                healthiest version of you.
              </p>
              <Link to='/login' className='btn btn--dark'>
                Reservasi Sekarang
              </Link>
            </div>

            <div className='hero__media'>
              <img
                src='/assets/hero-clinic.png'
                alt="Sense's Clinic treatment"
              />
              <div className='glass'>
                <div className='glass__head'>
                  <img className="glass_icon"  src='/assets/icon-calm.svg' alt='' />
                  <span className='glass__title'>Calm &amp; Care</span>
                </div>
                <p className='glass__text'>
                  Healing starts the moment you walk through our doors.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Highlights (Bento) */}
        <section className='section bento'>
          <div className='section__inner'>
            <div className='bento__head'>
              <h2 className='section__eyebrow'>Signature Highlights</h2>
              <p className='section__lead'>
                Curated treatments designed to restore balance and enhance your
                natural radiance.
              </p>
            </div>

            <div className='bento__grid'>
              <article className='bento-card'>
                <div className='bento-card__img'>
                  <img
                    src='/assets/service-facial.png'
                    alt='Facial Treatment'
                  />
                </div>
                <div className='bento-card__body'>
                  <div>
                    <h3 className='bento-card__title'>Facial Treatment</h3>
                    <p className='bento-card__text'>
                      Deep cleansing, exfoliation, and intense hydration
                      tailored to your specific skin profile for a luminous
                      glow.
                    </p>
                  </div>
                  <a href='#layanan' className='learn-link'>
                    Pelajari Lebih Lanjut
                    <img src='/assets/icon-arrow.svg' alt='' />
                  </a>
                </div>
              </article>

              <article className='bento-card bento-card--soft'>
                <div className='bento-card__body'>
                  <div>
                    <h3 className='bento-card__title'>Acne Treatment</h3>
                    <p className='bento-card__text'>
                      Comprehensive, medically-backed protocols to clear
                      congestion, reduce inflammation, and prevent future
                      breakouts while respecting your skin barrier.
                    </p>
                  </div>
                  <a href='#layanan' className='learn-link'>
                    Pelajari Lebih Lanjut
                    <img src='/assets/icon-arrow.svg' alt='' />
                  </a>
                </div>
                <div className='bento-card__img'>
                  <img src='/assets/service-acne.png' alt='Acne Treatment' />
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <section className='section featured' id='layanan'>
          <div className='section__inner'>
            <div className='featured__head'>
              <div>
                <h2 className='featured__title'>Featured Services</h2>
                <p className='featured__lead'>
                  Transparent pricing and clear expectations for your journey.
                </p>
              </div>
              <a href='#layanan' className='btn btn--outline'>
                Lihat Semua Layanan
              </a>
            </div>

            <div className='featured__grid'>
              <article className='svc-card'>
                <div className='svc-card__img'>
                  <img
                    src='/assets/service-hydraglow.png'
                    alt='HydraGlow Facial'
                  />
                </div>
                <div className='svc-card__title-row'>
                  <h3 className='svc-card__title'>HydraGlow Facial</h3>
                  <span className='svc-card__badge'>Populer</span>
                </div>
                <p className='svc-card__desc'>
                  Our signature multi-step treatment to cleanse, extract, and
                  deeply hydrate.
                </p>
                <div className='svc-card__foot'>
                  <span className='svc-card__time'>
                    <img src='/assets/icon-clock.svg' alt='' />
                    60 min
                  </span>
                  <span className='svc-card__price'>Rp 850.000</span>
                </div>
              </article>

              <article className='svc-card'>
                <div className='svc-card__img'>
                  <img
                    src='/assets/service-laser.png'
                    alt='Laser Rejuvenation'
                  />
                </div>
                <div className='svc-card__title-row'>
                  <h3 className='svc-card__title'>Laser Rejuvenation</h3>
                </div>
                <p className='svc-card__desc'>
                  Advanced laser technology to stimulate collagen and refine
                  skin texture.
                </p>
                <div className='svc-card__foot'>
                  <span className='svc-card__time'>
                    <img src='/assets/icon-clock.svg' alt='' />
                    45 min
                  </span>
                  <span className='svc-card__price'>Rp 1.200.000</span>
                </div>
              </article>

              <article className='svc-card'>
                <div className='svc-card__img'>
                  <img
                    src='/assets/service-skin-consult.png'
                    alt='Skin Consultation'
                  />
                </div>
                <div className='svc-card__title-row'>
                  <h3 className='svc-card__title'>Skin Consultation</h3>
                </div>
                <p className='svc-card__desc'>
                  In-depth analysis by our experts to create your personalized
                  treatment roadmap.
                </p>
                <div className='svc-card__foot'>
                  <span className='svc-card__time'>
                    <img src='/assets/icon-clock.svg' alt='' />
                    30 min
                  </span>
                  <span className='svc-card__price'>Rp 300.000</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className='why'>
          <div className='why__decor'></div>
          <div className='why__inner'>
            <div className='why__col'>
              <h2 className='why__title'>Why Sense&rsquo;s Clinic?</h2>
              <div className='why__list'>
                <div className='why__item'>
                  <div className='why__icon'>
                    <img src='/assets/icon-care.svg' alt='' />
                  </div>
                  <div>
                    <h4 className='why__item-title'>Personalized Care</h4>
                    <p className='why__item-text'>
                      We understand that no two skin profiles are alike. Every
                      treatment plan is meticulously crafted for your unique
                      biology.
                    </p>
                  </div>
                </div>
                <div className='why__item'>
                  <div className='why__icon'>
                    <img src='/assets/icon-science.svg' alt='' />
                  </div>
                  <div>
                    <h4 className='why__item-title'>Evidence-Based Science</h4>
                    <p className='why__item-text'>
                      Our protocols rely strictly on proven dermatological
                      science, utilizing state-of-the-art equipment for safe,
                      effective results.
                    </p>
                  </div>
                </div>
                <div className='why__item'>
                  <div className='why__icon'>
                    <img src='/assets/icon-tranquility.svg' alt='' />
                  </div>
                  <div>
                    <h4 className='why__item-title'>Holistic Tranquility</h4>
                    <p className='why__item-text'>
                      We move beyond the sterile clinical feel to provide a
                      sanctuary where your mind can rest while your skin heals.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='why__media'>
              <img
                src='/assets/why-choose-us.png'
                alt="Sense's Clinic interior"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
