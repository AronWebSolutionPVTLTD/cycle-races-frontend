// import { callAPI } from "../lib/api";
// import { useState } from "react";
// import ReCAPTCHA from "react-google-recaptcha";

// export default function ContactForm() {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [captchaVerified, setCaptchaVerified] = useState(false);


// const handleCaptchaChange = async (token) => {
//   if (!token) return;

//   try {
//     const response = await callAPI(
//       "POST",
//       "communication/verify-captcha", 
//       { token }
//     );

//     if (response.status) {
//       setCaptchaVerified(true);
//       console.log("Captcha verified successfully");
//     } else {
//       setCaptchaVerified(false);
//       console.warn("Captcha verification failed");
//     }
//   } catch (error) {
//     console.error("Captcha verification error:", error);
//     setCaptchaVerified(false);
//   }
// };


//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!captchaVerified) {
//       alert("Please verify that you are not a robot!");
//       return;
//     }
//     alert("Form submitted successfully!");
//   };

//   return (
//     <form onSubmit={(e) => handleSubmit(e)}>
//       <label htmlFor="email">E-Mailadres</label>
//       <input
//         type="email"
//         id="email"
//         placeholder="Vul je e-mailadres in"
//         className="form-control mb-3"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <label htmlFor="message">Jouw bericht</label>
//       <textarea
//         id="message"
//         placeholder="Type hier je bericht"
//         className="form-control mb-4"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />
//       {/* <div className="flex-box items-center gap-3">
//         <img src="/images/rb.png" alt="" width={40} height={40} />
//         <input type="submit" value="verzend je bericht" className="glob-btn" />
//       </div> */}
//       <div className="flex-box items-center gap-3">
//         <ReCAPTCHA
//           sitekey="6LeIFPQrAAAAAGIKDWoD9aVMgCxeK6I7EbcdUXYh"
//           onChange={handleCaptchaChange}
//         />

//         <input
//           type="submit"
//           value="verzend je bericht"
//           className="glob-btn contact-global-btn"
//         />
//       </div>
//     </form>
//   );
// }


import { callAPI } from "../lib/api";
import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({ email: "", message: "" });
  const recaptchaRef = useRef(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: "", message: "" });
    }, 8000);
  };

  const handleCaptchaChange = async (token) => {
    if (!token) {
      setCaptchaVerified(false);
      return;
    }
    console.log(token, "token")
    try {
      const response = await callAPI(
        "POST",
        "communication/verify-captcha",
        { token }
      );

      if (response.status) {
        setCaptchaVerified(true);
        console.log("Captcha verified successfully");
      } else {
        setCaptchaVerified(false);
        console.warn("Captcha verification failed", response);
        showNotification("error", "Captcha verificatie mislukt. Probeer het opnieuw.");
        recaptchaRef.current?.reset();
      }
    } catch (error) {
      console.error("Captcha verification error:", error);
      setCaptchaVerified(false);
      showNotification("error", "Captcha verificatie fout. Probeer het opnieuw.");
      recaptchaRef.current?.reset();
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", message: "" };

    // Validate email
    if (!email.trim()) {
      newErrors.email = "E-mailadres is verplicht";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Voer een geldig e-mailadres in";
      isValid = false;
    }

    // Validate message
    if (!message.trim()) {
      newErrors.message = "Bericht is verplicht";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!validateForm()) {
      showNotification("error", "Vul alle verplichte velden correct in!");
      return;
    }

    if (!captchaVerified) {
      showNotification("error", "Verifieer dat je geen robot bent!");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await callAPI(
        "POST",
        "communication/send-mail",
        {
          email: email,
          message: message
        }
      );

      if (response.status) {
        showNotification("success", "Bericht succesvol verzonden!");
        // Reset form
        setEmail("");
        setMessage("");
        setCaptchaVerified(false);
        setErrors({ email: "", message: "" });
        recaptchaRef.current?.reset();
      } else {
        showNotification("error", "Verzenden mislukt. Probeer het opnieuw.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      showNotification("error", "Er is een fout opgetreden. Probeer het opnieuw.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {notification.message && (
        <div
          className={`notification mb-3 p-3 rounded ${notification.type === "success"
            ? "bg-green-100 text-green-800 border border-green-300"
            : "bg-red-100 text-red-800 border border-red-300"
            }`}
          style={{
            backgroundColor: notification.type === "success" ? "#d4edda" : "#f8d7da",
            color: notification.type === "success" ? "#155724" : "#721c24",
            border: `1px solid ${notification.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
            padding: "12px",
            borderRadius: "4px",
            marginBottom: "1rem"
          }}
        >
          {notification.message}
        </div>
      )}

      <label htmlFor="email">
        E-Mailadres <span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="email"
        id="email"
        placeholder="Vul je e-mailadres in"
        className={`form-control mb-1 ${errors.email ? 'border-red-500' : ''}`}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors({ ...errors, email: "" });
        }}
        required
      />
      {errors.email && (
        <div style={{ color: "#721c24", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
          {errors.email}
        </div>
      )}

      <label htmlFor="message">
        Jouw bericht <span style={{ color: "red" }}>*</span>
      </label>
      <textarea
        id="message"
        placeholder="Type hier je bericht"
        className={`form-control mb-1 ${errors.message ? 'border-red-500' : ''}`}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          if (errors.message) setErrors({ ...errors, message: "" });
        }}
        required
      />
      {errors.message && (
        <div style={{ color: "#721c24", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
          {errors.message}
        </div>
      )}

      <div className="flex-box items-center gap-3 my-4">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey="6LeRpvUrAAAAALKa4-G-53v7-dwckhCAzqTMwXhB"
          onChange={handleCaptchaChange}
        />

        <input
          type="submit"
          value={isSubmitting ? "Verzenden..." : "verzend je bericht"}
          className="glob-btn contact-global-btn"
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
}