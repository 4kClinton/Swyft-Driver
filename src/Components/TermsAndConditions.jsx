const TermsAndConditions = () => {
  // Inline styles object for reuse
  const containerStyle = {
    padding: '20px',
    fontFamily: "'Montserrat', sans-serif",
    lineHeight: '1.6',
    color: '#fff',
  };

  const headerStyle = {
    fontSize: '2rem',
    marginBottom: '10px',
  };

  const sectionHeaderStyle = {
    fontSize: '1.5rem',
    margin: '20px 0 10px 0',
  };

  const listStyle = {
    marginLeft: '20px',
  };

  const footerStyle = {
    marginTop: '20px',
    fontSize: '0.9rem',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Swyft Drivers Terms and Conditions</h1>
      <p style={{ fontStyle: 'italic' }}>
        <em>Last Updated: 4/16/2025</em>
      </p>

      <section>
        <h2 style={sectionHeaderStyle}>1. Acceptance of Terms</h2>
        <p>
          By registering as a Swyft Driver and using our platform, you agree to
          abide by these Terms and Conditions. These terms govern your conduct
          as you provide transportation services under the Swyft brand.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>
          2. Vehicle Categories and Service Offerings
        </h2>
        <h3 style={{ marginBottom: '5px' }}>Cargo Services</h3>
        <ul style={listStyle}>
          <li>Vans</li>
          <li>Pickups</li>
          <li>Mini Trucks</li>
          <li>Car Rescue (Flatbed)</li>
          <li>Lorry 5 Tonne</li>
          <li>Lorry 10 Tonne</li>
        </ul>
        <h3 style={{ marginBottom: '5px', marginTop: '15px' }}>
          Parcel Services
        </h3>
        <ul style={listStyle}>
          <li>Bodaboda</li>
          <li>Electric Bodaboda</li>
          <li>Car</li>
          <li>Tuktuk</li>
        </ul>
        <h3 style={{ marginBottom: '5px', marginTop: '15px' }}>
          Moving Services
        </h3>
        <ul style={listStyle}>
          <li>Pickup 5</li>
          <li>Tonne Lorry</li>
          <li>10 Tonne Lorry</li>
        </ul>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>3. Driver Verification and KYC</h2>
        <p>
          All drivers are required to submit complete and accurate Know Your
          Customer (KYC) details during registration. This information is
          essential for verifying your identity and will be used in any legal
          proceedings arising from a breach of these Terms, including disputes
          related to lost or damaged goods.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>
          4. Driver Responsibilities and Code of Conduct
        </h2>
        <p>As a Swyft Driver, you are expected to:</p>
        <ul style={listStyle}>
          <li>
            Operate your vehicle in a safe, responsible, and professional manner
            at all times.
          </li>
          <li>
            Comply with all local traffic laws, regulations, and licensing
            requirements.
          </li>
          <li>
            Ensure that goods are handled with care and transported securely.
          </li>
          <li>
            Maintain a clean and serviceable vehicle suitable for the type of
            service provided.
          </li>
          <li>
            Respect customer property and privacy, and refrain from any
            unauthorized use or access to the transported goods.
          </li>
        </ul>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>5. Prohibited Conduct</h2>
        <p>
          The following activities are strictly prohibited for all Swyft
          Drivers:
        </p>
        <ul style={listStyle}>
          <li>
            Engaging in or facilitating any form of theft, fraud, or
            misappropriation of goods. Any attempt to steal, tamper with, or
            unlawfully interfere with the transported goods is grounds for
            immediate termination and legal action.
          </li>
          <li>
            Using the Swyft platform for any illegal or unethical activities.
          </li>
          <li>
            Displaying aggressive, discriminatory, or harassing behavior towards
            customers, colleagues, or any third party.
          </li>
          <li>
            Altering or tampering with the vehicle identification details or KYC
            documents provided during registration.
          </li>
          <li>
            Failing to report accidents, theft, or any damage to the goods as
            soon as they are detected.
          </li>
        </ul>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>6. Liability for Loss or Damage</h2>
        <p>
          Swyft does not provide insurance coverage for goods transported via
          our platform. Drivers acknowledge that they bear full responsibility
          for the safe handling and transportation of the goods. In the event
          that goods are lost, damaged, or stolen due to negligence or breach of
          these Terms, Swyft reserves the right to pursue legal action based on
          the verified KYC details.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>7. Insurance Disclaimer</h2>
        <p>
          Currently, Swyft does not insure the products or goods transported.
          All risks associated with the movement of goods fall solely on the
          consignor. Drivers are required to operate under this understanding.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>8. Amendments to These Terms</h2>
        <p>
          Swyft reserves the right to modify or update these Terms and
          Conditions at any time. Any changes will be communicated through the
          platform, and continued use of Swyft services will constitute
          acceptance of the updated terms.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>9. Governing Law and Jurisdiction</h2>
        <p>
          These Terms and Conditions are governed by the applicable laws of the
          jurisdiction in which the Swyft platform operates. Any disputes
          arising from these terms will be subject to the exclusive jurisdiction
          of the local courts.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>10. Acknowledgment</h2>
        <p>
          By registering as a Swyft Driver, you acknowledge that you have read,
          understood, and agree to be bound by these Terms and Conditions, and
          that any breach may result in penalties, termination of service, and
          legal action.
        </p>
      </section>

      <footer style={footerStyle}>
        <p>
          For any questions or concerns regarding these Terms and Conditions,
          please contact Swyft support at [Insert Contact Information].
        </p>
      </footer>
    </div>
  );
};

export default TermsAndConditions;
