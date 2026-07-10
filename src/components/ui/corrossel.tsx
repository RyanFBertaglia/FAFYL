import React, { useRef, useState, useEffect, useCallback } from 'react';
import { getAllCollegesData } from '@/services/dataLoader';
import { resolveImageUrl } from '@/utils/imageResolver';

function useScreenDimensions() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);
  return width;
}

interface CollegeItem {
  id: string;
  name: string;
  description: string;
  color: string;
  image: string;
}

const FEATURED_IDS = [1, 19, 20, 74, 86];

const COLLEGE_COLORS: Record<number, string> = {
  1: '#010080',
  19: '#010080',
  20: '#010080',
  74: '#010080',
  86: '#010080',
};



const CARD_MARGIN = 6;

function Card({ item, index, scrollLeft, cardWidth, containerWidth, onViewCollege }: { item: CollegeItem; index: number; scrollLeft: number; cardWidth: number; containerWidth: number; onViewCollege?: (id: string) => void }) {
  const center = index * (cardWidth + CARD_MARGIN * 2) + cardWidth / 2;
  const viewCenter = scrollLeft + containerWidth / 2;
  const distance = Math.abs(viewCenter - center);
  const scale = Math.max(0.8, 1 - (distance / containerWidth) * 0.2);
  const opacity = Math.max(0.4, 1 - (distance / containerWidth) * 0.6);
  const resolvedImage = resolveImageUrl(item.image);

  return (
    <div
      style={{
        width: cardWidth,
        margin: '0 6px',
        flexShrink: 0,
        transform: `scale(${scale})`,
        opacity,
        transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
      }}
    >
      <div
        style={{
          borderRadius: 25,
          overflow: 'hidden',
          background: resolvedImage ? item.color : `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
        }}
      >
        {resolvedImage ? (
          <img
            src={resolvedImage}
            alt={item.name}
            style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 32, fontWeight: 'bold', color: '#FFD700', opacity: 0.6 }}>
              {item.name.charAt(0)}
            </span>
          </div>
        )}
        <div style={{ padding: 16, textAlign: 'center' as const }}>
          <p style={{ fontSize: 20, fontWeight: 'bold', color: '#FFD700', margin: 0 }}>{item.name}</p>
          <p style={{ fontSize: 13, color: '#fff', textAlign: 'center', margin: '8px 0' }}>{item.description}</p>
          <button
            onClick={() => onViewCollege?.(item.id)}
            style={{
              backgroundColor: '#FFD700',
              borderRadius: 20,
              padding: '0 20px',
              height: 36,
              border: 'none',
              fontWeight: 'bold',
              color: '#000',
              cursor: 'pointer',
            }}
          >
            Ver mais
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Corrossel({ onViewCollege }: { onViewCollege?: (id: string) => void }) {
  const screenWidth = useScreenDimensions();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const pauseRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [items, setItems] = useState<CollegeItem[]>([]);

  useEffect(() => {
    const allColleges = getAllCollegesData();
    const featured = FEATURED_IDS.map((id) => {
      const col = allColleges.find((c) => c.id === id);
      if (!col) return null;
      return {
        id: String(col.id),
        name: col.name,
        description: col.description.length > 50 ? col.description.slice(0, 50) + '…' : col.description,
        color: COLLEGE_COLORS[id] || '#010080',
        image: col.image || '',
      };
    }).filter(Boolean) as CollegeItem[];
    setItems(featured);
  }, []);

  const REPEAT_COUNT = 10;
  const DATA = items.length > 0 ? Array(REPEAT_COUNT).fill(items).flat() : [];
  const cardWidth = screenWidth * 0.7;
  const itemWidth = cardWidth + CARD_MARGIN * 2;
  const middleIndex = Math.floor(DATA.length / 2);
  const middleOffset = middleIndex * itemWidth;
  const oneLoopWidth = items.length * itemWidth;

  useEffect(() => {
    if (scrollRef.current && DATA.length > 0) {
      scrollRef.current.scrollLeft = middleOffset;
      setScrollLeft(middleOffset);
    }
  }, [items, DATA.length, middleOffset]);

  useEffect(() => {
    if (isInteracting || items.length === 0) return;
    const step = 0.8 * (screenWidth / 390);
    const id = setInterval(() => {
      if (scrollRef.current) {
        const next = scrollRef.current.scrollLeft + step;
        scrollRef.current.scrollLeft = next;
        if (next >= middleOffset + oneLoopWidth) {
          scrollRef.current.scrollLeft = middleOffset;
        }
      }
    }, 20);
    return () => clearInterval(id);
  }, [isInteracting, screenWidth, middleOffset, oneLoopWidth, items.length]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  }, []);

  const handleInteractionStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();
    if (pauseRef.current) clearTimeout(pauseRef.current);
    setIsInteracting(true);
  };

  const handleInteractionEnd = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();
    pauseRef.current = setTimeout(() => setIsInteracting(false), 3000);
  };

  if (items.length === 0) return null;

  return (
    <div style={{ width: '100%', height: cardWidth * 0.85 + 40, position: 'relative' }}>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseDown={handleInteractionStart}
        onMouseUp={handleInteractionEnd}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        style={{
          display: 'flex',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>
        {DATA.map((item, index) => (
          <div key={index}>
            <Card
              item={item}
              index={index}
              scrollLeft={scrollLeft}
              cardWidth={cardWidth}
              containerWidth={screenWidth}
              onViewCollege={onViewCollege}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
