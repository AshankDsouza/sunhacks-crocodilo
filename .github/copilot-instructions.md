# Copilot Instructions for DEVS Simulator Web Application

## Project Overview
This is a **web-based simulator-documentation tool** built with React and DEVS (Discrete Event System Specification) principles. The project offers four key advantages:

1. **System Design Simulation**: Visualize and simulate designs of various systems/organizations
2. **Multi-granularity Documentation**: Zoom in/out of system designs with integrated documentation and simulation
3. **Persistent Design Storage**: Save system designs to database for sharing and collaboration
4. **Design Testing & Validation**: Test and simulate to evaluate design effectiveness

The application recreates DEVS-Suite functionality from `simulator_context/mental/DEVS-Suite-Mixed_win64_6.0.0 (4)` using React Flow for visual modeling with animated job processing.

## Core Architecture Patterns

### 1. DEVS Simulation Model Translation
- **Original Java DEVS concepts** → **React/JavaScript equivalents**:
  - `ViewableAtomic` components → `GeneratorNode` React components
  - Java simulation phases (`passive`, `active`, `finishing`) → React state management
  - DEVS time advance (`sigma`) → React timing with `setTimeout`/`useEffect`
  - Job queues and entity processing → JavaScript arrays with React state

### 2. React Flow Integration Pattern
The app uses a **centralized state approach** in `App.jsx`:
```jsx
// State flows: App.jsx → GeneratorNode → SimulationGenerator
const nodesWithCallbacks = nodes.map(node => ({
  ...node,
  data: {
    ...node.data,
    onUpdateLabel: handleUpdateLabel,
    onOpenModal: handleOpenModal,
    onStepComplete: handleStepComplete  // Key simulation callback
  }
}));
```

### 3. Simulation Step Execution Pattern
**Critical flow for simulation steps**:
1. `ControlPanel` → `App.handleRun()` → sets `gen1.data.step = true`
2. `GeneratorNode` detects `data.step` change via `useEffect`
3. Job dequeued from `jobQueue`, calls `data.onStepComplete(id, job)`
4. `App.handleStepComplete()` converts edge to animated `CustomEdge`
5. `CustomEdge` animates, then calls `data.onAnimationComplete()`
6. Edge reverts to normal, cycle complete

### 4. Component Communication Patterns
- **Upward data flow**: Components communicate to `App.jsx` via callback props
- **Simulation state**: Managed in individual `GeneratorNode` components with `SimulationGenerator` class instances
- **Visual state**: Centralized in `App.jsx` for React Flow nodes/edges
- **Modal system**: Global `BlankPopup` managed by `App.jsx` state

## Key Files and Their Roles

### Core Simulation Files
- `src/components/Generator.jsx`: **SimulationGenerator class** - JavaScript port of Java DEVS atomic model
- `src/components/GeneratorNode.jsx`: **React wrapper** for SimulationGenerator with visual representation
- `src/components/CustomEdge.jsx`: **Animated edge component** for job flow visualization
- `src/data/flowData.js`: **Initial simulation configuration** (nodes, edges, job queues)

### Documentation & UI Components
- `src/components/InstructionsPanel.jsx`: User guidance and documentation interface
- `src/components/ControlPanel.jsx`: Simulation control interface
- `src/components/BlankPopup.jsx`: Modal system for node editing and documentation

### React Flow Specific Patterns
- **Node types**: Defined in `App.jsx` as `nodeTypes = { generator: GeneratorNode }`
- **Edge types**: `edgeTypes = { custom: CustomEdge }` for animation
- **Dynamic type switching**: Edges change from `'normal'` to `'custom'` during simulation steps

## Development Priorities

### Simulator-Documentation Integration
- **Visual documentation**: Each node should support rich documentation that scales with zoom levels
- **Context-aware help**: Instructions and documentation should adapt to current simulation state
- **Design persistence**: Consider database integration patterns for saving/loading designs

### System Design Patterns
- **Hierarchical modeling**: Support for nested systems and sub-component views
- **Multi-scale visualization**: Zoom in/out functionality with appropriate detail levels
- **Documentation layers**: Separate but integrated documentation and simulation views

## Simulation-Specific Development Guidelines

### Adding New Node Types
1. Create new component in `src/components/`
2. Port relevant DEVS concepts from Java classes in `simulator_context/mental/`
3. Register in `App.jsx` `nodeTypes` object
4. Add to `initialNodes` in `src/data/flowData.js`

### Simulation Timing Patterns
- Use `useEffect` with `data.step` dependency for discrete event triggering
- Implement phase changes with color-coded visual feedback: `getPhaseColor()`
- Reset step flags after brief delays (100ms) to allow next simulation steps

### Animation and Visual Feedback
- **Edge animations**: Only triggered during simulation steps via type switching
- **Node visual states**: Border colors reflect simulation phases (`active`, `passive`, `outputting`)
- **Job queue visualization**: Display current queue state as JSON in node UI

### State Management Best Practices
- **Simulation logic**: Keep in component classes (like `SimulationGenerator`)
- **Visual state**: Manage in `App.jsx` for React Flow compatibility
- **Modal interactions**: Use global modal with `nodeId` for context

## Original DEVS Reference
When extending functionality, reference the Java implementation in `simulator_context/mental/DEVS-Suite-Mixed_win64_6.0.0 (4)/Models/Component/BasicProcessor/LoadBallancer.java` for authentic DEVS patterns and atomic model behaviors.

## Deployment
The project uses Docker for containerization:
```bash
sudo docker build -t nodejs-app .
sudo docker stop nodejs-app || true
sudo docker rm nodejs-app || true
sudo docker run -p 3000:3000 --name nodejs-app nodejs-app
```