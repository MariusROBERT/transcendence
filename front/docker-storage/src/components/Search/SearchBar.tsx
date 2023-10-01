import { color } from '../../utils';

interface Props {
  setSearchTerm: (value: string) => void,
  onClick?: () => void,
  children: string,
  isVisible: boolean
  id?: string
}

export function SearchBar({ setSearchTerm, onClick, children, isVisible, id }: Props) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div style={{
      visibility: isVisible ? 'visible' : 'hidden',
      margin: '30px',
      borderRadius: '10px',
      backgroundColor: color.white,
      height: '60px',
      width: '400px',
    }} className={'text cursor_pointer'}>
      <img style={{ height: '80px', width: '80px', position: 'relative', top: '-10px', left: '-15px' }}
           src={require('../../assets/imgs/icon_search.png')} alt={'search'} />
      <input
        id={id}
        style={{
          outline: 'none',
          borderRadius: '10px',
          border: '0',
          position: 'relative',
          left: '0px',
          top: '-45px',
          height: '55px',
          width: '315px',
          backgroundColor: color.white,
        }}
        placeholder={children}
        onChange={handleInputChange}
        onClick={onClick || undefined}
      />
    </div>
  );
}
