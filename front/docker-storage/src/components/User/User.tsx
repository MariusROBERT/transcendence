import { color } from "../../utils";
import { RoundButton, Flex } from "..";

// TODO : Add Object User insteed of user_name and user icon
interface Props {
  icon_url?: string;
  user_name?: string;
  is_friend?: boolean;
}

export function User({
  icon_url = require("../../assets/imgs/icon_user.png"),
  user_name = "Jean Michel",
  is_friend = false,
}: Props) {
  function openProfile() {
    console.log("open profile from " + user_name);
  }

  function openChat() {
    console.log("open chat with " + user_name);
  }

  function sendGameInvite() {
    console.log("invite " + user_name + " to play a game");
  }

  function lookGame() {
    console.log("try to look game with " + user_name);
  }

  function sendFriendInvite() {
    console.log("send friend invite to " + user_name);
  }

  function openOptionDropdown() {
    console.log("open option dropdown");
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: "12.5px",
        backgroundColor: color.grey,
        minWidth: "410px",
        height: "25px",
      }}
    >
      <Flex zIndex={"10"} flex_direction="row">
        <RoundButton
          icon={icon_url}
          icon_size={50}
          onClick={openProfile}
        ></RoundButton>
        <p>{user_name}</p>
      </Flex>
      <Flex
        zIndex={"10"}
        flex_direction="row"
        flex_justifyContent={"space-evenly"}
      >
        {is_friend && (
          <RoundButton
            icon={require("../../assets/imgs/icon_chat.png")}
            onClick={openChat}
          ></RoundButton>
        )}
        {is_friend && (
          <RoundButton
            icon={require("../../assets/imgs/icon_play.png")}
            onClick={sendGameInvite}
          ></RoundButton>
        )}
        {is_friend && (
          <RoundButton
            icon={require("../../assets/imgs/icon_look_game.png")}
            onClick={lookGame}
          ></RoundButton>
        )}
        {!is_friend && (
          <RoundButton
            icon={require("../../assets/imgs/icon_add_friend.png")}
            onClick={sendFriendInvite}
          ></RoundButton>
        )}
        <RoundButton
          icon={require("../../assets/imgs/icon_options.png")}
          onClick={openOptionDropdown}
        ></RoundButton>
      </Flex>
    </div>
  );
}
