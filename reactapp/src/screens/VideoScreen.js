import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ReactPlayer from "react-player";
import Card from "../components/Card";
import { useParams } from "react-router-dom";
//"d-sm-block d-lg-flex">
export default function VideoScreen() {
  const { urlid, title, description } = useParams();
  console.log(title);
  const [VideoData, setdata] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(
          "http://172.31.31.124:5000/api/getMongoData",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        let data = await response.json();
        console.log(data);

        setdata(data.slice(0, 10));
        window.scrollTo({
          top: 0,
          behavior: "smooth", // Use 'smooth' for smooth scrolling
        });
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData(); // Call the async function inside useEffect

    // No cleanup needed here, so nothing is returned
  }, []);

  return (
    <div>
      <Navbar></Navbar>

      <div className=" d-flex flex-lg-row flex-column ">
        <div className="   p-2  flex-fill col-lg-8">
          <div className="ratio ratio-16x9">
            <iframe
              src={"https://www.youtube.com/embed/" + urlid}
              title="hello"
              allowfullscreen
            ></iframe>
          </div>
          <div className="fw-bold fs-3 m-1">{title}</div>
          <div
            className="description"
            style={{ maxHeight: "100px", overflow: "auto" }}
          >
            {decodeURIComponent(description)}
          </div>
        </div>
        <div className="  flex-grow-1 col-lg-4">
          <div
            className="container "
            // style={{ minWidth: "200px", overflow: "auto" }}
          >
            <div className="row">
              {VideoData.length !== 0 ? (
                VideoData.map((data, index) => (
                  <div key={index}>
                    <Card data={data}></Card>
                  </div>
                ))
              ) : (
                <div className="container" style={{ display: "flex" }}>
                  <div
                    class="container spinner-border"
                    role="status"
                    style={{ color: "#ff00ff" }}
                  >
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
