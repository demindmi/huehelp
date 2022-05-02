import React from "react";
import Card from "../UI/Card";
import Button from "../UI/Button";
import css from "./Modal.module.css";

const Modal = (props) => {
  return (
    <div>
      <div className={css.backdrop}></div>
      <Card className={css.modal}>
        <h2>Choose Light to Control</h2>
        <div className={css.content}>{props.children}</div>
        <hr />
        <footer className={css.actions}>
          <Button onClick={props.onClick}>Close</Button>
        </footer>
      </Card>
    </div>
  );
};

export default Modal;
