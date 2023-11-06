import { color } from '../../utils';

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
    backgroundColor: color.green,
  };
  return (
    <button
      className={'button-30 cursor_pointer'}
      onClick={onClick}
      style={style}
      type={type}
    >
      <p>{children}</p>
    </button>
  );
}
