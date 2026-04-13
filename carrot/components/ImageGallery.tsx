"use client";

import { useState } from "react";

interface Image {
  url: string;
  sort_order: number;
}

interface Props {
  images: Image[];
  alt: string;
}

export default function ImageGallery({ images, alt }: Props) {
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const [index, setIndex] = useState(0);

  if (sorted.length === 0) {
    return <div className="aspect-square w-full bg-muted" />;
  }

  return (
    <div className="relative">
      <div className="aspect-square w-full bg-muted overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sorted[index].url}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>

      {sorted.length > 1 && (
        <>
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 text-white text-[12px] rounded-full">
            {index + 1} / {sorted.length}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1.5 pb-2">
            {sorted.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full transition-opacity ${
                  i === index ? "bg-white" : "bg-white/40"
                }`}
                aria-label={`이미지 ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
