import React, { ReactNode, useEffect, useState } from 'react';
import { delay, Viewport, color } from '../../utils';
import { RoundButton } from '..';
import { useUserContext } from '../../contexts';
import { SetCurrChan } from '../../utils/channel_functions';

interface Props {
  children: ReactNode;
  viewport: Viewport;
  width: number;
  isLeftPanel: boolean;
  duration_ms?: number;
  contextIsOpen: boolean;
  setContextIsOpen: (isOpen: boolean) => void | undefined;
}

export function SidePanel({
                            children,
                            viewport,
                            width,
                            isLeftPanel,
                            duration_ms = 1000,
                            contextIsOpen,
                            setContextIsOpen,
                          }: Props) {
  const [isHiding, setIsHiding] = useState<boolean>(false);
  const [isShowing, setIsShowing] = useState<boolean>(false);
  const [isAnim, setIsAnim] = useState<boolean>(false);

  const isMoving = isAnim || isHiding || isShowing;
  const { socket } = useUserContext();

  useEffect(() => {
    if (contextIsOpen)
      Open();
  }, [contextIsOpen]);

  async function Close() {
    if (isMoving) return;
    if (!isLeftPanel) {
      socket?.emit('leave');
      SetCurrChan('');
    }
    setIsAnim(true);
    await delay(duration_ms / 3);
    setIsHiding(true);
    setIsAnim(false);
    await delay(duration_ms);
    setContextIsOpen(false);
    setIsHiding(false);
  }

  async function Open() {
    if (isMoving) return;
    setIsAnim(true);
    await delay(duration_ms);
    setIsShowing(true);
    setIsAnim(false);
    await delay(duration_ms / 4);
    setContextIsOpen(true);
    setIsShowing(false);
  }

  function getStyle(): React.CSSProperties {
    const style: React.CSSProperties = {
      zIndex: 110,
      width: width + 'px',
      height: '100%',
      position: 'absolute',
      left: '0px',
      transition: '0s ease',
    };
    if (isAnim) {
      style.width = width + 50 + 'px';
      style.left = (isLeftPanel ? 0 : viewport.width - width - 50) + 'px';
      style.transition = (contextIsOpen ? duration_ms / 3 : duration_ms) + 'ms ease';
    } else if (isShowing) {
      style.left = (isLeftPanel ? 0 : viewport.width - width) + 'px';
      style.transition = duration_ms / 3 + 'ms ease';
    } else if (isHiding) {
      style.left = (isLeftPanel ? -width : viewport.width) + 'px';
      style.transition = duration_ms + 'ms ease';
    } else if (contextIsOpen) {
      style.left = (isLeftPanel ? 0 : viewport.width - width) + 'px';
    } else {
      style.left = (isLeftPanel ? -width : viewport.width) + 'px';
    }
    return style;
  }

  const buttonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: (isLeftPanel ? (isAnim ? width + 50 : width) : 0) - 30 + 'px',
    rotate:
      ((isLeftPanel && contextIsOpen) || (!isLeftPanel && !contextIsOpen) ? -90 : 90) + 'deg',
    transition: (isAnim ? duration_ms / 3 : duration_ms / 2) + 'ms ease',
  };

  if (!isMoving && !contextIsOpen) {
    return (
      <div
        style={{ color: color.white, position: 'absolute', height: '100%', left: getStyle().left }}
      >
        <div style={buttonStyle}>
          <RoundButton
            icon_size={50}
            icon={require('../../assets/imgs/side_panel_button.png')}
            onClick={contextIsOpen ? Close : Open}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={getStyle()}>
      <div style={buttonStyle}>
        <RoundButton
          icon_size={50}
          icon={require('../../assets/imgs/side_panel_button.png')}
          onClick={contextIsOpen ? Close : Open}
        />
      </div>
      <div style={{ overflow: 'hidden', display: 'flex', height: '100%' }}>
        {children}
      </div>
    </div>
  );
}
