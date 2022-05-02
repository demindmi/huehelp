import React from "react";
import Card from "./Card";

import css from "./Row.module.css";

const Row = (props) => {
  return (
    <Card className={`${css.Row} ${props.className}`}>
      <h3>{props.title}</h3>
      <hr />
      <div className={css.Container}>{props.children}</div>
    </Card>
  );
};

export default Row;
