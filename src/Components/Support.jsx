import { useState } from 'react';
import styles from '../Styles/Support.module.css';

const Support = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  const handleContactFormOpen = () => setShowContactForm(true);
  const handleFaqOpen = () => setShowFaq(true);

  const handleCloseModal = () => {
    setShowContactForm(false);
    setShowFaq(false);
  };

  return (
    <div className={styles.supportContainer}>
      <h2>Support</h2>
      <p>
        If you have any issues or need assistance, please contact our support
        team through one of the following methods:
      </p>

      <div className={styles.supportOptions}>
        <div className={styles.supportItem}>
          <h3>Email</h3>
          <p>
            Send us an email at{' '}
            <a href="mailto:support@example.com">swyft@gmail.com</a>
          </p>
        </div>

        <div className={styles.supportItem}>
          <h3>Phone</h3>
          <p>
            Call us at: <a href="tel:+254745678902">+254745678902</a>
          </p>
        </div>

        <div className={styles.supportItem}>
          <h3>Contact Form</h3>
          <button onClick={handleContactFormOpen}>
            Fill out our Contact Form
          </button>
        </div>

        <div className={styles.supportItem}>
          <h3>FAQ</h3>
          <button onClick={handleFaqOpen}>Visit our FAQ</button>
        </div>
      </div>

      {showContactForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button onClick={handleCloseModal} className={styles.closeBtn}>
              X
            </button>
            <h3>Contact Form</h3>
            <form>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="message">Message:</label>
                <textarea id="message" name="message" required></textarea>
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      {showFaq && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button onClick={handleCloseModal} className={styles.closeBtn}>
              X
            </button>
            <h3>Frequently Asked Questions</h3>
            <ul>
              <li>
                <strong>How can I reset my password?</strong>
                <br />
                Visit the reset password page and follow the instructions.
              </li>
              <li>
                <strong>How can I track my order?</strong>
                <br />
                You can track your order from your dashboard.
              </li>
              <li>
                <strong>What should I do if I have a delivery issue?</strong>
                <br />
                Contact our support team through the contact form.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
