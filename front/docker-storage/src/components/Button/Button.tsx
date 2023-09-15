import "../../App.css";
import { color } from "../../utils/Global";
import { hover } from "@testing-library/user-event/dist/hover";

interface Props {
  children?: string;
  onClick: () => void;
  icon?: any;
}

export function Button({ children, onClick, icon }: Props) {
  const style = {
    backgroundImage: "url(" + icon + ")",
    backgroundSize: "cover",
    backgroundPosition: "center center",
  };
  return (
    <button
      className={"button-30 color-3 cursor_pointer"}
      onClick={onClick}
      style={style}
    >
      <p className={"color-3"}>{children}</p>
    </button>
  );
}
