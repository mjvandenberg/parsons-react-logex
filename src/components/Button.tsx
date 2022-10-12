import './Button.css';
import { FC } from 'react';

interface Props {
  color?: 'blue' | 'red';
  children?: React.ReactNode;
  onClick?: () => void;
}

const Button: FC<Props> = ({ children, color = 'blue' }) => {
  const handleOnClick = (event: React.MouseEvent<HTMLElement>) => {
    const btn = event.currentTarget;

    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - (btn.offsetLeft + radius)}px`;
    circle.style.top = `${event.clientY - (btn.offsetTop + radius)}px`;
    circle.classList.add('ripple');

    const ripple = btn.getElementsByClassName('ripple')[0];

    if (ripple) {
      ripple.remove();
    }

    btn.appendChild(circle);
  };

  return (
    <button
      className={`btn btn-${color} rounded px-5 py-3 min-w-max overflow-hidden shadow relative hover:bg-opacity-90 w-full`}
      onClick={handleOnClick}
    >
      {children}
    </button>
  );
};

export default Button;
