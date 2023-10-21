import { Fetch } from './SecureFetch';
import {
  SetCurrChan,
  UpdateChannelMessage,
  UpdateChannelUsers,
} from './channel_functions';
import { publish } from './event';
import { IUser } from './interfaces';
import { Socket } from 'socket.io-client';

export async function openChat(user: IUser, socket: Socket | undefined) {
  console.log('user : ', user);
  
  publish('open_chat', undefined);
  const res = await Fetch('channel/join_private', 'POST', JSON.stringify(user));
  const data = res?.json;
  UpdateChannelMessage(data.id);
  UpdateChannelUsers(data.id);
  SetCurrChan(data.channel_name);
  socket?.emit('join', { channel: data.channel_name });
}

export function sendGameInvite() {
  // console.log('invite ' + user_name + ' to play a game');
}

export function lookGame() {
  // console.log('try to look game with ' + user_name);
}

export const handleOpenProfil = (setProfilVisible: any) => {
  setProfilVisible(true);
};
