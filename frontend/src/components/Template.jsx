import React, { useState } from 'react';
import ImageWithFallback from './ImageWithFallback';

const Template = ({ templateData }) => {
  const [loading, setLoading] = useState(true);

  // Add this inside your ImageWithFallback components
  const imageLoadingStyle = "animate-pulse bg-gray-200 h-full w-full";

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-gray-800 text-white sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold">{templateData.business_name}</div>
            <div className="flex space-x-8">
              <a href="#home" className="hover:text-gray-300">Home</a>
              <a href="#about" className="hover:text-gray-300">About</a>
              <a href="#menu" className="hover:text-gray-300">Menu</a>
              <a href="#contact" className="hover:text-gray-300">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen">
        <div className={`w-full h-full ${loading ? imageLoadingStyle : ''}`}>
          <ImageWithFallback
            src={templateData.hero_section.image}
            alt="Hero"
            className="w-full h-full object-cover"
            onLoad={() => setLoading(false)}
          />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{templateData.hero_section.title}</h1>
            <p className="text-xl">{templateData.hero_section.subtitle}</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <ImageWithFallback
                src={templateData.about_section.image}
                alt="About Us"
                className="rounded-lg shadow-xl w-full h-[400px] object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">About Us</h2>
              <p className="text-gray-600 leading-relaxed">
                {templateData.about_section.content}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Menu</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {templateData.menu_section.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
                <span className="font-bold">${item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
              <div className="space-y-4">
                <p className="flex items-center">
                  <span className="material-icons mr-2">location_on</span>
                  {templateData.contact_section.address}
                </p>
                <p className="flex items-center">
                  <span className="material-icons mr-2">phone</span>
                  {templateData.contact_section.phone}
                </p>
                <p className="flex items-center">
                  <span className="material-icons mr-2">email</span>
                  {templateData.contact_section.email}
                </p>
              </div>
            </div>
            <div className="md:w-1/2">
              <ImageWithFallback
                src={templateData.contact_section.image}
                alt="Contact"
                className="rounded-lg shadow-xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} {templateData.business_name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Template; 