import { useCallback, useEffect, useRef } from 'react';
import { getBezierPath } from '@xyflow/react';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
}) => {
  const edgeRef = useRef(null);
  const dotRef = useRef(null);
  const animationRef = useRef(null);
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Continuous animation function
  const animateDot = useCallback(() => {
    if (!edgeRef.current || !dotRef.current) return;
    
    const pathLength = edgeRef.current.getTotalLength();
    const speed = 50; // Lower number = faster animation
    const progress = (performance.now() / speed) % pathLength;
    const point = edgeRef.current.getPointAtLength(progress);
    
    // Update dot position
    dotRef.current.setAttribute('cx', point.x);
    dotRef.current.setAttribute('cy', point.y);
    
    animationRef.current = requestAnimationFrame(animateDot);
  }, []);

  useEffect(() => {
    // Start continuous animation
    animationRef.current = requestAnimationFrame(animateDot);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animateDot]);

  return (
    <>
      <path
        id={id}
        ref={edgeRef}
        className="react-flow__edge-path"
        d={path}
        style={style}
        fill="none"
      />
      <circle
        ref={dotRef}
        r={4}
        fill="#ff0055"
        stroke="#fff"
        strokeWidth={1.5}
      />
    </>
  );
};

export default CustomEdge;
