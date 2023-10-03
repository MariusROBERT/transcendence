import { useState } from 'react';
import { color, delay } from '../../utils';

interface Props {
  icon: string;
  icon_size?: number;
  transition_duration_ms?: number;
  onClick: () => void;
  isDisabled?: boolean;
}

export function RoundButton(
  {
    icon,
    icon_size = 35,
    transition_duration_ms = 200,
    onClick,
    isDisabled
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
    const borderColor = isClicked
      ? color.white
      : isHovered
      ? color.beige
      : color.grey;

    let opacity:number;
    isDisabled ? opacity=0.2 : opacity=1;


    return {
      opacity: opacity,
      backgroundImage: 'url(' + icon + ')',
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
      border: 'solid 2px' + borderColor,
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

// async function handleMouseClick() {
//   setIsClicked(true);
//   await delay(transition_duration_ms / 2);
//   setIsClicked(false);
// };

// function getIconStyle() : React.CSSProperties{
//   const size = isClicked ? icon_size * 0.9 : isHovered ? icon_size * 1.2 : icon_size
//   const borderColor = isClicked ? color.white : isHovered ? color.beige : color.grey

//   return (
//   {
//       backgroundImage: 'url(' + icon + ')',
//       backgroundPosition: 'center center',
//       backgroundSize: 'cover',
//       border: 'solid 2px' + borderColor,
//       borderRadius: size / 2 + 'px',
//       height: size + 'px',
//       width: size + 'px',
//       transition: transition_duration_ms + 'ms'
//   }
//   )
// }

// return (
//   <div style={{height:icon_size * 1.2 + 'px', width:icon_size * 1.2 + 'px', display:'flex', justifyContent:'center', alignItems:'center'}}>
//       <button
//           style={getIconStyle()}
//           // disable
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//           onClick={() => {
//               onClick();
//               handleMouseClick();
//           }}>
//       </button>
//   </div>
// );
// }
