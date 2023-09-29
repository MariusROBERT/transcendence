import { Fetch } from '.';
import { publish } from './event';

var current_chan = '';

export async function UpdateChannelMessage(id: number) {
  const res2 = await Fetch('channel/msg/' + id, 'GET');
  var msgs = res2?.json;
  //console.log(msgs);
  publish('enter_chan', {
    detail: {
      value: msgs,
    },
  });
}

export async function UpdateChannelUsers(id: number) {
  const res3 = await Fetch('channel/users/' + id, 'GET');
  const usrs = res3?.json;
  //console.log(usrs);
  publish('enter_users', {
    detail: {
      value: usrs,
    },
  });
}

export async function SetCurrChan(chan: string) {
  current_chan = chan;
}

export async function GetCurrChan() {
  return current_chan;
}
