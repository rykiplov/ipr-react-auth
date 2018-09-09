import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Api, Logger } from "../../middleware";
import SubmitButton from "./SubmitButton";

import TextField from "material-ui/TextField";


export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.url = "http://rykiplov.getsandbox.com/login";
    this.state = {
      login: "",
      password: "",
      loginState: ""
    };
  }

  onChangeValue = e => {
    const el = e.target;
    this.setState({
      [el.name]: el.value.trim(),
      loginState: ""
    });
  };

  handleSubmitEvent = e => {
    e.preventDefault();

    this.setState({ loginState: "Waiting" });

    const userData = {
      Username: this.state.login,
      Password: this.state.password
    };

    Api.requestLogin(this.url, userData, data => {
      Logger.toConsole({ req: { Username: userData.Username }, res: data });
      this.setState({
        loginState: data.Auth || "Denied",
        login: "",
        password: ""
      });
    });
  };

  get isSuccessful() {
    return this.state.loginState === "Allow";
  }

  render() {
    const { login, password, loginState } = { ...this.state };

    const styles = {
      errorStyle: {
		border: "1px solid red"
      },
	  regularStyle: {
		  borderColor: "#0BA4FB",
		  borderWidth: "2px",
		  margin: "10px 0",
		  position: "relative",
		  width: "100%"
	  },
    };

    let fieldStyles = loginState === "Denied" ? styles.errorStyle : styles.regularStyle;

    const Form = (
		<div className="form-wrap">
      <form className="form" onSubmit={this.handleSubmitEvent} onChange={this.onChangeValue}>
        <TextField hintText="Enter login here" underlineStyle={fieldStyles} style={styles.regularStyle}  name="login" defaultValue={login} value={login} />
        <TextField hintText="Enter password here" underlineStyle={fieldStyles} style={styles.regularStyle} name="password" type="password" defaultValue={password}  value={password}/>
        <SubmitButton state={this.state}/>
      </form>
	  </div>
    );

	if (!this.isSuccessful) { return Form; } 
	else { return <Redirect to="/success" />; }
  }
}