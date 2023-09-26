import { IUser } from "./interfaces";
import { Fetch } from './SecureFetch';

export function openChat() {
    // console.log('open chat with ' + user_name);
}

export function sendGameInvite() {
    // console.log('invite ' + user_name + ' to play a game');
}

export function lookGame() {
    // console.log('try to look game with ' + user_name);
}


export const sendFriendInvite = (id: number | undefined, jwtToken: string | undefined) => {
    fetch(`http://localhost:3001/api/user/demand/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
        },
    })
        .then((response) => {
            if (response.ok) {
              return true;
            } else if (response.status === 404) {
                throw new Error(`Le user d'id ${id} n'existe pas.`);
            } else if (response.status === 409) {
                throw new Error(`Vous avez déjà demandé le user ${id}.`);
            }
        })
        .catch((error) => {
            console.log('Erreur 500:', error);
        });
    return false;
    // console.log('send friend invite to ' + user_name);
};

export function openOptionDropdown() {
    console.log('open option dropdown');
}

export function openProfile(){
    // console.log('open profile from ' + user_name);
}

export function acceptInvite(otherUser: IUser) {
  Fetch(`user/handle_ask/${otherUser.id}/${1}`, 'PATCH');
}

export function declineInvite(otherUser: IUser) {
  Fetch(`user/handle_ask/${otherUser.id}/${0}`, 'PATCH');
}

export const handleOpenProfil = (setSelectedUser:any, setProfilVisible:any, user: IUser) => {
    // open profil card
    setSelectedUser(user);
    setProfilVisible(true);
  };