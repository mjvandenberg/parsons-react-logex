import { FC } from 'react';
import { ParsonsStatus } from '../types';

interface Props {
  position: 'left' | 'right';
  status: ParsonsStatus;
}

const RewriteRuleDivider: FC<Props> = ({ position, status }) => {
  const stroke =
    status === 'red' ? '#ff0000' : status === 'green' ? '#008000' : '#d3d3d3';
  return (
    <svg
      width="32"
      height="32"
      style={{
        position: 'absolute',
        [position]: '10px',
        display: 'block',
        zIndex: '15',
        transform: position === 'right' ? `scale(-1, 1.1)` : 'scale(1.1)',
      }}
      strokeWidth="0.7"
      fill="blue"
      stroke={stroke}
    >
      <circle cx="15" cy="12.2" fill="#ffffaa" r="11" />
      <rect
        y="1.5"
        x="0"
        width="16"
        height="21.5"
        style={{
          fill: '#ffffaa',
          strokeWidth: 0,
          stroke: '#000',
        }}
      />
    </svg>
  );
};

export default RewriteRuleDivider;
