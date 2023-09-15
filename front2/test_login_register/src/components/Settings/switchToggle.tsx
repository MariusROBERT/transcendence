import React, { Component } from "react";
import Switch from "react-switch";

interface SwitchToggleProps {
  onChange: (checked: boolean) => void; // Fonction de rappel
}

interface SwitchToggleState {
  checked: boolean;
}

class SwitchToggle extends Component<SwitchToggleProps, SwitchToggleState> {
  constructor(props: SwitchToggleProps) {
    super(props);
    this.state = { checked: false };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(checked: boolean) {
    this.setState({ checked });
    // Appeler la fonction de rappel avec la nouvelle valeur
    this.props.onChange(checked);
  }

  render() {
    return (
      <label htmlFor="normal-switch">
        <Switch
          onChange={this.handleChange}
          checked={this.state.checked}
          id="normal-switch"
        />
      </label>
    );
  }
}

export default SwitchToggle;





