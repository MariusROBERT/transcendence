import { color } from "../../utils/Global";
import { delay } from "../../utils/UtilityFunctions";
import { Viewport } from "../../utils/Viewport";
import { Border, Button, Input, Flex, Background } from "..";
import React, { useEffect, useState } from "react";

const SIZE: number = 350;

interface Props {
  duration_ms?: number;
  viewport: Viewport;
  isConnected: boolean;
  setIsConnected: (state: boolean) => void;
}

export function Login({
  duration_ms = 900,
  viewport,
  isConnected,
  setIsConnected,
}: Props) {
  async function OnConnect() {
    setIsAnim(true);
    await delay(duration_ms / 3);
    setIsConnecting(true);
    setIsAnim(false);
    await delay(duration_ms);
    setIsConnected(true);
    setIsConnecting(false);
  }

  const [signIn, setSign] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAnim, setIsAnim] = useState(false);

  const connectionStyle: React.CSSProperties = {
    height: viewport.isLandscape
      ? Math.max(SIZE, viewport.height) + "px"
      : Math.max(2 * SIZE, viewport.height) + "px",
    width: "100%",
    position: "absolute",
    top: "0px",
  };

  const animStyle: React.CSSProperties = {
    height: viewport.isLandscape
      ? Math.max(SIZE, viewport.height) - 50 + "px"
      : Math.max(2 * SIZE, viewport.height) - 50 + "px",
    width: "100%",
    position: "absolute",
    top: "50px",
    transition: duration_ms / 3 + "ms ease",
  };

  const connectingStyle: React.CSSProperties = {
    height: viewport.isLandscape
      ? Math.max(SIZE, viewport.height) + "px"
      : Math.max(2 * SIZE, viewport.height) + "px",
    width: "100%",
    position: "absolute",
    top: viewport.isLandscape
      ? -Math.max(SIZE, viewport.height) + "px"
      : -Math.max(2 * SIZE, viewport.height) + "px",
    transition: duration_ms + "ms ease",
  };

  const connectedStyle: React.CSSProperties = {
    height: viewport.isLandscape
      ? Math.max(SIZE, viewport.height) + "px"
      : Math.max(2 * SIZE, viewport.height) + "px",
    width: "100%",
    position: "absolute",
    left: "0px",
    top: viewport.isLandscape
      ? -Math.max(SIZE, viewport.height) + "px"
      : -Math.max(2 * SIZE, viewport.height) + "px",
  };

  return (
    <div
      style={
        isConnected
          ? connectedStyle
          : isConnecting
          ? connectingStyle
          : isAnim
          ? animStyle
          : connectionStyle
      }
    >
      <Background
        bg_color={color.clear}
        flex_direction={viewport.isLandscape ? "row" : "column"}
        flex_justifyContent={"space-around"}
      >
        <Border height={SIZE} width={SIZE} borderColor={color.clear}>
          <Background bg_color={color.clear}>
            <h2>Welcome to Pong</h2>
            <p>{signIn ? "Still not registered?" : "You have an Account?"}</p>
            <Button
              onClick={() => {
                console.log(signIn ? "sign up clicked" : "sign in clicked");
                setSign(!signIn);
              }}
            >
              {signIn ? "Sign Up" : "Sign In"}
            </Button>
          </Background>
        </Border>
        <Border height={SIZE} width={SIZE} borderColor={color.clear}>
          <Background
            bg_color={color.clear}
            flex_alignItems={"stretch"}
            padding={"10px"}
          >
            <Input>login..</Input>
            <Input>password..</Input>
            {!signIn && <Input>password confirmation..</Input>}
            <Flex flex_direction={"row"} flex_justifyContent={"flex-end"}>
              <Button
                onClick={() => {
                  if (signIn) {
                    console.log("Connect");
                    // TODO connection validation process
                    OnConnect();
                  } else {
                    console.log("SignUp");
                    // TODO add user in the data base if possible (unique username etc..)
                  }
                }}
              >
                {signIn ? "Connect" : "Sign Up"}
              </Button>
            </Flex>
            <br />
            <Flex flex_direction={"row"} flex_justifyContent={"space-between"}>
              <p>or sign in with Intra42</p>
              <Button
                icon={require("../../assets/imgs/logo_42.png")}
                onClick={() => console.log("intra 42 clicked")}
              ></Button>
            </Flex>
          </Background>
        </Border>
      </Background>
    </div>
  );
}
