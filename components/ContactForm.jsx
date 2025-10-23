import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const handleCaptchaChange = (token) => {
    if (token) {
      setCaptchaVerified(true);
      console.log("Captcha verified:", token);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!captchaVerified) {
      alert("Please verify that you are not a robot!");
      return;
    }
    alert("Form submitted successfully!");
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <label htmlFor="email">E-Mailadres</label>
      <input
        type="email"
        id="email"
        placeholder="Vul je e-mailadres in"
        className="form-control mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="message">Jouw bericht</label>
      <textarea
        id="message"
        placeholder="Type hier je bericht"
        className="form-control mb-4"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {/* <div className="flex-box items-center gap-3">
        <img src="/images/rb.png" alt="" width={40} height={40} />
        <input type="submit" value="verzend je bericht" className="glob-btn" />
      </div> */}
      <div className="flex-box items-center gap-3">
        <ReCAPTCHA
          sitekey="6LeIFPQrAAAAAGIKDWoD9aVMgCxeK6I7EbcdUXYh"
          onChange={handleCaptchaChange}
        />

        <input
          type="submit"
          value="verzend je bericht"
          className="glob-btn contact-global-btn"
        />
      </div>
    </form>
  );
}
