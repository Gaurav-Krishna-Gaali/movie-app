import React from "react";
import "../App.css";

const TextEffect = (props) => {
  return (
    <div class="container">
      <div class="row">
        <div class="col-md-12 text-center">
          <h3 class="animate-charcter"> {props.text}</h3>
        </div>
      </div>
    </div>
  );
};

export default TextEffect;
