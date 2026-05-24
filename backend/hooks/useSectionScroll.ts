import { useRef, useState } from 'react';

import type { ScrollView } from 'react-native';



import type { SectionKey } from '../types/store';



const DEFAULT_OFFSETS: Record<SectionKey, number> = {

  inicio: 0,

  categorias: 280,

  productos: 560,

  como: 980,

  contacto: 1260,

};



export function useSectionScroll() {

  const scrollRef = useRef<ScrollView>(null);

  const [sectionOffsets, setSectionOffsets] = useState<Record<SectionKey, number>>(DEFAULT_OFFSETS);



  const saveOffset = (key: SectionKey, y: number) => {

    setSectionOffsets((prev) => ({ ...prev, [key]: y }));

  };



  const scrollToSection = (key: SectionKey) => {

    scrollRef.current?.scrollTo({ y: Math.max(0, sectionOffsets[key] - 72), animated: true });

  };



  return { scrollRef, saveOffset, scrollToSection };

}

