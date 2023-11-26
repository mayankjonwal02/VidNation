import React from "react";

export default function demo() {
  return (
    <div>
      <div className="   d-sm-block d-lg-flex ">
        <div className="container-fluid bg-danger ">danger</div>
        <div className="container-fluid bg-warning ">warning</div>
      </div>
      <div className="bg-success d-flex">success</div>

      <div className=" d-flex flex-lg-row flex-column ">
        <div className=" bg-danger flex-fill ">danger</div>
        <div className=" bg-warning flex-fill ">warning</div>
      </div>
    </div>
  );
}
