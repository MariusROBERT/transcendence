import Cookies from 'js-cookie';
import React, { useState } from 'react'

interface UserButtonsProps {
    id: number | undefined;
}

const UserButtons: React.FC<UserButtonsProps> = ({ id }) => {
    const jwtToken = Cookies.get('jwtToken');
    const [sendButton, setSendButton] = useState(false);
    
    const askFriend = async () => {
        try {
            const response = await fetch(
                `http://localhost:3001/api/user/demand/${id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwtToken}`,
                    }
                }
            )
            if (response.ok) {
                setSendButton(true);
            } else {

            }
        } catch (e) {
            // throw 
        }
    }

    return (
        <div>
            <button onClick={askFriend}>
                {sendButton ? "Sent !" : "Ask friend"}</button>
            <button>Play with</button>
            <button>Message</button>
        </div>
    )
}

export default UserButtons;