import { useEffect, useState } from 'react';
import '../../Assets/app.css';

const AnimatedNumber = ({ target, duration = 1000 }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return <>{value}</>;
};
 export default AnimatedNumber