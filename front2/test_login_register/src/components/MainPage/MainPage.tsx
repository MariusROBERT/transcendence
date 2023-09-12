import { useState } from "react";
import LeaderBoard from "../Leaderboard/leaderboard"

function MainPage() {
	const [leaderBoardVisible, setLeaderBoardVisible] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	const handleInputClick = async () => {
		setLeaderBoardVisible(true);
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	return (
		<>
			<div className="home">
				Main Page
				<input
					type="text"
					onClick={handleInputClick}
					placeholder="Rechercher par nom d'utilisateur"
					onChange={handleInputChange}
					value={searchTerm}
				/>
				{leaderBoardVisible && (
					<button onClick={() => setLeaderBoardVisible(false)}>Fermer le leaderboard</button>
				)}
			</div>
			{leaderBoardVisible && <LeaderBoard searchTerm={searchTerm} />}
		</>
	);
}

export default MainPage;