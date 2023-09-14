import { color } from '../../utils';

interface Props{
    children:string,
}

export function SearchBar({children}:Props)
{
    return ( 
        <div style={{borderRadius:'10px', backgroundColor:color.white, height:'60px', width:'400px'}} className={'text cursor_pointer'}>
            <img style={{height:'80px', width:'80px', position:'relative', top:'-10px', left:'-15px'}} src={require('../../assets/imgs/icon_search.png')} alt={'Searching Icon'}></img>
            <input style={{borderRadius:'10px', border:'0', position:'relative', left:'0px', top:'-45px', height:'55px', width:'315px', backgroundColor:color.white}} placeholder={children}></input>
        </div>
    )
}