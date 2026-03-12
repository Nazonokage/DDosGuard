import React from 'react';
import '../styles/terminal.css';

const Terminal = ({ logs }) => {
  return (
    <div className="terminal">
      <pre className="terminal-content">
        {logs.map((log, index) => (
          <div key={index} className="terminal-line">
            {log}
          </div>
        ))}
      </pre>
    </div>
  );
};

export default Terminal;