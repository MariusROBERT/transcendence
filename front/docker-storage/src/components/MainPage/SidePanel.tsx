import React, { ReactNode, useEffect, useState } from 'react';
import { delay, Viewport, color } from '../../utils';
import { RoundButton } from '..';
import { useUserContext } from '../../contexts';
import { SetCurrChan } from '../../utils/channel_functions';
import { subscribe, unsubscribe } from '../../utils/event';

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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isHiding, setIsHiding] = useState<boolean>(false);
  const [isShowing, setIsShowing] = useState<boolean>(false);
  const [isAnim, setIsAnim] = useState<boolean>(false);

  const isMoving = isAnim || isHiding || isShowing;
  const { socket } = useUserContext();

  useEffect(() => {
    if (contextIsOpen)
      Open();
  }, [contextIsOpen]);

  useEffect(() => {
    subscribe('open_chat', () => {
      if (!isLeftPanel) Open();
    });
    return () => {
      unsubscribe('open_chat', () => null);
    };
  }, [isLeftPanel]);

  useEffect(() => {
    subscribe('close_chat', () => {
      if (!isLeftPanel) Close();
    });
    return () => {
      unsubscribe('close_chat', () => {
        console.log('unsubscribe close_chat');
      });
    };
  }, [isLeftPanel]);

  async function Close() {
    if (isMoving) return;
    setContextIsOpen(false);
    if (!isLeftPanel) {
      socket?.emit('leave');
      SetCurrChan('');
    }
    setIsAnim(true);
    await delay(duration_ms / 3);
    setIsHiding(true);
    setIsAnim(false);
    await delay(duration_ms);
    setIsOpen(false);
    setIsHiding(false);
  }

  async function Open() {
    setContextIsOpen(true);
    if (isMoving) return;
    setIsAnim(true);
    await delay(duration_ms);
    setIsShowing(true);
    setIsAnim(false);
    await delay(duration_ms / 4);
    setIsOpen(true);
    setIsShowing(false);
  }

  function getStyle(): React.CSSProperties {
    const style: React.CSSProperties = {
      boxShadow:'rgba(0, 180, 255, 0.4) 0px 60px 70px, rgba(0, 0, 255, 0.2) 0px -15px 40px, rgba(255, 255, 255, 0.2) 0px 6px 12px, rgba(255, 255, 255, 0.27) 0px 15px 20px, rgba(255, 255, 255, 0.15) 0px -5px 8px',
      zIndex: 10,
      width: width + 'px',
      height: '100%',
      position: 'absolute',
      left: '0px',
      transition: '0s ease',
    };
    if (isAnim) {
      style.width = width + 50 + 'px';
      style.left = (isLeftPanel ? 0 : viewport.width - width - 50) + 'px';
      style.transition = (isOpen ? duration_ms / 3 : duration_ms) + 'ms ease';
    } else if (isShowing) {
      style.left = (isLeftPanel ? 0 : viewport.width - width) + 'px';
      style.transition = duration_ms / 3 + 'ms ease';
    } else if (isHiding) {
      style.left = (isLeftPanel ? -width : viewport.width) + 'px';
      style.transition = duration_ms + 'ms ease';
    } else if (isOpen) {
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
      ((isLeftPanel && isOpen) || (!isLeftPanel && !isOpen) ? -90 : 90) + 'deg',
    transition: (isAnim ? duration_ms / 3 : duration_ms / 2) + 'ms ease',
  };

  if (!isMoving && !contextIsOpen && isLeftPanel) {
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
  if (!isMoving && !contextIsOpen)
    return (<></>)
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
