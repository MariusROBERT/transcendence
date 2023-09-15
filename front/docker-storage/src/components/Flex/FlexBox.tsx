import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  zIndex?: string;
  flex_direction?: "row" | "row-reverse" | "column" | "column-reverse";
  flex_wrap?: "nowrap" | "wrap" | "wrap-reverse";
  flex_justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  flex_alignItems?:
    | "stretch"
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  flex_gap?: string;
}

export function Flex({
  children,
  zIndex = "0",
  flex_direction = "column",
  flex_wrap = "nowrap",
  flex_justifyContent = "center",
  flex_alignItems = "center",
  flex_gap = "5px 5px",
}: Props) {
  const style = {
    display: "flex",
    flexDirection: flex_direction,
    flexWrap: flex_wrap,
    justifyContent: flex_justifyContent,
    alignItems: flex_alignItems,
    gap: flex_gap,
    zIndex: zIndex,
  };
  return <div style={style}>{children}</div>;
}
