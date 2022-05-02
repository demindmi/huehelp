import React from "react";

import css from "./Button.module.css";

const Button = (props) => {
  return (
    <button type={props.type} className={css.button} onClick={props.onClick}>
      {props.children}
    </button>
  );
};
export default Button;
