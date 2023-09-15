import { color } from "../../utils/Global";
import { Viewport } from "../../utils/Viewport";
import {
  SidePanel,
  Background,
  ContactPanel,
  ChatPanel,
  SearchBar,
  RoundButton,
} from "..";

interface Props {
  panelWidth: number;
  viewport: Viewport;
}

export function MainPage({ panelWidth, viewport }: Props) {
  return (
    <>
      <Background
        bg_color={color.clear}
        flex_direction={"row"}
        flex_justifyContent={"space-between"}
        flex_alignItems={"stretch"}
      >
        <SidePanel
          viewport={viewport}
          width={panelWidth}
          isLeftPanel={true}
          duration_ms={900}
        >
          <Background flex_justifyContent={"flex-start"}>
            <ContactPanel viewport={viewport}></ContactPanel>
          </Background>
        </SidePanel>
        <Background bg_color={color.clear} flex_justifyContent={"space-around"}>
          <SearchBar>Leader Board..</SearchBar>
          <RoundButton
            icon_size={200}
            icon={require("../../assets/imgs/icon_play.png")}
            onClick={() => {
              console.log("match making");
            }}
          ></RoundButton>
          <div style={{ height: "60px" }} />
        </Background>
        <SidePanel
          viewport={viewport}
          width={panelWidth}
          isLeftPanel={false}
          duration_ms={900}
        >
          <Background>
            <ChatPanel viewport={viewport} width={panelWidth}></ChatPanel>
          </Background>
        </SidePanel>
      </Background>
    </>
  );
}
