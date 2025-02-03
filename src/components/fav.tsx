import Image from "next/image";

import {
  Facebook,
  Linkedin,
  Twitter,
  Heart,
  Minus,
  Plus,
  Star,
} from "lucide-react";
import mainsofy from "/public/mainsofy.png";
export default function ProductPage() {
  const images = [
    "/wishlistone.png",
    "/mainsofy.png",
    "/wishlisttow.png",
    "/wishlistthree.png",
  ];

  const sizes = ["L", "XL", "XS"];
  const colors = ["purple", "black", "gold"];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 order-2 md:order-1">
            {images.map((img, index) => (
              <button
                key={index}
                className={`border-2 ${index === 0 ? "border-[#B88E2F]" : "border-transparent"} hover:border-[#B88E2F] transition-colors duration-200`}
              >
                <Image
                  src={mainsofy}
                  alt={`Product view ${index + 1}`}
                  width={100}
                  height={100}
                  className="object-cover w-[70px] h-[70px] md:w-[100px] md:h-[100px]"
                />
              </button>
            ))}
          </div>
          {/* Main Image */}
          <div className="flex-1 bg-[#FFF9E5] mb-28 order-1 md:order-2">
            <Image
              src={images[1]}
              alt="Product main view"
              width={600}
              height={600}
              className="w-full h-auto object-cover mt-40"
            />
          </div>
        </div>

        
          {/* Product Meta */}
          <div className="space-y-4 pt-6 border-t border-[#D9D9D9]">
            <div className="flex gap-2">
              <span className="text-[#3A3A3A]">SKU</span>
              <span className="text-[#9F9F9F]">: SS001</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[#3A3A3A]">Category</span>
              <span className="text-[#9F9F9F]">: Sofas</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[#3A3A3A]">Tags</span>
              <span className="text-[#9F9F9F]">: Sofa, Chair, Home, Shop</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <span className="text-[#3A3A3A]">Share</span>
                <div className="flex gap-2">
                  <button className="hover:text-[#B88E2F] transition-colors duration-200">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button className="hover:text-[#B88E2F] transition-colors duration-200">
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button className="hover:text-[#B88E2F] transition-colors duration-200">
                    <Twitter className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
}
