"use client";

import React from "react";

const Page = () => {
  const aboutDescription = [
    {
      description:
        "StyleHub is your ultimate destination for trendy, high-quality, and affordable fashion. We believe that style is a way to express yourself and boost your confidence every day. Whether you're dressing for work, a casual outing, or a special occasion, StyleHub has something to match your mood and personality.",
    },
    {
      description:
        "Our mission is to bring the latest fashion trends to Nepal, offering a wide range of clothing, accessories, and lifestyle products that suit every taste and occasion. We work with talented designers and trusted suppliers to ensure every piece meets our high standards of quality, comfort, and style.",
    },
    {
      description:
        "We carefully curate our collections to ensure that every item is stylish, versatile, and durable. From casual wear to statement pieces, from timeless classics to bold trends, we want our customers to feel confident, comfortable, and fashionable no matter where they go.",
    },
    {
      description:
        "At StyleHub, customer satisfaction is our top priority. We are committed to providing a seamless shopping experience with easy navigation, secure checkout, fast delivery, and responsive customer support. Our goal is to make shopping fun, simple, and inspiring for every fashion enthusiast.",
    },
  ];

  const aboutData = [
    { title: "Business Founded", description: "2025" },
    { title: "People On The Team", description: "10+" },
    { title: "Products Available", description: "500+" },
    { title: "Countries Shipped To", description: "5" },
  ];

  const ourValues = [
    {
      title: "Customer First",
      icons: "👤",
      description:
        "At StyleHub, our customers are at the heart of everything we do. We ensure a seamless shopping experience, responsive support, and products that delight.",
    },
    {
      title: "Premium Quality",
      icons: "🏆",
      description:
        "We carefully select every product to guarantee style, comfort, and durability. Our collections meet high standards to keep you looking your best.",
    },
    {
      title: "Eco-Friendly Fashion",
      icons: "🌿",
      description:
        "StyleHub is committed to sustainable practices. We source responsibly and aim to reduce environmental impact without compromising on style.",
    },
    {
      title: "Innovation & Creativity",
      icons: "💡",
      description:
        "We continuously explore new designs, trends, and ideas to offer fresh, inspiring fashion that empowers you to express yourself confidently.",
    },
    {
      title: "Affordable Style",
      icons: "💰",
      description:
        "Fashion shouldn’t break the bank. We provide trendy, high-quality products at prices that everyone can enjoy.",
    },
    {
      title: "Diversity & Inclusion",
      icons: "🌈",
      description:
        "We celebrate individuality and diversity. Our collections are designed to fit different tastes, sizes, and styles for everyone.",
    },
    {
      title: "Fast & Reliable Delivery",
      icons: "🚚",
      description:
        "We make sure your favorite styles reach you quickly and safely, so you can enjoy your shopping experience without delays.",
    },
    {
      title: "Community Engagement",
      icons: "🤝",
      description:
        "We value our community and seek to create meaningful connections through collaborations, events, and social initiatives.",
    },
  ];

  const ourTeam = [
    {
      name: "Suman Sunuwar",
      img: "/images/suman.png",
      role: "Founder & CEO",
      address: "Kathmandu, Bagmati",
    },
    {
      name: "Nishant Chaudhary",
      img: "/images/nishant.jpg",
      role: "Creative Director",
      address: "Dang, Lumbini",
    },
  ];

  const reviews = [
    {
      name: "Anish Shrestha",
      img: "/images/anish.png",
      address: "Kathmandu, Bagmati",
      review:
        "I love shopping at StyleHub! The latest trends are always available, and the delivery is fast. My wardrobe has never looked better!",
    },
    {
      name: "Anuj Bhattarai",
      img: "/images/anuj.png",
      address: "Chitwan, Bagmati",
      review:
        "StyleHub makes fashion simple and fun. The quality of the clothes is excellent, and I always get compliments when I wear them!",
    },
    {
      name: "Pasang Lama",
      img: "/images/pasang.png",
      address: "Kavre, Bagmati",
      review:
        "Shopping at StyleHub is always a great experience. They have everything I need — trendy styles, good prices, and excellent customer service.",
    },
    {
      name: "Sita Gurung",
      img: "/images/gita.png",
      address: "Pokhara, Gandaki",
      review:
        "StyleHub has become my go-to place for fashion. The products are stylish, affordable, and the shopping experience is seamless.",
    },
    {
      name: "Rita Thapa",
      img: "/images/rita.png",
      address: "Lalitpur, Bagmati",
      review:
        "I highly recommend StyleHub! The clothing fits perfectly, the styles are trendy, and the customer support team is very helpful.",
    },
  ];

  return (
    <main className="max-w-[1400px] mx-auto flex flex-col items-center px-4">
      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center py-32 text-center">
        <h1 className="text-gray-800 text-5xl md:text-6xl font-bold mb-6">
          Your{" "}
          <span className="bg-linear-to-r from-black/90 via-orange-400 to-orange-500 bg-clip-text text-transparent">
            Style
          </span>
          , Your{" "}
          <span className="bg-linear-to-r from-black/90 via-orange-400 to-orange-500 bg-clip-text text-transparent">
            {" "}
            Story
          </span>
        </h1>
        <p className="text-gray-700 text-lg mb-2">
          StyleHub is your one-stop shop for trendy and affordable fashion.
        </p>
        <p className="text-gray-700 text-lg">
          Explore, shop, and express yourself with confidence.
        </p>
      </section>

      <section className="flex flex-wrap justify-between w-full gap-5">
        {aboutDescription.map((item, index) => (
          <div
            key={index}
            className="w-full md:w-[48%] text-gray-900 text-justify"
          >
            <p>{item.description}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-wrap justify-between w-full gap-5 py-10 md:py-20">
        {aboutData.map((item, i) => (
          <div
            key={i}
            className="pl-5 border-l-2 border-gray-700 w-full md:w-[23%]"
          >
            <h2 className="text-3xl font-semibold">{item.description}</h2>
            <h1 className="text-lg text-gray-600 ">{item.title}</h1>
          </div>
        ))}
      </section>
      <section className="w-full">
        <img
          src="/images/bg3.png"
          alt="About StyleHub"
          className="w-full h-100 rounded-xl object-cover"
        />
      </section>

      <section className="flex flex-wrap justify-start w-full gap-5 py-10 md:py-20">
        <h2 className="text-3xl font-semibold w-full">Our Values</h2>
        {ourValues.map((item, i) => (
          <div key={i} className="w-full md:w-[32%] text-justify flex gap-2">
            <h1 className="">{item.icons} </h1>
            <p>
              <span className="font-bold">{item.title}</span>:{" "}
              {item.description}
            </p>
          </div>
        ))}
      </section>
      <section className="flex flex-wrap justify-center w-full gap-5">
        <h2 className="text-3xl font-semibold w-full">Our Team</h2>
        <p className="w-full">
          We are a dynamic group of individuals who are passionate about fashion
          and <br></br>committed to delivering exceptional customer experiences.
        </p>
        {ourTeam.map((item, i) => (
          <div key={i} className="flex items-center justify-center py-5">
            <div className="rounded ">
              <img
                src={item.img}
                alt={item.name}
                className="h-90 w-80 rounded-xl hover:scale-95 transition-transform duration-300 object-cover py-2"
              />

              <h3 className="text-lg font-semibold py-1">{item.name}</h3>
              <h3 className="text-lg text-gray-800 font-medium py-1">
                {item.address}
              </h3>
              <p className="text-gray-600">{item.role}</p>
            </div>
          </div>
        ))}
      </section>
      <section className="flex flex-wrap justify-center w-full gap-5 py-10 md:py-20">
        <h2 className="text-3xl font-semibold w-full">
          Loved by Our Community
        </h2>
        <p className="w-full">
          Our customers inspire us every day! Here’s what they have to say about
          their StyleHub experience<br></br> - from trendy finds to seamless
          shopping, we value every story.
        </p>
        {reviews.map((item, i) => (
          <div key={i} className="w-[32%] p-5 mt-5 bg-[#ffff] rounded-xl">
            <div className="flex  items-center justify-start">
              <img
                src={item.img}
                alt={item.name}
                className="w-15 h-15 rounded-full border-2 border-purple-400 mr-3 object-cover hover:scale-95 transition-transform duration-300"
              />
              <h2 className="text-xl font-semibold">{item.name}</h2>
            </div>
            <p className="text-gray-600 pt-3 text-justify">{item.review}</p>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Page;
