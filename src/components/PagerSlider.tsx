import { ReactElement, useRef, useEffect, useState } from "react";
import "../index.css";

type cardProps = {
  el: string;
  index: number;
  isNearCentered: boolean;
};

export default function SnapScrollCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [centeredIndex, setCenteredIndex] = useState<number | null>(null);
  const items = ["Slide 1", "Slide 2", "Slide 3", "Slide 4", "Slide 5"];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      // Trouver la carte la plus proche du centre
      let closestIndex = null;
      let smallestDistance = Infinity;

      container.childNodes.forEach((child, index) => {
        if (child instanceof HTMLElement) {
          const rect = child.getBoundingClientRect();
          const childCenter = rect.left + rect.width / 2;
          const distance = Math.abs(containerCenter - childCenter);

          if (distance < smallestDistance) {
            smallestDistance = distance;
            closestIndex = index;
          }
        }
      });

      setCenteredIndex(closestIndex);
    };

    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    // Appel initial
    handleScroll();

    return () => {
      container?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const Card = ({ el, index, isNearCentered }: cardProps): ReactElement => {
    return (
      <div
        className={`animation-scale ${index === 0 ? "ml-[400px]" : ""} ${
          index === items.length - 1 ? "mr-[400px]" : ""
        } ${
          isNearCentered
            ? "w-[400px] h-80 transform scale-110"
            : "w-sm h-60 transform scale-100"
        } ml-sm snap-center flex-none bg-blue-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold`}
      >
        {el}
      </div>
    );
  };

  return (
    <div className="mx-auto w-screen flex justify-center">
      <div
        ref={containerRef}
        className="snap-x snap-mandatory flex items-center w-[800px] overflow-x-scroll scroll-smooth gap-10 hide-scrollbar h-80"
      >
        {items.map((item, index) => (
          <Card
            key={index}
            el={item}
            index={index}
            isNearCentered={index === centeredIndex}
          />
        ))}
      </div>
    </div>
  );
}
