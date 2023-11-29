import React from "react";
import { useNavigate } from "react-router-dom";

function getYearsMonthsAndDays(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  // Calculate the total difference in milliseconds
  const timeDifference = Math.abs(now.getTime() - date.getTime());

  // Calculate the total days
  const totalDays = Math.floor(timeDifference / (1000 * 3600 * 24));

  // Calculate total years and remaining days
  const totalYears = Math.floor(totalDays / 365);
  const remainingDays = totalDays % 365;

  // Calculate total months and remaining days after years
  const totalMonths = Math.floor(remainingDays / 30);
  const remainingDaysAfterMonths = remainingDays % 30;

  return {
    years: totalYears,
    months: totalMonths,
    days: remainingDaysAfterMonths,
  };
}

export default function Card(props) {
  let navigate = useNavigate();
  const handleonclick = () => {
    const urlid = props.data.videoInfo.id;
    const title = props.data.videoInfo.snippet.title;
    const description = props.data.videoInfo.snippet.localized.description;

    const setdata = async (e) => {
      try {
        let responce = await fetch("http://172.31.31.124:5000/api/setviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            videoid: props.data._id,
            videotitle: props.data.videoInfo.snippet.title,
          }),
        });

        let json = await responce.json();
        if (json.success) {
          console.log(typeof "json.data");

          navigate(
            `/video/${urlid}/${title}/${encodeURIComponent(description)}/${
              json.data.views
            }`
          );
          window.scrollTo({
            top: 0,
            behavior: "smooth", // Use 'smooth' for smooth scrolling
          });
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    setdata();
  };
  const dateInfo = getYearsMonthsAndDays(
    props.data.videoInfo.snippet.publishedAt
  );
  return (
    <div
      className="card m-4 shadow-lg"
      style={{
        width: "18rem",
        height: "400px",
        transition: "transform 0.3s ease-in-out",
        ":hover": { transform: "scale(1.1)" },
      }}
    >
      <img
        src={props.data.videoInfo.snippet.thumbnails.high.url}
        className="card-img-top"
        alt="..."
        style={{
          height: "190px",
          objectFit: "fill",
          transition: "transform 0.3s ease-in-out",
          ":hover": { transform: "scale(1.1)" },
        }}
        onClick={() => {
          handleonclick();
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
        }}
        onTouchStart={(e) => {
          e.target.style.transform = "scale(1.1)";
        }}
        onTouchEnd={(e) => {
          e.target.style.transform = "scale(1)";
        }}
      />
      <div>
        <div
          className="card-body"
          style={{
            background:
              "linear-gradient(to right, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))",
            height: "200px",
          }}
        >
          <h5 className="card-title fw-bold fs-6" style={{ color: "#8b008b" }}>
            {props.data.videoInfo.snippet.title}
          </h5>
          <p
            className="card-text mt-3 fw-bold"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",

              fontSize: "0.8rem",
            }}
          >
            {props.data.videoInfo.snippet.channelTitle}
          </p>

          <div className="d-flex">
            <p
              className="card-text mt-1 fw-bold"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",

                fontSize: "0.75rem",
              }}
            >
              {dateInfo.years} years {dateInfo.months} months {dateInfo.days}{" "}
              days
            </p>
            <p
              className="card-text mt-1 d-inline ms-1"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",

                fontSize: "0.75rem",
              }}
            >
              ago
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
