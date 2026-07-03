import { useEffect, useState } from 'react';

export default function useNetwork() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setOnline(true);
  }, []);
  return { online };
}
