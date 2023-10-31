import { useState } from 'react';
import { delay } from '../../utils';
import './RoundButton.css'

interface Props {
  icon: string;
  icon_size?: number;
  transition_duration_ms?: number;
  onClick: () => void;
  isDisabled?: boolean;
  hover?: boolean;
}

export function RoundButton(
  {
    icon,
    icon_size = 35,
    transition_duration_ms = 200,
    onClick,
    isDisabled,
    hover = false,
  }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  function handleMouseEnter() {
    setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
  }

  async function handleMouseClick() {
    setIsClicked(true);
    await delay(transition_duration_ms / 2);
    setIsClicked(false);
  }

  function getIconStyle(): React.CSSProperties {
    const size = isClicked
      ? icon_size * 0.9
      : isHovered
        ? icon_size * 1.2
        : icon_size;

    let opacity: number;

    return {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'url(' + icon + ') center center / cover no-repeat',
      border: 'solid 2px transparent',
      borderRadius: size / 2 + 'px',
      height: size + 'px',
      width: size + 'px',
      transition: transition_duration_ms + 'ms',
    };
  }

  return (
    <div
      style={{
        height: icon_size * 1.2 + 'px',
        width: icon_size * 1.2 + 'px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      className={hover ? 'hover' : ''}
    >
      <button disabled={isDisabled}
              style={getIconStyle()}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                onClick();
                handleMouseClick();
              }}
      />
    </div>
  );
}
