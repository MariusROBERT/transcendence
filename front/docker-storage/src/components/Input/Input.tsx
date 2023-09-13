import "../../app/App.css";
import { color } from "../../Global";
import { ReactNode } from "react";

interface Props {
  children?: string;
}

export function Input({ children }: Props) {
  //TODO: password hiding
  //TODO: accept only alphanum etc.. (for login)
  return (
    <input placeholder={children} className={"text cursor_pointer"}></input>
  );
}
