import { IUser } from '../../utils/interfaces';
import { AuthGuard, Flex, RoundButton, Profil, Popup } from '..';
import React, { CSSProperties, useState } from 'react';

// interface Props {
//     game:GameHistory;
//     user:number;
// }

// const GameHistory = ({user, game }: Props) => {

//     return (
//         <div style={{background:'grey'}}>
//             <Flex flex_direction='row' flex_gap='5px 30px' flex_alignItems='space-around' flex_justifyContent='center'>
//             <div>
//                 <Flex flex_direction='row' flex_gap='5px 20px'>
//                     <Flex flex_direction='column'>
//                         <div style={{...nameStyle, color:'blue'}}>
//                             {user1.username}
//                         </div>
//                     </Flex>
//                     <div>
//                         <Flex flex_alignItems='center'>
//                             <p>Games Played</p>
//                             <p>{user1.gamesPlayed}</p>
//                         </Flex>
//                     </div>
//                     <div>
//                         <Flex flex_alignItems='center'>
//                             <p>Winrate</p>
//                             <p>{user1.winrate} %</p>
//                         </Flex>
//                     </div>
//                     <div>
//                         <Flex flex_alignItems='center'>
//                             <p>ELO</p>
//                             <p>{user1.elo}</p>
//                         </Flex>
//                     </div>
//                 </Flex>
//             </div>
//             <div id='score' style={{width: '150px', maxHeight:'100 px', borderRadius:'50%', background: 'white', color:'black', display:'flex', justifyContent:'center', alignItems:'center', fontSize:'30px'}}>
//                 {score1} VS {score2}
//             </div>
//             <div>
//                 <Flex flex_direction='row' flex_gap='5px 20px'>
//                     <div>
//                         <Flex flex_alignItems='center'>
//                             <p>ELO</p>
//                             <p>{user2.elo}</p>
//                         </Flex>
//                     </div>
//                     <div>
//                         <Flex flex_alignItems='center'>
//                             <p>Winrate</p>
//                             <p>{user2.winrate} %</p>
//                         </Flex>
//                     </div>
//                     <div>
//                         <Flex flex_alignItems='center'>
//                             <p>Games Played</p>
//                             <p>{user2.gamesPlayed}</p>
//                         </Flex>
//                     </div>
//                     <div>
//                         <Flex flex_direction='column'>
//                             <div style={{...nameStyle, color:'red'}}>{user2.username}</div>
//                             <div>
//                             <RoundButton icon={user2.urlImg} icon_size={130} 
//                                     onClick={() => setProfilVisible(true)} />
//                             </div>
//                         </Flex>
//                     </div>
//                 </Flex>
//             </div>
//             </Flex>
//         </div>
//       )  
    
//     }
//     export default GameHistory;