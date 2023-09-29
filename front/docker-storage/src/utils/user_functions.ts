export function openChat() {

  // console.log('open chat with ' + user_name);
}

export function sendGameInvite() {
  // console.log('invite ' + user_name + ' to play a game');
}

export function lookGame() {
  // console.log('try to look game with ' + user_name);
}

// export const handleRequestsFriend = async (bool: boolean, meUser: IUserComplete | undefined, otherUser: IUser | undefined, setUser: Function | undefined) => {
// 	if (!meUser || !otherUser)
// 		return
// 	// if otherUser isn't include in meUser.blocked => if he is: go fuck yourself, if not: go on
// 	if (meUser && meUser.blocked?.includes(otherUser.id as number))
// 		return;
// 	await Fetch(`user/handle_ask/${otherUser.id}/${bool}`, 'PATCH');
// 	if (bool == true) {
// 		let friendscopy = [...meUser.friends, otherUser.id];
// 		setUser && setUser({ ...meUser, friends: friendscopy });
// 	}
// 	let invitescpy = meUser.invites.filter((id: number) => id !== otherUser.id);
// 	setUser && setUser({ ...meUser, invites: invitescpy });
// }

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
      } else if (response.status === 404) {
        throw new Error(`Le user d'id ${id} n'existe pas.`);
      } else if (response.status === 409) {
        throw new Error(`Vous avez déjà demandé le user ${id}.`);
      }
    })
    .catch((error) => {
      console.log('Erreur 500:', error);
    });
};

export const handleOpenProfil = (setProfilVisible: any) => {
  setProfilVisible(true);
};
