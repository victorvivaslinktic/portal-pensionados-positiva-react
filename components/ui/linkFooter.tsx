import Link from "next/link";
import React from "react";

interface LinkFooterProps {
  description: string;
  linkText: string;
  href: string;
  addBreak?: boolean;
  smText?: boolean;
}

const LinkFooter: React.FC<LinkFooterProps> = ({
  description,
  linkText,
  href,
  addBreak = true,
  smText = true,
}) => {
  return (
    <p
      className={`font-roboto font-normal ${smText ? "md:text-[12px]" : "md:text-[10px]"} text-[10px]`}
    >
      {description}
      {addBreak && <br />}{" "}
      <Link href={href} className="font-semibold text-[var(--primary-positiva)] underline">
        {linkText}
      </Link>
    </p>
  );
};

export default LinkFooter;
