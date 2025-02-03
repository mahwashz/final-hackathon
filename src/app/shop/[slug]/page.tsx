/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Linkedin,
  Twitter,
  Heart,
  Minus,
  Plus,
  Star,
} from "lucide-react";
import { useCart } from "@/components/cart-context";
import { useWishlist } from "@/components/wishlist-context";
import { toast } from "react-toastify";
import { urlFor } from "@/sanity/lib/image";
import { fetchSingleProductWithReviews } from "@/sanity/lib/fetchData";
import { useParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import RelatedProduct from "../../../components/RelatedProduct"

interface Product {
  _id: string;
  title: string;
  slug: string;
  price: number;
  description: string;
  image: string;
  discountPercentage: number;
  reviews: Review[];
  category: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  image: string;
  quantity: number;
}

interface Review {
  _id: string;
  text: string;
  userName: string;
  createdAt: string;
}

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { dispatch: cartDispatch } = useCart();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [newReview, setNewReview] = useState("");
  const [userName, setUserName] = useState("");
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (!params.slug) return;

    async function fetchProduct() {
      try {
        const productData = await fetchSingleProductWithReviews(params.slug);
        setProduct(productData);
        setIsInWishlist(
          wishlistState.items.some((item) => item.id === productData._id)
        );
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details.");
      }
    }

    fetchProduct();
  }, [params.slug, wishlistState.items]);

  const updateQuantity = (value: number) => {
    if (value < 1) return;
    setQuantity(value);
  };

  const addToCart = () => {
    if (!product) return;

    const discountedPrice =
      product.discountPercentage > 0
        ? (product.price * (100 - product.discountPercentage)) / 100
        : product.price;

    const cartItem: CartItem = {
      id: product._id,
      name: product.title,
      price: discountedPrice,
      originalPrice: product.price,
      discountPercentage: product.discountPercentage,
      image: product.image,
      quantity,
    };

    cartDispatch({ type: "ADD_TO_CART", payload: cartItem });
    toast.success("Product added to cart!");
  };

  const toggleWishlist = () => {
    if (!product) return;

    if (isInWishlist) {
      wishlistDispatch({ type: "REMOVE_FROM_WISHLIST", payload: product._id });
      toast.info("Removed from wishlist");
    } else {
      wishlistDispatch({
        type: "ADD_TO_WISHLIST",
        payload: {
          id: product._id,
          name: product.title,
          price: product.price,
          image: product.image,
        },
      });
      toast.dark("Added to wishlist");
    }
    setIsInWishlist(!isInWishlist);
  };

  const handleAddReview = async () => {
    if (!product || newReview.trim() === "" || userName.trim() === "") return;

    const newReviewItem = {
      _type: "review",
      productId: product._id,
      text: newReview,
      userName,
      createdAt: new Date().toISOString(),
    };

    try {
      const createdReview = await client.create(newReviewItem);
      setProduct({
        ...product,
        reviews: [createdReview, ...product.reviews],
      });
      setNewReview("");
      setUserName("");
      toast.success("Review added successfully!");
    } catch (error) {
      console.error("Error adding review: ", error);
      toast.error("Failed to add review. Please try again.");
    }
  };

  const handleEditReview = (id: string) => {
    const reviewToEdit = product?.reviews.find((review) => review._id === id);
    if (reviewToEdit) {
      setEditingReview(id);
      setEditText(reviewToEdit.text);
    }
  };

  const handleSaveEditedReview = async (id: string) => {
    if (!product) return;

    const updatedReview = product.reviews.find((review) => review._id === id);
    if (updatedReview) {
      const updatedReviewItem = { ...updatedReview, text: editText };
      try {
        await client.patch(updatedReview._id).set(updatedReviewItem).commit();
        setProduct({
          ...product,
          reviews: product.reviews.map((review) =>
            review._id === id ? { ...review, text: editText } : review
          ),
        });
        setEditingReview(null);
        toast.success("Review updated successfully!");
      } catch (error) {
        console.error("Error updating review: ", error);
        toast.error("Failed to update review. Please try again.");
      }
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!product) return;

    try {
      await client.delete(id);
      setProduct({
        ...product,
        reviews: product.reviews.filter((review) => review._id !== id),
      });
      toast.info("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review: ", error);
      toast.error("Failed to delete review. Please try again.");
    }
  };

  if (!product) {
    return <div>Loading product details...</div>;
  }

  const images = [
    urlFor(product.image).url(),
    urlFor(product.image).url(),
    urlFor(product.image).url(),
    urlFor(product.image).url(),
  ];

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
                className={`border-2 ${index === selectedImage ? "border-[#B88E2F]" : "border-transparent"} hover:border-[#B88E2F] transition-colors duration-200`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`Product view ${index + 1}`}
                  width={500}
                  height={500}
                  className="object-cover w-[70px] bg-[#FFF9E5] h-[70px] md:w-[100px] md:h-[100px]"
                />
              </button>
            ))}
          </div>
          {/* Main Image */}
          <div className="flex-1 h-auto bg-[#FFF9E5] mb-28 order-1 md:order-2">
            <Image
              src={images[selectedImage] || "/placeholder.svg"}
              alt="Product main view"
              width={600}
              height={600}
              className="w-full h-auto object-cover" // Removed mt-40 to reduce top space
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-4xl text-[#3A3A3A]">{product.title}</h1>
          <div className="flex items-center gap-4">
            {product.discountPercentage > 0 ? (
              <>
                <div className="text-2xl text-red-500">
                  ${" "}
                  {(
                    (product.price * (100 - product.discountPercentage)) /
                    100
                  ).toLocaleString()}
                </div>
                <div className="text-xl text-gray-500 line-through">
                  $ {product.price.toLocaleString()}
                </div>
                <div className="text-sm bg-red-500 text-white px-2 py-1 rounded-full">
                  {product.discountPercentage}% OFF
                </div>
              </>
            ) : (
              <div className="text-2xl text-[#3A3A3A]">
                $ {product.price.toLocaleString()}
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-[#3A3A3A] text-sm">
              {product.reviews.length} Customer Review
              {product.reviews.length !== 1 ? "s" : ""}
            </span>
          </div>

          <p className="text-[#3A3A3A] text-base">{product.description}</p>
          {/* Quantity and Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-[#D9D9D9] rounded-md w-32">
              {" "}
              {/* Set a specific width for the quantity container */}
              <button
                className="w-10 h-14 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                onClick={() => updateQuantity(quantity - 1)}
              >
                <Minus className="w-4 h-4 text-[#3A3A3A]" />
              </button>
              <span className="px-2 text-[#3A3A3A]">{quantity}</span>
              <button
                className="w-10 h-10 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                onClick={() => updateQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4 text-[#3A3A3A]" />
              </button>
            </div>
            <Button
              className="h-14 bg-black hover:bg-b text-white flex items-center justify-center w-36" // Set the same width as the quantity container
              onClick={addToCart}
            >
              Add To Cart
            </Button>
          </div>

          {/* Product Meta */}
          <div className="space-y-4 pt-6 border-t border-[#D9D9D9]">
            <div className="flex gap-2">
              <span className="text-[#3A3A3A]">SKU</span>
              <span className="text-[#9F9F9F]">
                : {product._id.padStart(6, "0")}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-[#3A3A3A]">Category</span>
              <span className="text-[#9F9F9F]">: {product.category}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[#3A3A3A]">Tags</span>
              <span className="text-[#9F9F9F]">: Sofa chair Bed</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <span className="text-[#3A3A3A]">Share</span>
                <div className="flex gap-2">
                  <button className="flex items-center justify-center w-10 h-10 bg-black text-white rounded-full shadow-lg hover:bg-amber-500 hover:shadow-xl transition duration-200 transform hover:scale-105">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 bg-black text-white rounded-full shadow-lg hover:bg-amber-500 hover:shadow-xl transition duration-200 transform hover:scale-105">
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 bg-black text-white rounded-full shadow-lg hover:bg-amber-500 hover:shadow-xl transition duration-200 transform hover:scale-105">
                    <Twitter className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <button
                className="hover:text-[#B88E2F] transition-colors duration-200"
                onClick={toggleWishlist}
              >
                <Heart
                  className="w-5 h-5"
                  fill={isInWishlist ? "#B88E2F" : "none"}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs and Reviews */}
      <div className="mt-16">
        <div className="flex gap-8 border-b justify-center border-gray-200 mb-8">
          {["description", "additional", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-lg font-medium transition-colors relative ${
                activeTab === tab
                  ? "text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "reviews" && ` (${product.reviews.length})`}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {activeTab === "description" && (
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          )}

          {activeTab === "additional" && (
            <div className="text-gray-600 leading-relaxed">
              <h3 className="text-lg font-semibold mb-2">
                Product Specifications
              </h3>
              <div className="mb-4">
                <strong>Material:</strong> High-quality, durable fabric.
              </div>
              <div className="mb-4">
                <strong>Dimensions:</strong> 12 x 8 x 4 inches.
              </div>
              <div className="mb-4">
                <strong>Weight:</strong> 1.5 lbs.
              </div>
              <div className="mb-4">
                <strong>Color Options:</strong> Available in black, blue, and
                red.
              </div>
              <div className="mb-4">
                <strong>Warranty:</strong> 1-year manufacturer warranty.
              </div>
              <div className="mb-4">
                <strong>Care Instructions:</strong> Hand wash only, do not
                bleach.
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="text-gray-600">
              <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

              {/* Add New Review */}
              <div className="space-y-4 mb-6 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">Share Your Experience</h3>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Write your review here..."
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <button
                  onClick={handleAddReview}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-amber-500 transition-colors"
                >
                  Submit Review
                </button>
              </div>

              {/* Display Reviews */}
              <div className="space-y-4">
                {product.reviews.length === 0 ? (
                  <p className="text-center py-8 bg-white rounded-lg shadow-md">
                    No reviews yet. Be the first to share your thoughts!
                  </p>
                ) : (
                  product.reviews.map((review) => (
                    <div
                      key={review._id}
                      className="bg-white p-6 rounded-lg shadow-md"
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {review.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold">{review.userName}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {editingReview === review._id ? (
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-black"
                        />
                      ) : (
                        <p className="text-gray-700">{review.text}</p>
                      )}
                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          onClick={() => handleEditReview(review._id)}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                        {editingReview === review._id && (
                          <button
                            onClick={() => handleSaveEditedReview(review._id)}
                            className="px-3 py-1 bg-black text-white rounded-md hover:bg-yellow-500 transition-colors"
                          >
                            Save
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <RelatedProduct />
      </div>
    </div>
  );
}
