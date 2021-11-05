import React from "react";
import { Link } from "react-router-dom";
import apiCalls from "../APIcalls.js";
// const express = require("express");
// const cors = require("cors");
// app = express();
// app.use(cors());

import styles from "../assets/css/ClusterConnect.module.css";
import logo from "../assets/css/imgs/Transparent_Image_3.png";

const path = require("path");
const fs = require("fs");

export default function ClusterConnect(props) {
  const grafanaDashboard = fs.readFileSync(
    path.join(__dirname, "../../../../../../../../grafana-test.json")
  );
  console.log("grafanaDashboard", grafanaDashboard);
  console.log("grafanaDashboard.db", JSON.parse(grafanaDashboard));
  console.log("dirname", __dirname);

  let clusters = props.clusters.map((cluster) => {
    return (
      <Link
        key={cluster}
        to="/dash"
        onClick={() => {
          props.getClusterInfo();
          apiCalls.grafanaDashboardPostRequest();
        }}
      >
        <p className={styles.clusterContainer}>{cluster}</p>
      </Link>
    );
  });

  return (
    <div>
      <main className={styles.mainContainer}>
        <img height='225px' width='225px'src={logo}></img>
        <section id={styles.clusters}>{clusters}</section>
        <section id={styles.newContainer}>
          Connect To New Cluster
        </section>
      </main>
    </div>
  );
}
