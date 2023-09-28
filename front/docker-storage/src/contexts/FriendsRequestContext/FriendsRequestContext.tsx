import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useUserContext } from "../UserContext/UserContext";
import { Fetch } from "../../utils";

type FriendsRequestType = {
    invitesBy: number[] | undefined,
    invitesTo: number[] | undefined,
    friends: number[] | undefined,

    sendFriendRequest: (to: number) => void,
    acceptFriendRequest: (from: number) => void,
    declineFriendRequest: (from: number) => void,

    fetchFriendsRequestContext: () => void,
}

const FriendsRequestContext = createContext<FriendsRequestType>({
    invitesBy: undefined,
    invitesTo: undefined,
    friends: undefined,

    sendFriendRequest: (to: number) => { },
    acceptFriendRequest: (from: number) => { },
    declineFriendRequest: (from: number) => { },

    fetchFriendsRequestContext: () => { },
})

export function useFriendsRequestContext() {
    return useContext(FriendsRequestContext);
}

interface Props {
    children: ReactNode;
}

export function FriendsRequestProvider({ children }: Props) {
    const { socket, id } = useUserContext();
    const [invitesBy, setInvitesBy] = useState<number[]>();
    const [invitesTo, setInvitesTo] = useState<number[]>();
    const [friends, setFriends] = useState<number[]>();

    async function fetchFriendsRequestContext(): Promise<void> {
        let user = (await Fetch('user/', 'GET'))?.json;
        if (!user) return;
        setFriends(user?.friends);
        setInvitesBy(user?.invites);
        setInvitesTo(user?.invited);
    }

    // Invites -- Event emission -----------------------------------------------------------
    function sendFriendRequest(to: number) {
        // 
    }

    function acceptFriendRequest(from: number) {

    }

    function declineFriendRequest(from: number) {

    }

    // Invites -- Event reception ------------------------------------------------
    function onSendFriendRequest() {

    }

    function onAcceptFriendRequest() {

    }

    function onDeclineFriendRequest() {

    }

    useEffect(() => {
        socket?.on('send_friend_request', onSendFriendRequest);
        socket?.on('accept_friend_request', onAcceptFriendRequest);
        socket?.on('decline_friend_request', onDeclineFriendRequest);

        return () => {
            socket?.off('send_friend_request', onSendFriendRequest);
            socket?.off('accept_friend_request', onAcceptFriendRequest);
            socket?.off('decline_friend_request', onDeclineFriendRequest);
        };
    }, [socket]);

    return (
        <>
            <FriendsRequestContext.Provider value={
                {
                    invitesBy,
                    invitesTo,
                    friends,
                    sendFriendRequest,
                    acceptFriendRequest,
                    declineFriendRequest,
                    fetchFriendsRequestContext
                }
            }>
                {children}
            </FriendsRequestContext.Provider>
        </>
    )
}
