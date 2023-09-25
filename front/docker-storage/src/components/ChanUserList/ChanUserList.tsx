/*
    This Pannel list all user of current chat
*/

import { ChanUser } from "../ChanUser/ChanUser";

export function ChanUserList() {
    function chat() {
        return (
          <>
              <ChanUser
                user_icon={require("../../assets/imgs/logo_42.png")}
                online={true}
              >
                ChanUser
              </ChanUser>
              <ChanUser
                user_icon={require("../../assets/imgs/logo_42.png")}
                online={true}
              >
                ChanUser
              </ChanUser>
          </>
        );
    }

    return (
        <div style={{
                    display:'inline-flex',
                    }}>
            {chat()}
        </div>
    )
}