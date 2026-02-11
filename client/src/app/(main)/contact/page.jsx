"use client";

import KtmMap from "@/components/KtmMap";
import EmailIcon from "@/UI/EmailIcon";
import LocationIcon from "@/UI/LocationIcon";
import PhoneIcon from "@/UI/PhoneIcon";
import { Send } from "lucide-react";
import React from "react";

const page = () => {
  const contactInfo = [
    { type: "Email", icon: <EmailIcon />, value: "contact@stylehub.com" },
    { type: "Phone", icon: <PhoneIcon />, value: "+977-9841234567" },
    {
      type: "Address",
      icon: <LocationIcon />,
      value: "Gokarneshwor, Kathmandu",
    },
  ];
  return (
    <main className="max-w-[1200px] mx-auto mt-5">
      <section className="w-full flex flex-col justify-center items-center py-5 ">
        <h1 className="text-3xl font-semibold">Get in Touch</h1>
        <p className="text-gray-600 mt-2">
          Contact our team for any product inquiries, order support, or
          partnership opportunities.
        </p>
      </section>
      <section className="flex flex-wrap gap-5 items-start">
        <div className="w-full md:w-[30%] bg-[#ffff] p-5 rounded-md">
          <h1 className="text-xl font-semibold">Contact Information</h1>
          <p className=" text-gray-600 mt-2">
            Let’s connect, we’re here to help you.
          </p>
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="flex items-center justify-start py-3 gap-3"
            >
              <span className="flex text-orange-500">{info.icon}</span>
              <div className="flex flex-col text-sm font-semibold">
                <p className="">{info.type}</p>
                <p className="font-normal text-gray-600"> {info.value}</p>
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

          <form className="flex flex-row flex-wrap gap-6 mt-6 text-sm">
            <div className="flex flex-col w-full md:w-[48%]">
              <label htmlFor="fname">First Name*</label>
              <input
                type="text"
                id="fname"
                name="fname"
                placeholder="Nishant"
                className="border border-gray-300 rounded-md p-2 mt-1 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col w-full md:w-[48%]">
              <label htmlFor="lname">Last Name*</label>
              <input
                type="text"
                id="lname"
                name="lname"
                placeholder="Chaudhary"
                className="border border-gray-300 rounded-md p-2 mt-1 outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
              />
            </div>
            <div className="flex flex-col w-full md:w-[48%]">
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="example123@gmail.com"
                className="border border-gray-300 rounded-md p-2 mt-1 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
              />
            </div>
            <div className="flex flex-col w-full md:w-[48%]">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+977 9812345670"
                className="border border-gray-300 rounded-md p-2 mt-1 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="subject">Subject*</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="How can we help you?"
                className="border border-gray-300 rounded-md p-2 mt-1 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
              />
            </div>
            <div className="w-full">
              <label htmlFor="message">Message*</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Your message..."
                className="border border-gray-300 rounded-md p-2 mt-1 w-full h-32 resize-none outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
              ></textarea>
            </div>
            <button className="px-6 py-2 bg-orange-500 text-white rounded-md flex items-center justify-center gap-2 hover:bg-orange-600 hover:scale-105 transition-colors duration-300">
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </section>
      <section>
        <h1>Map</h1>
        <KtmMap />
      </section>
    </main>
  );
};

export default page;
