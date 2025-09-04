import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import styles from './about.module.scss'

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      <Navbar />
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.title}>About Us</h1>
          <p className={styles.subtitle}>
            Discover who we are and what we want
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Mission</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
              eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Values</h2>
            <div className={styles.valuesList}>
              <div className={styles.valueItem}>
                <h3>Creativity</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
              </div>
              <div className={styles.valueItem}>
                <h3>Exceed yourself !</h3>
                <p>Ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.</p>
              </div>

              
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          
          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <h3>What is Rebirth Society School ?</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>How to access premium content ?</h3>
              <p>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
                ut aliquip ex ea commodo consequat.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>Is there a refund program ?</h3>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
                dolore eu fugiat nulla pariatur.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>How to contact support ?</h3>
              <p>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui 
                officia deserunt mollit anim id est laborum.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>Can I share my account ?</h3>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem 
                accusantium doloremque laudantium.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>Is the content available offline ?</h3>
              <p>
                Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, 
                consectetur, adipisci velit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contact}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>A question ?</h2>
          <p>Please do not hesitate to contact us for further information.</p>
          <a href="/contact"><button className={styles.contactButton}>
            Contact Us
          </button></a>
        </div>
      </section>
      <Footer />
    </div> 
  )
}
