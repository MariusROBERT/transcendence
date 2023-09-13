import { Border } from "../Border/Border";
import { backgroundImage, color } from "../../Global";
import Background from "../Background/Background";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Flex } from "../Flex/FlexBox";
import React, { useEffect, useState } from "react";
import { Viewport } from "../../app/Viewport";
import { delay } from "../../UtilityFunctions";

const SIZE: number = 350;

interface Props {
  viewport: Viewport;
  isConnected: boolean;
  setIsConnected: (state: boolean) => void;
}

export function Login({ viewport, isConnected, setIsConnected }: Props) {
  async function OnConnect() {
    setIsAnim(true);
    await delay(500);
    setIsConnecting(true);
    setIsAnim(false);
    await delay(2001);
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
    transition: "0.5s ease",
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
    transition: "2s ease",
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
                icon={require("../../imgs/logo_42.png")}
                onClick={() => console.log("intra 42 clicked")}
              ></Button>
            </Flex>
          </Background>
        </Border>
      </Background>
    </div>
  );
}
