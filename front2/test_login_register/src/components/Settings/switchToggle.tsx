import React, { Component, useEffect, useState } from "react";
import Switch from "react-switch";

interface SwitchToggleProps {
	onChange: (checked: boolean) => void; // Fonction de rappel
	checked: boolean,
}

const SwitchToggle: React.FC<SwitchToggleProps> = ({ onChange, checked }) => {
	const [isChecked, setIsChecked] = useState(checked);
  
	useEffect(() => {
		setIsChecked(checked); // Mettre à jour isChecked lorsque checked change
	}, [checked]);
  
	const handleChange = (newChecked: boolean) => {
		setIsChecked(newChecked);
		onChange(newChecked);
	};
	
	return (
		<label htmlFor="normal-switch">
			<Switch onChange={handleChange} checked={isChecked} id="normal-switch" />
		</label>
	);
  };
  
  export default SwitchToggle;
  
  
  
  
  
  