import { Fetch } from '.';
import { publish } from './event';

export async function UpdateChannelMessage(id: number) {
  const res2 = await Fetch('channel/msgs/' + id, 'GET');
  const msgs = res2?.json;
  if (msgs.statusCode === 400) return;
  publish('enter_chan', {
    detail: {
      value: msgs,
      id: id,
    },
  });
}

export async function UpdateChannelUsers(id: number) {
  if (id < 1) return;
  const res3 = await Fetch('channel/users/' + id, 'GET');
  const usrs = res3?.json;
  publish('enter_users', {
    detail: {
      value: usrs,
      id: id,
    },
  });
}

export async function UpdateChannels() {
  try {
    const res = await Fetch('channel/of_user', 'GET');
    const channels = res?.json;
    publish('update_chan', {
      detail: {
        value: channels,
      },
    });
  } catch (e) {
    console.log(e);
  }
}

export let current_chan = '';

export function SetCurrChan(chan: string) {
  current_chan = chan;
}

export function GetCurrChan() {
  return current_chan;
}
