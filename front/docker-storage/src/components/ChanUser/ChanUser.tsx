import { RoundButton} from "..";

interface Props {
    children: string;
    user_icon: string;
    online: boolean;
}

export function ChanUser({ user_icon }: Props) {
    function viewProfile() {
        // TODO: link the profile to the icon btn
        // to do so in the Props, get the User ID
    }

    return (
        <div>
            <RoundButton icon={user_icon} icon_size={42} onClick={viewProfile}></RoundButton>
        </div>
    )
}