import { API_URL } from '../config';
import perfume1 from '../assets/perfume_1.png';
import perfume2 from '../assets/perfume_2.png';
import perfume3 from '../assets/perfume_3.png';
import perfume4 from '../assets/perfume_4.png';
import perfume5 from '../assets/perfume_5.png';
import perfume6 from '../assets/perfume_6.png';

export const imageMap = {
  'perfume_1.png': perfume1,
  'perfume_2.png': perfume2,
  'perfume_3.png': perfume3,
  'perfume_4.png': perfume4,
  'perfume_5.png': perfume5,
  'perfume_6.png': perfume6
};

export const resolveImageUrl = (imagePath) => {
  if (!imagePath) return perfume1;
  if (imagePath.startsWith('/uploads/')) {
    return `${API_URL}${imagePath}`;
  }
  return imageMap[imagePath] || perfume1;
};
