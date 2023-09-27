import { subscribe, unsubscribe } from "../../utils/event";
import { ChanUser } from "../ChanUser/ChanUser";
import { ReactNode, useEffect, useState } from "react";

export function ChanUserList() {

    let [usrs, setUsers] = useState<any[]>([]);

    useEffect(() => {
      subscribe('enter_users', async (event: any) => {
        //  TODO: add check for owner
        setUsers(event.detail.value);
      });
      return () => {
        unsubscribe("enter_users", null);
      }
    })

    function chat() {
        return (
          <>
              {usrs.map((item) => (
              <ChanUser
                key={item.id}
                user_icon={item.urlImg}
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