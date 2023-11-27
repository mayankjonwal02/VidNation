import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ReactPlayer from "react-player";
import Card from "../components/Card";
import { useParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
//"d-sm-block d-lg-flex">
export default function VideoScreen() {
  const { urlid, title, description, views } = useParams();
  console.log(title);
  const [search, setSearch] = useState("");
  const [VideoData, setdata] = useState([]);
  const [FilteredVideoData, Filteredsetdata] = useState([]);
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
      <div
        className="container "
        style={{ maxWidth: "800px", marginTop: "20px", marginBottom: "20px" }}
      >
        <form class="d-flex" role="search">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "pink";
            }}
          />
          <button
            class="btn "
            style={{ background: "#FF99FF" }}
            onClick={(e) => {
              e.preventDefault();
              Filteredsetdata(
                VideoData.filter((data, index) =>
                  data.videoInfo.snippet.title
                    .toLowerCase()
                    .includes(search.toLocaleLowerCase())
                )
              );
            }}
          >
            <FaSearch size={30} color="#FF00CC" />
          </button>
        </form>
      </div>

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
          <div
            className="views fw-bold mt-2 fs-4"
            style={{ maxHeight: "100px", overflow: "auto" }}
          >
            {views === "1" || views === "0" ? (
              <>{views} View</>
            ) : (
              <>{views} Views</>
            )}
          </div>
        </div>
        <div className="  flex-grow-1 col-lg-4">
          <div
            className="container "
            // style={{ minWidth: "200px", overflow: "auto" }}
          >
            <div className="row">
              {FilteredVideoData.length !== 0 ? (
                FilteredVideoData.map((data, index) => (
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
