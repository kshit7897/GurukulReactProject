import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Card,
  CardContent,
  Box,
  Link,
} from "@mui/material";
import { Grid } from "@mui/material";
import useStyles from "./styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { breakpoints } from "../../theme/constant";
import { useHistory, useParams } from "react-router-dom";
import { interpolatePath, PATHS, versionCode } from "../../constant";
import LearningTrackCard from "./LearningTrackCard";
import axios from "axios";
import { METHODS } from "../../services/api";
import { useSelector, useDispatch } from "react-redux";
import { actions as upcomingBatchesActions } from "../PathwayCourse/redux/action";
import { actions as upcomingClassActions } from "../PathwayCourse/redux/action";
import { actions as enrolledBatchesActions } from "../PathwayCourse/redux/action";
import { Button } from "@mui/material";

function ReturningUserPage() {
  const isActive = useMediaQuery("(max-width:" + breakpoints.values.sm + "px)");
  const classes = useStyles();
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();

  const user = useSelector(({ User }) => User);
  const [learningTracks, setLearningTracks] = useState([]);
  const [pathway, setPathway] = useState([]);
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );
  const [showSearch, setShowSearch] = useState(true);

  useEffect(() => {
    axios({
      method: METHODS.GET,
      url: `${process.env.REACT_APP_MERAKI_URL}/pathways/ongoingTopic`,
      headers: {
        "version-code": versionCode,
        accept: "application/json",
        Authorization: user?.data?.token || "",
      },
    }).then((res) => {
      const data = res.data;
      setLearningTracks(data);
    });
  }, []);
  console.log(learningTracks, "learning");

  // const Pathway = learningTracks.forEach((element)=>{
  //     setPathway(element.pathway_id)
  //   })
  // console.log(Pathway)

  // const userEnrolledClasses = useSelector((state) => {
  //   return state.Pathways?.upcomingEnrolledClasses?.data;
  // });

  // const enrolledBatches = useSelector((state) => {
  //   if (state?.Pathways?.enrolledBatches?.data?.length > 0) {
  //     return state?.Pathways?.enrolledBatches?.data;
  //   } else {
  //     return null;
  //   }
  // });
  // console.log(pathway)
  // useEffect(() => {
  //   if (user?.data?.token && enrolledBatches?.length > 0) {
  //     dispatch(
  //       upcomingClassActions.getupcomingEnrolledClasses({
  //         pathwayId: 1,
  //         authToken: user?.data?.token,
  //       })
  //     );
  //   } else {
  //     if (user?.data?.token) {
  //       dispatch(
  //         upcomingBatchesActions.getUpcomingBatches({
  //           pathwayId: 1,
  //           authToken: user?.data?.token,
  //         })
  //       );
  //     }
  //   }
  // }, []);

  async function fetchData() {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();
    setUserData(data);
    localStorage.setItem("userData", JSON.stringify(data));
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetchData();
    setShowSearch(false);
  }

  function handleReset() {
    setUsername("");
    // setUserData(null);
    // localStorage.removeItem("userData");
    setShowSearch(true);
  }

  return (
    <>
      <Container maxWidth="lg">
        <Typography variant="h6" mb={5} mt={5}>
          My Learning Tracks
        </Typography>
        <Grid container spacing={1}>
          {learningTracks.map((item) => (
            <LearningTrackCard item={item} />
          ))}
        </Grid>

        <Typography variant="h6" mb={5} mt={5}>
          My GitHub Account
        </Typography>

        {/* ==========================github  Account ========================= */}

        <Card
          elevation={2}
          sx={{
            width: "640px",
            marginBottom: "32px",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          <div>
            {showSearch ? (
              <form onSubmit={handleSubmit}>
                {/* -----------------------input bar start from here------------ */}
                <input
                  type="text"
                  placeholder="Enter GitHub username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    border: "1px solid nevyblue",
                    padding: "7px",
                    fontSize: "16px",
                    width: "40%",
                    borderRadius: "5px",
                  }}
                />
                {/* -----------------------LONIN button start from here------------ */}
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    left: "10px",
                  }}
                  type="submit"
                >
                  LOGIN
                </Button>
              </form>
            ) : (
              <div>
                <CardContent>
                  <Grid item md={4} xs={3}>
                    <Typography gutterBottom variant="body1" pt={1}>
                      <h3>{userData.login}</h3>
                    </Typography>
                  </Grid>

                  <Grid item>
                    <img
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                      }}
                      // align="left"
                      src={userData.avatar_url}
                      alt="Students Img"
                    />
                  </Grid>

                  <Button variant="outlined" onClick={handleReset}>
                    LOGOUT
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{
                      left: "20px",
                    }}
                  >
                    <a
                      href={userData.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      Go-To-GitHub
                    </a>
                  </Button>
                </CardContent>
              </div>
            )}
          </div>
        </Card>
      </Container>
    </>
  );
}
export default ReturningUserPage;
