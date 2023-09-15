import '../../app/App.css';

interface Props {
  children?: string;
}

export function Input({ children }: Props) {
  //TODO: password hiding
  //TODO: accept only alphanum etc.. (for login)
  return (
    <input placeholder={children} className={'text cursor_pointer'}></input>
  );
}
