import { FC } from 'react';

interface Props {
  position: 'left' | 'right';
}

const RewriteRuleDivider: FC<Props> = ({ position }) => {
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
      stroke-width="1.0"
      fill="blue"
      stroke="#D3D3D3"
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
