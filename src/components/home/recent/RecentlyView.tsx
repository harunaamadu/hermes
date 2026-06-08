"use client";

import React, { useEffect, useState } from "react";
import Reveal from "@/components/animation/Reveal";
import { TitleProps } from "../ui/TitleBar";
import ProductLayout from "../ui/HomeProductLayout";
import { Product } from "@/types/product";

const RecentlyView = () => {
  const titleContent: TitleProps = {
    title: "Your recently viewed items",
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(
        products.filter((p) => p.badge === "best-seller").slice(0, 8)
      );
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-full w-full max-w-360 h-full mx-auto px-4 py-12 md:px-6 lg:px-8">
      <Reveal variant="up" once={false}>
        {/* RecentlyView */}
        <ProductLayout
          title={titleContent.title}
          products={products}
          loading={loading}
          skeletonCount={8}
          link={{ href: "/shop/bestsellers", label: "View All" }}
          emptyTitle="No recently view product yet"
          emptyDescription="Recently viewed product(s) appear here."
        />
      </Reveal>
    </div>
  );
};

export default RecentlyView;
