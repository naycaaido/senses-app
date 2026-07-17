import styles from "../../styles/public-layout.module.css";
import cx from "../../utils/classNames.js";
export default function PublicFooter() {
  return (
    <footer className={cx(styles, "footer")}>
      <div className={cx(styles, "footer__inner")}>
        <div>
          <div className={cx(styles, "footer__brand")}>Sense&rsquo;s Clinic</div>
          <div className={cx(styles, "footer__copy")}>
            &copy; 2024 Sense&rsquo;s Clinic. Premium Dermatology &amp;
            Wellness.
          </div>
        </div>
        <div className={cx(styles, "footer__links")}>
          <a href='#layanan'>Tentang Kami</a>
          <a href='#layanan'>Kebijakan Privasi</a>
          <a href='#layanan'>Kontak</a>
          <a href='#layanan'>Bantuan</a>
        </div>
      </div>
    </footer>
  );
}
