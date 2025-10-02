export const initialNodes = [
  { 
    id: 'gen1', 
    type: 'generator',
    position: { x: 50, y: 100 }, 
    data: { label: 'Generator 1' } 
  },
  { 
    id: 'gen2', 
    type: 'generator',
    position: { x: 300, y: 100 }, 
    data: { label: 'Generator 2' } 
  },
];

export const initialEdges = [{ 
  id: 'gen1-gen2', 
  source: 'gen1', 
  target: 'gen2', 
  type: 'custom',
  style: { stroke: '#555', strokeWidth: 2 }
}];
