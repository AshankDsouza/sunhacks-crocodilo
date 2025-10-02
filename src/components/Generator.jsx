import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Generator Component - React implementation of the Java genr class
 * A simulation component that can generate entities/jobs at specified intervals
 * with different operational phases (passive, active, finishing)
 */
class SimulationGenerator {
  constructor(name = 'generator', intervalTime = 10) {
    this.name = name;
    this.intervalTime = intervalTime;
    this.count = 0;
    this.phase = 'passive';
    this.sigma = Infinity; // Time until next internal event
    this.lastEventTime = 0;
    this.isRunning = false;
    this.callbacks = {
      onOutput: null,
      onPhaseChange: null,
      onStateChange: null
    };
  }

  // Initialize the generator
  initialize() {
    this.phase = 'passive';
    this.sigma = Infinity;
    this.count = 0;
    this.lastEventTime = 0;
    this.isRunning = false;
    this.notifyStateChange();
  }

  // Start the generator (equivalent to receiving 'start' message)
  start() {
    if (this.phase === 'passive') {
      this.holdIn('active', this.intervalTime);
      this.isRunning = true;
      this.lastEventTime = Date.now();
    }
  }

  // Stop the generator (equivalent to receiving 'stop' message)
  stop() {
    if (this.phase === 'active') {
      this.phase = 'finishing';
      this.sigma = 0;
      this.notifyPhaseChange();
    }
  }

  // Set phase and time to next event
  holdIn(newPhase, time) {
    this.phase = newPhase;
    this.sigma = time;
    this.notifyPhaseChange();
  }

  // Set to passive state
  passivate() {
    this.phase = 'passive';
    this.sigma = Infinity;
    this.isRunning = false;
    this.notifyPhaseChange();
  }

  // Internal transition (equivalent to deltint)
  processInternalEvent() {
    if (this.phase === 'active') {
      this.count += 1;
      
      // Generate output
      const output = this.generateOutput();
      if (this.callbacks.onOutput) {
        this.callbacks.onOutput(output);
      }

      // Continue in active phase with same interval
      this.holdIn('active', this.intervalTime);
    } else {
      this.passivate();
    }
  }

  // Generate output (equivalent to out() method)
  generateOutput() {
    return {
      type: 'job',
      id: `job${this.count}`,
      timestamp: Date.now(),
      source: this.name
    };
  }

  // Check if currently in a specific phase
  isInPhase(phaseName) {
    return this.phase === phaseName;
  }

  // Get current state information
  getState() {
    return {
      name: this.name,
      phase: this.phase,
      count: this.count,
      intervalTime: this.intervalTime,
      isRunning: this.isRunning,
      sigma: this.sigma
    };
  }

  // Set callback functions
  setCallback(type, callback) {
    this.callbacks[type] = callback;
  }

  // Notify about phase changes
  notifyPhaseChange() {
    if (this.callbacks.onPhaseChange) {
      this.callbacks.onPhaseChange(this.phase);
    }
    this.notifyStateChange();
  }

  // Notify about state changes
  notifyStateChange() {
    if (this.callbacks.onStateChange) {
      this.callbacks.onStateChange(this.getState());
    }
  }

  // Update interval time
  setIntervalTime(newTime) {
    this.intervalTime = newTime;
    this.notifyStateChange();
  }
}

/**
 * React Component wrapper for the SimulationGenerator
 */
const Generator = ({ 
  name = 'generator', 
  intervalTime = 1000, 
  onOutput,
  onPhaseChange,
  onStateChange 
}) => {
  const [generator] = useState(() => new SimulationGenerator(name, intervalTime));
  const [state, setState] = useState(generator.getState());
  const [outputs, setOutputs] = useState([]);
  const intervalRef = useRef(null);

  // Setup callbacks
  useEffect(() => {
    generator.setCallback('onOutput', (output) => {
      setOutputs(prev => [...prev.slice(-9), output]); // Keep last 10 outputs
      onOutput?.(output);
    });

    generator.setCallback('onPhaseChange', (phase) => {
      onPhaseChange?.(phase);
    });

    generator.setCallback('onStateChange', (newState) => {
      setState(newState);
      onStateChange?.(newState);
    });

    generator.initialize();
  }, [generator, onOutput, onPhaseChange, onStateChange]);

  // Handle interval processing
  useEffect(() => {
    if (state.isRunning && state.phase === 'active') {
      intervalRef.current = setInterval(() => {
        generator.processInternalEvent();
      }, state.intervalTime);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [generator, state.isRunning, state.phase, state.intervalTime]);

  // Control functions
  const handleStart = useCallback(() => {
    generator.start();
  }, [generator]);

  const handleStop = useCallback(() => {
    generator.stop();
  }, [generator]);

  const handleReset = useCallback(() => {
    setOutputs([]);
    generator.initialize();
  }, [generator]);

  const handleIntervalChange = useCallback((newInterval) => {
    generator.setIntervalTime(newInterval);
  }, [generator]);

  return (
    <div className="generator-component" style={{ 
      border: '2px solid #ff8800', 
      borderRadius: '8px', 
      padding: '16px', 
      margin: '8px',
      backgroundColor: '#fff3e0',
      fontFamily: 'monospace'
    }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#e65100' }}>
        {state.name} - Generator
      </h3>
      
      <div style={{ marginBottom: '12px' }}>
        <strong>Phase:</strong> 
        <span style={{ 
          marginLeft: '8px', 
          padding: '4px 8px', 
          borderRadius: '4px',
          backgroundColor: state.phase === 'active' ? '#4caf50' : 
                          state.phase === 'passive' ? '#9e9e9e' : '#ff9800',
          color: 'white',
          fontSize: '12px'
        }}>
          {state.phase.toUpperCase()}
        </span>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <strong>Count:</strong> {state.count} | 
        <strong> Interval:</strong> {state.intervalTime}ms
      </div>

      <div style={{ marginBottom: '12px' }}>
        <button 
          onClick={handleStart} 
          disabled={state.phase === 'active'}
          style={{ 
            marginRight: '8px', 
            padding: '6px 12px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: state.phase === 'active' ? 'not-allowed' : 'pointer',
            opacity: state.phase === 'active' ? 0.6 : 1
          }}
        >
          Start
        </button>
        
        <button 
          onClick={handleStop}
          disabled={state.phase !== 'active'}
          style={{ 
            marginRight: '8px', 
            padding: '6px 12px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: state.phase !== 'active' ? 'not-allowed' : 'pointer',
            opacity: state.phase !== 'active' ? 0.6 : 1
          }}
        >
          Stop
        </button>
        
        <button 
          onClick={handleReset}
          style={{ 
            padding: '6px 12px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label>
          <strong>Interval (ms): </strong>
          <input 
            type="number" 
            value={state.intervalTime}
            onChange={(e) => handleIntervalChange(Number(e.target.value))}
            min="100"
            max="10000"
            step="100"
            style={{ 
              marginLeft: '8px', 
              padding: '4px',
              width: '80px'
            }}
          />
        </label>
      </div>

      <div>
        <strong>Recent Outputs:</strong>
        <div style={{ 
          maxHeight: '120px', 
          overflowY: 'auto', 
          marginTop: '8px',
          padding: '8px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {outputs.length === 0 ? (
            <div style={{ color: '#666' }}>No outputs yet...</div>
          ) : (
            outputs.map((output, index) => (
              <div key={index} style={{ marginBottom: '4px' }}>
                {output.id} - {new Date(output.timestamp).toLocaleTimeString()}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Generator;
export { SimulationGenerator };
