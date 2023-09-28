import React, { useEffect, useState } from 'react';
import Switch from 'react-switch';
import { SwitchToggleProps } from '../../utils/interfaces';

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
      {/* htmlFor c'est comme un for normal enfaite */}
      <Switch onChange={handleChange} checked={isChecked} id="normal-switch" />
    </label>
  );
};

export default SwitchToggle;
