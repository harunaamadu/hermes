"use client";

import Reveal from "@/components/animation/Reveal";
import Link from "next/link";

export type TitleProps = {
  title: string;
  description?: string;
  href?: string;
  className?: string;
};

const TitleBar = ({ title, description, href, className }: TitleProps) => {
  return (
    <div>
      <div className={`flex items-center justify-between ${className}`}>
        <div>
          <h3 className="font-semibold font-heading text-xl md:text-3xl first-letter:capitalize">
            {title}
          </h3>
          <p className="">{description}</p>
        </div>

        {href && (
          <Link
            href={href}
            className="font-light text-xl md:text-3xl first-letter:capitalize"
          >
            See All
          </Link>
        )}
      </div>
    </div>
  );
};

export default TitleBar;
