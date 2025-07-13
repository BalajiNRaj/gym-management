"use client";

import Image from "next/image";
import { CheckCircledIcon } from "@radix-ui/react-icons";

interface PageDetailsProps {
  title: string;
  description: string;
  featuredImage: string;
  list_of_features: string[];
  accessRole: string[];
  flexReverse?: boolean;
}

const PageDetails = ({
  title,
  description,
  featuredImage,
  list_of_features,
  accessRole,
  flexReverse
}: PageDetailsProps) => {
  return (
    <div
      className={`
        min-h-screen md:min-h-[80vh] lg:min-h-[600px] 
        flex flex-col ${flexReverse ? 'md:flex-row-reverse' : 'md:flex-row'}
        bg-gray-50 transition-all duration-300 cursor-pointer
        hover:shadow-lg p-4
      `}
    >
      {/* Image Section */}
      <div className="flex items-center justify-center flex-1 rounded-md p-2 sm:p-0">
        <div className="relative w-full h-full max-w-lg max-h-96">
          <Image 
            src={featuredImage} 
            alt={title}
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
            className="rounded border shadow-sm"
            priority
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 flex flex-col justify-start">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">{title}</h1>
        <p className="text-gray-700 mb-6">{description}</p>

        <hr className="my-4" />

        <div className="mb-4">
          <h6 className="text-lg font-semibold mb-2">
            Access Role: {" "}
            {accessRole.map((role, index) => (
              <span key={index} className="text-sm font-normal text-gray-600 mr-2">
                {role}
              </span>
            ))}
          </h6>
        </div>

        <hr className="my-4" />

        <ul className="space-y-3">
          {list_of_features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircledIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PageDetails;
