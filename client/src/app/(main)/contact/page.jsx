"use client";

import EmailIcon from "@/UI/EmailIcon";
import LocationIcon from "@/UI/LocationIcon";
import PhoneIcon from "@/UI/PhoneIcon";
import { Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { baseURL } from "@/config/env";
import { toast } from "react-toastify";

const KtmMap = dynamic(() => import("@/components/KtmMap"), { ssr: false });

const page = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const contactInfo = [
    { type: "Email", icon: <EmailIcon />, value: "contact@stylehub.com" },
    { type: "Phone", icon: <PhoneIcon />, value: "+977-9841234567" },
    {
      type: "Address",
      icon: <LocationIcon />,
      value: "Gokarneshwor, Kathmandu",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!fname || !lname || !email || !subject || !message) {
      toast.error("Please fill in all required fields!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${baseURL}/contact/send-message`, {
        fname,
        lname,
        email,
        phone,
        subject,
        message,
      });

      if (res.data.success) {
        toast.success("Message sent successfully!");
        setFname("");
        setLname("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
      } else {
        toast.error(res.data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error.response || error);
      toast.error(
        error.response?.data?.message || "An error occurred. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-[1200px] mx-auto mt-5">
      <section className="w-full flex flex-col justify-center items-center py-5">
        <h1 className="text-3xl font-semibold">Get in Touch</h1>
        <p className="text-gray-600 mt-2">
          Contact our team for any product inquiries, order support, or
          partnership opportunities.
        </p>
      </section>

      <section className="flex flex-wrap gap-5 items-start">
        <div className="w-full md:w-[30%] bg-[#ffff] p-5 rounded-md">
          <h1 className="text-xl font-semibold">Contact Information</h1>
          <p className="text-gray-600 mt-2">
            Let’s connect, we’re here to help you.
          </p>
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="flex items-center justify-start py-3 gap-3"
            >
              <span className="flex text-orange-500">{info.icon}</span>
              <div className="flex flex-col text-sm font-semibold">
                <p>{info.type}</p>
                <p className="font-normal text-gray-600">{info.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-5 rounded-md w-full md:w-[65%]">
          <h1 className="text-xl font-semibold">Send a Message</h1>
          <p className="text-gray-600 mt-2">
            Have a question or feedback? Fill out the form below to reach out to
            us, and we’ll get back to you as soon as possible.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-row flex-wrap gap-6 mt-6 text-sm"
          >
            <div className="flex flex-col w-full md:w-[48%]">
              <label htmlFor="fname">First Name*</label>
              <input
                type="text"
                id="fname"
                placeholder="Nishant"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                className="border border-gray-300 rounded-md p-2 mt-1 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col w-full md:w-[48%]">
              <label htmlFor="lname">Last Name*</label>
              <input
                type="text"
                id="lname"
                placeholder="Chaudhary"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
                className="border border-gray-300 rounded-md p-2 mt-1 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col w-full md:w-[48%]">
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                placeholder="example123@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-md p-2 mt-1 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col w-full md:w-[48%]">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                placeholder="+977 9812345670"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-gray-300 rounded-md p-2 mt-1 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col w-full">
              <label htmlFor="subject">Subject*</label>
              <input
                type="text"
                id="subject"
                placeholder="How can we help you?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border border-gray-300 rounded-md p-2 mt-1 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col w-full">
              <label htmlFor="message">Message*</label>
              <textarea
                id="message"
                placeholder="Your message..."
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border border-gray-300 rounded-md p-2 mt-1 w-full h-32 resize-none outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
              />
            </div>

            <div className="w-full">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-orange-500 text-white rounded-md flex items-center justify-center gap-2 hover:bg-orange-600 hover:scale-105 transition-colors duration-300 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Send className="w-4 h-4" />
                <span>{loading ? "Sending..." : "Send Message"}</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center mt-10">
        <h2 className="text-2xl font-semibold mb-2">Our Location</h2>
        <p className="text-gray-600 mb-4">
          Visit our store in Gokarneshwor, Kathmandu. We are open daily and
          ready to serve you with the latest fashion and lifestyle products.
        </p>

        <KtmMap />
      </section>
    </main>
  );
};

export default page;
