import { useState, useEffect } from "react";
import axios from "axios";
import CourseCard from "../components/cards/CourseCard";
import Clicker from "../components/Clicker";
import { SignMessage } from "@/components/SignMessage";
import { Container, Grid, styled, Typography, TextField, Button, Box, Tabs, Tab, TabPanel } from "@mui/material";
import SolClicker from "@/components/SolClicker";
import TabStuff from "@/components/TabStuff";


const Index = ({ }) => {
  // const [courses, setCourses] = useState([]);

  // useEffect(() => {
  //   const fetchCourses = async () => {
  //     const { data } = await axios.get("/api/courses");
  //     setCourses(data);
  //   };
  //   fetchCourses();
  // }, []);

  return (
    <>
      {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Clicker/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SolClicker/>
      </TabPanel>
      <Clicker /> */}
      <TabStuff/>
      {/* <h1 className="jumbotron text-center bg-primary square">
        Online Education Marketplace
      </h1>
      <div className="container-fluid">
        <div className="row">
          {courses.map((course) => (
            <div key={course._id} className="col-md-4">
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div> */}
    </>
  );
};

// export async function getServerSideProps() {
//   const { data } = await axios.get(`${process.env.API}/courses`);
//   return {
//     props: {
//       courses: data,
//     },
//   };
// }

export default Index;
