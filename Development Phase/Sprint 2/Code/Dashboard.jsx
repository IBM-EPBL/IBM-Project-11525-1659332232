import React from "react";
import { UserAuth } from "../context/AuthContext";
import Button from "react-bootstrap/Button";
import { useNavigate, Link } from "react-router-dom";
import Tab from "./Tab";
import { useState } from "react";
import tab1 from "../assets/tab1.png";
import tab2 from "../assets/tab2.png";
import tab3 from "../assets/tab3.png";
import tab4 from "../assets/tab4.png";
import tab5 from "../assets/tab5.png";
import tab6 from "../assets/tab6.png";
import tab7 from "../assets/tab7.png";
import tab8 from "../assets/tab8.png";
import { useEffect } from "react";

const Dashboard = () => {
  const { userState } = UserAuth();
  const [user, setUser] = userState;
  const [imgLink, setImgLink] = useState(tab1);

  const tabs = [tab1, tab2, tab3, tab4, tab5, tab6, tab7, tab8];
  // let i = 0;
  // useEffect(() => {
  //   setInterval(() => {
  //     console.log(i);
  //     setImgLink(tabs[i++]);
  //     if(i==9){
  //       i=0;
  //     }
  //   }, 7000)
  // },[])

  return (
    <div style={{ marginTop: "56px" }}>

      <div style={{padding: "30px"}}>
        <Button
          variant="primary"
          type="submit"
          style={{ width: "80px", marginRight: "15px" }}
          onClick={() => setImgLink(tab1)}
        >
          Tab 1
        </Button>

        <Button
          variant="primary"
          type="submit"
          style={{ width: "80px", marginRight: "15px" }}
          onClick={() => setImgLink(tab2)}
        >
          Tab 2
        </Button>

        <Button
          variant="primary"
          type="submit"
          style={{ width: "80px", marginRight: "15px" }}
          onClick={() => setImgLink(tab3)}
        >
          Tab 3
        </Button>

        <Button
          variant="primary"
          type="submit"
          style={{ width: "80px", marginRight: "15px" }}
          onClick={() => setImgLink(tab4)}
        >
          Tab 4
        </Button>

        <Button
          variant="primary"
          type="submit"
          style={{ width: "80px", marginRight: "15px" }}
          onClick={() => setImgLink(tab5)}
        >
          Tab 5
        </Button>

        <Button
          variant="primary"
          type="submit"
          style={{ width: "80px", marginRight: "15px" }}
          onClick={() => setImgLink(tab6)}
        >
          Tab 6
        </Button>

        <Button
          variant="primary"
          type="submit"
          style={{ width: "80px", marginRight: "15px" }}
          onClick={() => setImgLink(tab7)}
        >
          Tab 7
        </Button>

        <Button
          variant="primary"
          type="submit"
          style={{ width: "80px", marginRight: "15px" }}
          onClick={() => setImgLink(tab8)}
        >
          Tab 8
        </Button>
      </div>
      <div>
        <Tab imgSrc={imgLink} />
      </div>
    </div>
  );
};

export default Dashboard;
