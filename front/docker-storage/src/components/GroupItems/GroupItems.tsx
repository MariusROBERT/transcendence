import { ReactNode, useEffect, useState } from "react";
import { Border, Background, RoundButton, UserBanner } from "..";
import { color } from "../../utils/Global";
import { IUser, IUserComplete } from "../../utils/interfaces";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface Props{
    children?:ReactNode,
    heading:string,
    duration_ms:number
    meUser: IUserComplete|undefined;
}

export function GroupItems({ children, heading, duration_ms, meUser }: Props)
{
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();
	const jwtToken = Cookies.get('jwtToken');
	const [allUsers, setAllUsers] = useState<IUser[]>()

	const getAllUsers = () => {
		fetch('http://localhost:3001/api/user/get_all_public_profile', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${jwtToken}`,
			},
		}).then((res) => {
			if (!res.ok) {
				navigate('/login');
				alert(`Vous avez ete déconnecté car vous n'êtes pas authorisé`);
				return;
			}
			return res.json();
		}).then((users) => {
			setAllUsers(users);
		})
	}
	useEffect(() => {
		getAllUsers();
	}, [meUser])
    console.log("header: ", heading);
    

    const displayFriends = () => {
        console.log("friends list");
        const friends = allUsers?.filter((user: IUser) => 
            meUser?.friends.includes(user.id))
            .map((friend: IUser) => (
            <div key={friend.id} >
                <UserBanner otherUser={friend} meUser={meUser} /> {/* rentre pas dedans*/}
            </div>
        ));
        console.log("freids : ", friends); // ok
    }

    const displayUsers = () => {
        const users = allUsers?.map((user: IUser) => (
            <div key={user.id} >
                <UserBanner otherUser={user} meUser={meUser} /> {/* rentre pas dedans*/}
            </div>
        ));
        console.log("users: ", users); // ok
    }

    let buttonStyle:React.CSSProperties = {
        rotate:(isOpen ? 0 : 180) + 'deg',
        transition: duration_ms + 'ms ease'
    }

    let groupStyle:React.CSSProperties = {
        paddingTop: isOpen ? '15px' : '0px',
        paddingRight: '5px',
        display: 'flex',
        flexDirection: 'column',
        marginLeft:'50px',
        overflow:'scroll',
        height: isOpen ? '100%' : '0px',
        gap:'30px',
        transition: duration_ms + 'ms ease'
    }

    return (
        <>
            <Border borderSize={0} height={50} borderColor={color.black} borderRadius={0}>
                <Background bg_color={color.grey} flex_direction={"row"} flex_justifyContent={'flex-end'}>
                    <h2 style={{position:'absolute', left:'5px'}}>{heading}</h2>
                    <div style={buttonStyle}><RoundButton icon={require('../../assets/imgs/side_panel_button.png')} icon_size={40} onClick={() => {
                        setIsOpen(!isOpen);
                        displayUsers();
                        if (!isOpen && heading === 'Friends')
                            displayFriends();
                    }}></RoundButton></div>
                </Background>
            </Border>
            <div style={groupStyle}>
                {children}
            </div>
        </>
    );
}
