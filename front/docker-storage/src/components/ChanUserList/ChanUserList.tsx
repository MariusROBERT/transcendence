import { ChanUser } from "../ChanUser/ChanUser";
import { ReactNode, useEffect, useState } from "react";

export function ChanUserList() {

    let [usrs, setUsers] = useState<any[]>([]);

    useEffect(() => {
      window.addEventListener('enter_users', async (event: any) => {
        //  TODO: add check for owner
        setUsers(event.detail.value);
      }, false);
    })

    function chat() {
        return (
          <>
              {usrs.map((item) => (
              <ChanUser
                key={item.id}
                user_icon={require("../../assets/imgs/logo_42.png")}
                online={true}
              >
                {item.username}
              </ChanUser>
              ))}
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