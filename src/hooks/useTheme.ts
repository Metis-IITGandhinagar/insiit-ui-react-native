import { useContext } from 'react';
import ThemeContext from '../../providers/ThemeProvider';

export default function useTheme() {
  return useContext(ThemeContext as any);
}
