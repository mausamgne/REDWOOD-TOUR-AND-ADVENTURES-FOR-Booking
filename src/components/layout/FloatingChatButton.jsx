import { MessageSquare, X } from "lucide-react";
import { useState } from "react";

export default function FloatingChatButton() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setSubmitted(true);
  };

  return (
    <>
      {open && (
        <div
          className={`fixed left-8 ${
            submitted ? "bottom-80" : "bottom-7"
          } z-[9999] w-[330px] max-w-[calc(100vw-32px)] bg-white rounded-md shadow-2xl overflow-hidden`}
        >
          <div className="bg-[#b52326] text-white px-5 py-4 flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-[3px]">
              Leave a message
            </h3>

            <button onClick={() => setOpen(false)}>
              <X size={28} />
            </button>
          </div>

          <div className="max-h-[620px] overflow-y-auto">
            {submitted ? (
              <div className="p-5 text-sm">
                <p className="text-gray-500 text-sm leading-6">
                  Your message has been successfully sent.
                  <br />
                  We will reply to you as soon as possible.
                  <br />
                  Thank you!
                </p>
              </div>
            ) : (
              <div className="p-5 text-sm">
                <p className="text-gray-500 text-sm leading-6 mb-8">
                  {/* Live Chat is now closed */}
                  <br />
                  Please leave us a message and a customer service
                  representative will be in contact with you shortly.
                </p>

                <label className="block text-gray-600 text-sm font-bold mb-2">
                  YOUR FULL NAME *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`w-full bg-gray-100 px-5 py-3 rounded-md outline-none text-sm ${
                    errors.name ? "border border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 mb-4 text-xs text-red-600">
                    {errors.name}
                  </p>
                )}

                <label className="block text-gray-600 text-sm font-bold mb-2 mt-6">
                  YOUR EMAIL *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`w-full bg-gray-100 px-5 py-3 rounded-md outline-none text-sm ${
                    errors.email ? "border border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 mb-4 text-xs text-red-600">
                    {errors.email}
                  </p>
                )}

                <label className="block text-gray-600 text-sm font-bold mb-2 mt-6">
                  YOUR MESSAGE *
                </label>
                <textarea
                  rows="5"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className={`w-full bg-gray-100 px-5 py-3 rounded-md outline-none text-sm resize-none ${
                    errors.message ? "border border-red-500" : ""
                  }`}
                />
                {errors.message && (
                  <p className="mt-1 mb-4 text-xs text-red-600">
                    {errors.message}
                  </p>
                )}

                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleSubmit}
                    className="bg-[#b52326] text-white px-5 py-2 rounded-md text-sm font-bold tracking-wide"
                  >
                    SUBMIT
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => {
          setOpen(true);
          setSubmitted(false);
          setErrors({});
        }}
        className="fixed left-8 bottom-8 z-[9999] w-20 h-20 rounded-full bg-[#c62828] shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
      >
        <MessageSquare size={42} fill="white" className="text-white" />
      </button>
    </>
  );
}