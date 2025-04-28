import { useRef, useEffect, useState, ReactElement } from "react";
import "../index.css";

type CardProps = {
  el: string;
  index: number;
  isNearCentered: boolean;
};

const items = ["Slide 1", "Slide 2", "Slide 3", "Slide 4", "Slide 5"];

export default function SnapScrollCarousel(): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [centeredIndex, setCenteredIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    if (containerRef.current) {
      const card = containerRef.current.children[index] as HTMLElement;
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let closestIndex: number | null = null;
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

    handleScroll(); // Premier appel au montage

    return () => {
      container?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-screen mx-auto">
      <div
        ref={containerRef}
        className="flex items-center gap-10 w-[800px] h-96 overflow-x-scroll scroll-smooth snap-x snap-mandatory hide-scrollbar"
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

      {/* Boutons en bas pour naviguer */}
      <div className="flex justify-center items-center gap-4 mt-4">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className={`px-2 py-1 cursor-pointer rounded-full bg-neutral-400/35 transition-all duration-300 ease-in-out ${
              index === centeredIndex
                ? " text-neutral-500"
                : "h-0.5 text-neutral-500"
            } flex items-center justify-center`}
          >
            <span
              className={`text-sm font-bold text-neutral-500 ${
                index === centeredIndex ? "flex" : "hidden"
              }`}
            >
              {item}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Card({ el, index, isNearCentered }: CardProps): ReactElement {
  const marginLeft = index === 0 ? "ml-[400px]" : "";
  const marginRight = index === items.length - 1 ? "mr-[400px]" : "";

  return (
    <div
      className={`w-sm h-60 flex-none snap-center flex items-center justify-center
        rounded-lg bg-neutral-400/35 text-neutral-400/80 text-2xl font-bold
        transform transform-gpu transition-all duration-700 ease-in-out
        ${marginLeft} ${marginRight}
        ${
          isNearCentered
            ? "scale-110 translate-y-5 rotate-3"
            : "scale-100 translate-y-0 rotate-0"
        }
      `}
    >
      {el}
    </div>
  );
}
