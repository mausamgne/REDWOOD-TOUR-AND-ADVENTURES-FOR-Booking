// import { useEffect, useState } from "react";
import Heading from "../common/Heading";
 
export default function IntroSection({ homepage }) {

 
  if (!homepage) return null;
 
  // Extract paragraphs from banner_content
  const parser = new DOMParser();
  const doc = parser.parseFromString(homepage.banner_content, "text/html");
  const paragraphs = doc.querySelectorAll("p");
 
  const mainText = paragraphs[0]?.textContent || "";
  const subText = paragraphs[1]?.textContent || "";
 
  return (
    <section className="bg-gray-100 py-16 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Big Heading */}
        <Heading
          as="h2"
          align="center"
          color="text-[#3f6f1d]"
          shadow={false}
          className="text-lg md:text-xl lg:text-2xl"
        >
          {mainText}
        </Heading>
 
        {/* Sub Line */}
        <Heading
          as="h2"
          align="center"
          color="text-[#3f6f1d]"
          className="mt-10 text-xl md:text-2xl"
        >
          {subText}
        </Heading>
      </div>
    </section>
  );
}