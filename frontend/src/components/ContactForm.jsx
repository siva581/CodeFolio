import { useState } from "react";
import { useForm } from "react-hook-form";
import { apiRequest } from "../lib/api";

const DEFAULT_VALUES = {
  sender_name: "",
  sender_email: "",
  message: "",
};

export default function ContactForm({ recipientId }) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({ defaultValues: DEFAULT_VALUES });
  const [status, setStatus] = useState("");

  const onSubmit = async (values) => {
    setStatus("");

    try {
      const response = await apiRequest("/api/contact", {
        method: "POST",
        body: {
          recipient_id: recipientId,
          ...values,
        },
      });

      setStatus(response.message || "Message sent.");
      reset(DEFAULT_VALUES);
    } catch (error) {
      setStatus(error.message || "Message could not be sent");
    }
  };

  return (
    <section className="card contact-card">
      <h3>Contact</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
        <label>
          Name
          <input placeholder="Your name" {...register("sender_name", { required: true })} />
        </label>
        <label>
          Email
          <input type="email" placeholder="you@example.com" {...register("sender_email", { required: true })} />
        </label>
        <label>
          Message
          <textarea placeholder="Hi — I'm interested in your work. Could we connect?" {...register("message", { required: true })} />
        </label>
        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
      {status && <p className="info-text">{status}</p>}
    </section>
  );
}