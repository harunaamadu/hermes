"use client";

import React from "react";
import Reveal from "@/components/animation/Reveal";
import TitleBar, { TitleProps } from "../ui/TitleBar";

const RecentlyView = () => {
  const titleContent: TitleProps = {
    title: "Your recently viewed items",
  };
  return (
    <div className="min-h-screen w-full max-w-360 h-full mx-auto px-4 py-12 md:px-6 lg:px-8">
      <Reveal variant="up" once={false}>
        {/* RecentlyView */}
        <TitleBar title={titleContent.title} />
      </Reveal>
    </div>
  );
};

export default RecentlyView;
