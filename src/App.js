import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { saveAs } from "file-saver";
import data from "./data.txt";
import { Chart, registerables } from "chart.js";
// import { useEffect } from 'react';

Chart.register(...registerables);
const App = () => {
  // Colors in the bar
  const getBarColors = (count) => {
    if (count === 28) {
      return "#9400D3";
    } else if (count === 24) {
      return "#b44ce0";
    } else if (count === 22) {
      return "#4B0082";
    } else if (count === 19) {
      return "#900c3f";
    } else if (count === 16) {
      return "#0000FF";
    }
    else if (count === 15) {
      return "#4c4cff";
    }
    else if (count === 14) {
      return "#1b6c1b";
    }
    else if (count === 13) {
      return "#25955d";
    }
    else if (count === 12) {
      return "#00FF00";
    }
    else if (count === 11) {
      return "#FFFF00";
    }
    else if (count === 10) {
      return "#FF7F00";
    }
    else if (count === 9) {
      return "#FF0000";
    }
     else return "#808080";
  };
  const [histogramData, setHistogramData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetching the data
const fetchData = async () => {
    setLoading(true);
    const response = await fetch(data);
    const text = await response.text();
    // const words = text.split(/\s+/);

    const words = text.toLowerCase().match(/\b\w+\b/g);
    const wordCounts = {};
    words.forEach((word) => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    const sortedWords = Object.keys(wordCounts).sort(
      (a, b) => wordCounts[b] - wordCounts[a]
    ); 

    const top20Words = sortedWords.slice(0, 20);
    const histogramData = top20Words.map((word) => ({
      word,
      count: wordCounts[word],
    })
    );

    setHistogramData(histogramData);
    setLoading(false);
  };

  // Export button algo
  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      encodeURI(
        histogramData.map((row) => `${row.word},${row.count}`).join("\n")
      );
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "histogram.csv");
  };

  // Scrolling down
  const scrollDown = () => {
    const windowHeight = window.innerHeight;
    const scrollHeight = windowHeight / 4;

    window.scrollTo({
      top: scrollHeight,
      behavior: "smooth",
    });
  };

  // Scrolling to the export button
  const scrollDowntoExport = () => {
    const windowHeight = window.innerHeight;
    const scrollHeight = windowHeight;

    window.scrollTo({
      top: scrollHeight,
      behavior: "smooth",
    });
  };

  // Scrolling to the top of the screen
  const scrollDowntoTop = () => {
    const windowHeight = window.innerHeight;
    const scrollHeight = windowHeight;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const timer = setTimeout(scrollDown, 3000);
  const timer2 = setTimeout(scrollDowntoExport, 5000);
  const timer3 = setTimeout(scrollDowntoTop, 7000);

  return (
    <div>
      {/* Submit button */}
      <button
        style={{
          width: "100px",
          height: "45px",
          color: "#900c3f",
          backgroundColor: "#ffc300",
          fontWeight: "25",
          fontSize: "20px",
          border: "2px solid purple",
          padding: "8px",
          borderRadius: "2rem",
          marginBottom: "10px",
        }}
        onClick={() => {
          fetchData();
        }}
        display={loading}
      >
        {loading ? "Loading..." : "Submit"}
      </button>

      {histogramData.length > 0 && (
        <div>
          {/* Heading */}
          <h2
            style={{
              // marginLeft: "600px",
              color: "#900c3f",
              backgroundColor: "#588bae",
              fontSize: "17px",
              border: "1px solid purple",
              padding: "7px",
              borderRadius: "2rem",
              marginTop:"50px",
              marginBottom: "12px",
              width: "180px",
            }}
          >
            Top 20 Words Histogram
          </h2>

          {/* Bar component */}
          <Bar
            data={{
              labels: histogramData.map((row) => row.word),
              datasets: [
                {
                  marginTop: 100,
                  barThickness: 40,
                  label: "Word Count",
                  data: histogramData.map((row) => row.count),
                  borderColor: "#dd7973",
                  backgroundColor: histogramData.map((row) =>
                    getBarColors(row.count)
                  ),
                  borderWidth: 3,
                  borderRadius: 10,
                },
              ],
            }}
            options={{
              animation: {
                x: {
                  duration: 4000,
                  from: 0,
                },
                y: {
                  duration: 3000,
                  from: 0,
                },
              },
              scales: {
                y: {
                  min: 0,
                  max: 28,
                  beginAtZero: true,

                  ticks: {
                    color: "#993300",
                    stepSize: 1,
                    font: {
                      size: 18,
                    },
                  },
                },
                x: {
                  ticks: {
                    color: histogramData.map((row) => getBarColors(row.count)),
                    font: {
                      size: 20, 
                    },
                  },
                },
              },
            }}
          />

{/* Export button */}
          <button
            style={{
              color: "#900c3f",
              backgroundColor: "#ffc300",
              fontSize: "20px",
              padding: "11px",
              width: "100px",
              borderRadius: "2rem",
              marginTop: "50px",
              border: "2px solid purple",
            }}
            onClick={handleExport}
          >
            Export
          </button>
        </div>
      )}
    </div>
  );
};

export default App;



