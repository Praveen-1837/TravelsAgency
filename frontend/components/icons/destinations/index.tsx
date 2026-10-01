import React from 'react';
import {
  IconBuildingArch,
  IconTree,
  IconMountain,
  IconSailboat,
  IconTrees,
  IconBeach,
  IconRipple,
  IconLeaf,
  IconBuildingMonument,
  IconBuildingSkyscraper,
  IconBuildingPavilion,
  IconBuildingChurch
} from '@tabler/icons-react';

const SolidFlameIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="url(#flame-grad)" {...props}>
    <defs>
      <linearGradient id="flame-grad" x1="0" y1="100%" x2="0" y2="0%">
        <stop offset="0%" stopColor="#FF5722" />
        <stop offset="100%" stopColor="#FFA726" />
      </linearGradient>
    </defs>
    <path d="M16,2.5 C16,2.5 9,10 9,17 C9,20.866 12.134,24 16,24 C19.866,24 23,20.866 23,17 C23,10 16,2.5 16,2.5 Z" />
  </svg>
);

const makeIcon = (IconCmp: React.ElementType) => {
  return function DestIcon(props: any) {
    return <IconCmp stroke={1.25} {...props} />;
  }
};

export const DestinationIcons: Record<string, React.ElementType> = {
  explore: SolidFlameIcon,
  rajasthan: makeIcon(IconBuildingArch),
  kerala: makeIcon(IconTree),
  ladakh: makeIcon(IconMountain),
  kashmir: makeIcon(IconSailboat),
  himachal: makeIcon(IconTrees),
  goa: makeIcon(IconBuildingChurch),
  andaman: makeIcon(IconBeach),
  northeast: makeIcon(IconLeaf),
  uttarakhand: makeIcon(IconBuildingMonument),
  bali: makeIcon(IconBuildingPavilion),
  dubai: makeIcon(IconBuildingSkyscraper),
  thailand: makeIcon(IconBuildingMonument),
};
