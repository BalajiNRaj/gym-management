"use client";

import Image from "next/image";

const technologies = [
  {
    name: "Next.js",
    image: "/next.png",
  },
  {
    name: "React.js", 
    image: "/react.png",
  },
  {
    name: "TypeScript",
    image: "/typescript.png",
  },
  {
    name: "MongoDB",
    image: "/mongo.png",
  },
  {
    name: "Radix UI",
    image: "/radix.png",
  },
  {
    name: "NextAuth",
    image: "/next-auth.png",
  },
];

const StackSection = () => {
  return (
    <section className="bg-gray-100 py-12 text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Our Stack and Technologies</h2>
        
        <div className="flex flex-wrap justify-center gap-4">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="w-36 h-36 flex flex-col justify-center items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 relative mb-2 flex-shrink-0">
                <Image
                  src={tech.image}
                  alt={tech.name}
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded"
                />
              </div>
              <span className="text-sm font-medium text-gray-700">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StackSection;
