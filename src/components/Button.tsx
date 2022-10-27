import './Button.css';
import { FC } from 'react';

interface Props {
  id?: string;
  color?: 'default';
  children?: React.ReactNode;
  onClick?: () => void;
}

const Button: FC<Props> = ({ id, children, color = 'default', onClick }) => {
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

    onClick && onClick();
  };

  return (
    <button
      id={id}
      className={`btn btn-${color} rounded px-5 py-3 min-w-max overflow-hidden shadow relative hover:bg-opacity-90 w-full px-4 py-2.5`}
      onClick={handleOnClick}
    >
      {children}
    </button>
  );
};

export default Button;
