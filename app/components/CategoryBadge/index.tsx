import React from 'react';
import { Badge } from '@chakra-ui/react';
import { CategoryColorSchemes } from './constants';

export interface CategoryBadgeProps {
  category: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const colorScheme =
    CategoryColorSchemes[category] || CategoryColorSchemes.default;

  return (
    <Badge
      padding="2"
      borderRadius="10"
      variant="solid"
      colorScheme={colorScheme}
    >
      {category}
    </Badge>
  );
};
