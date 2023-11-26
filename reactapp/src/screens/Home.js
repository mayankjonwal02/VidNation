import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import SideBar from "../components/SideBar";
import { FaSearch } from "react-icons/fa";

export default function Home() {
  const [VideoData, setdata] = useState([]);
  const [FilteredVideoData, Filteredsetdata] = useState([]);
  const [search, setSearch] = useState("");

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
        setdata(data);
        Filteredsetdata(data);
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
        style={{ maxWidth: "800px", marginTop: "40px" }}
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

      <div
        className="container"
        style={{ marginTop: "50px" }}
        // style={{ marginTop: "50px", marginRight: "40px", marginLeft: "20px" }}
      >
        <div className="row  ">
          {FilteredVideoData.length !== 0 ? (
            FilteredVideoData

              // .filter((data, index) =>
              //   data.videoInfo.snippet.title
              //     .toLowerCase()
              //     .includes(search.toLocaleLowerCase())
              // )

              .map((filtereddata, index) => (
                <div className="col-12 col-md-4 col-lg-3 p-1 ">
                  <Card data={filtereddata}></Card>
                </div>
              ))
          ) : (
            <div
              class="container spinner-grow text-primary"
              role="status"
              style={{ display: "flex", marginTop: "200px" }}
            >
              <span class="visually-hidden">Loading...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
