interface Props {
  children?: string;
  onClick: () => void;
  icon?: any;
  type?: 'button' | 'submit' | 'reset' | undefined;
}

export function Button({ children, onClick, icon, type = 'button' }: Props) {
  const style = {
    backgroundImage: 'url(' + icon + ')',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
  };
  return (
    <button
      className={'button-30 color-3 cursor_pointer'}
      onClick={onClick}
      style={style}
      type={type}
    >
      <p className={'color-3'}>{children}</p>
    </button>
  );
}
