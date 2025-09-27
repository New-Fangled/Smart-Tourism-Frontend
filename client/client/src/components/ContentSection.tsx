import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ContentSectionProps {
  title: string;
  description: string;
  imageSrc?: string;
  reverse?: boolean;
}

export function ContentSection({
  title,
  description,
  imageSrc,
  reverse = false,
}: ContentSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      className={`flex min-h-screen items-center px-8 py-20 ${
        reverse ? "bg-gray-100" : "bg-white"
      }`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-7xl">
        <div
          className={`grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 ${
            reverse ? "lg:grid-flow-row-dense" : ""
          }`}
        >
          <motion.div
            className={`flex flex-col justify-center ${
              reverse ? "lg:col-start-2" : ""
            }`}
            initial={{ x: reverse ? 50 : -50, opacity: 0 }}
            animate={
              isInView
                ? { x: 0, opacity: 1 }
                : { x: reverse ? 50 : -50, opacity: 0 }
            }
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="mb-6 text-4xl lg:text-5xl">{title}</h2>
            <p className="text-lg leading-relaxed text-gray-600">
              {description}
            </p>
            <div className="mt-8 space-y-4">
              <div className="h-20 rounded-lg bg-gray-200 p-4">
                <p className="text-sm text-gray-500">
                  Interactive Content Space
                </p>
                <p className="mt-2">
                  Add your custom content, forms, or interactive elements here.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={`${reverse ? "lg:col-start-1" : ""}`}
            initial={{ x: reverse ? -50 : 50, opacity: 0 }}
            animate={
              isInView
                ? { x: 0, opacity: 1 }
                : { x: reverse ? -50 : 50, opacity: 0 }
            }
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {imageSrc ? (
              <div className="aspect-square overflow-hidden rounded-2xl bg-gray-300">
                <img
                  src={imageSrc}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-8">
                <div className="flex h-full items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                  <div className="text-center text-white">
                    <h3 className="text-2xl mb-4">{title}</h3>
                    <p className="text-sm opacity-80">Content Space</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
