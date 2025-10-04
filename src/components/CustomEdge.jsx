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
  data,
}) => {
  const edgeRef = useRef(null);
  const dotRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  
  // Get the job value from data prop, fallback to "Job" if not provided
  const jobValue = data?.job || "Job";
  
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // One-time animation function
  const animateDot = useCallback(() => {
    if (!edgeRef.current || !dotRef.current) return;
    
    const currentTime = performance.now();
    if (!startTimeRef.current) {
      startTimeRef.current = currentTime;
    }
    
    const pathLength = edgeRef.current.getTotalLength();
    const duration = pathLength * 20; // Adjust speed: higher number = slower
    const elapsed = currentTime - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    
    const point = edgeRef.current.getPointAtLength(progress * pathLength);
    
    // Update dot group position
    if (dotRef.current) {
      dotRef.current.setAttribute('transform', `translate(${point.x}, ${point.y})`);
    }
    
    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animateDot);
    } else {
      // Animation completed, notify parent if callback exists
      if (data?.onAnimationComplete) {
        data.onAnimationComplete(id);
      }
    }
  }, [id, data]);

  useEffect(() => {
    // Reset start time and start animation
    startTimeRef.current = null;
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
      <g ref={dotRef}>
        {/* Background circle for the text */}
        <circle
          r={12}
          fill="#007acc"
          stroke="#fff"
          strokeWidth={2}
        />
        {/* Job value text */}
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="10"
          fontWeight="bold"
          fill="white"
        >
          {jobValue}
        </text>
      </g>
    </>
  );
};

export default CustomEdge;
