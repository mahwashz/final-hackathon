import GalleryImages from "@/components/GalleryImages";
import Hero from "@/components/Hero";
import ProductShowcase from "@/components/main";
import Blog from "@/components/Blog";
import Instra from "@/Context/Instra";
import Product from "@/components/Product";
export default function Home() {
  return (
   <>
   <Hero/>
   <GalleryImages/>
   <ProductShowcase />
   <Product/>
   <Blog />
   <Instra/>

   </>
  );
}
