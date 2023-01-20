import { useState, useEffect, useContext } from 'react'
import axios from "axios";
import { Context } from "../context";
import { useRouter } from "next/router";
import { Container, Grid, styled, Typography, TextField, Button } from "@mui/material";
import { SignMessage } from './SignMessage';

function AutoClicker() {


  const {
    state: { user },
    dispatch
  } = useContext(Context);

  const [count, setCount] = useState(0)
  const [autoClicker, setAutoClicker] = useState(0)
  const [autoClickerCost, setAutoClickerCost] = useState(10)
  const [autoClickerMultiplier, setAutoClickerMultiplier] = useState(1)
  const [autoClickerMultiplierCost, setAutoClickerMultiplierCost] = useState(10)
  const [clickPower, setClickPower] = useState(1)
  const [clickPowerCost, setClickPowerCost] = useState(10)
  const [clickable, setClickable] = useState(true)
  const [claimable, setClaimable] = useState(false)

  // console.log('the user', user);

  useEffect(() => {
    if (user) {


      setCount(user.bonkPoints);
      setAutoClicker(user.autoClicker);
      setAutoClickerCost((10 * (1 + (user.autoClicker * 1.7))));
      setAutoClickerMultiplier(user.autoClickerMultiplier);
      setAutoClickerMultiplierCost((10 * (1 + (user.autoClickerMultiplier * 1.5))));
      setClickPower(user.clickPower);
      setClickPowerCost(10 * (1 + (user.clickPower * 2)));
      if (user.bonkPoints > 1) {
        setClaimable(true);
      }
    }
  }, [user]);
  useEffect(() => {
    let intervalId = null;
    console.log('here baby!');
    if (autoClicker) {
      intervalId = setInterval(() => {
        setCount(count => count + (0.1 * (autoClickerMultiplier * .05) * autoClicker))
      }, 1000);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [autoClicker, autoClickerMultiplier])

  const handleClick = async () => {
    setClickable(false);
    // setCount((count + (.001* clickPower)))
    try {

      const { data } = await axios.get(`/api/manualClick?address=${user.address}`);
      // console.log("REGISTER RESPONSE", data);
      dispatch({
        type: "LOGIN",
        payload: data,
      });
      // save in local storage
      window.localStorage.setItem("user", JSON.stringify(data));

      console.log(user);
      if (data.bonkPoints != null) {
        setCount(data.bonkPoints);
      }
      setTimeout(() => {
        setClickable(true);
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        setClickable(true);
      }, 1000);
    }

  };


  const handleAutoClicker = async () => {
    try {
      const { data } = await axios.get(`/api/purchaseAutoClicker?address=${user.address}`);
      dispatch({
        type: "LOGIN",
        payload: data,
      });
      console.log(data);
      // save in local storage
      window.localStorage.setItem("user", JSON.stringify(data));
      setAutoClicker(data.autoClicker);
      setAutoClickerCost((10 * (1 + (data.autoClicker * 1.7))));
      setCount(data.bonkPoints);
    } catch (error) {
      console.log(error);
    }

  }

  const handleMultiplier = async () => {
    const { data } = await axios.get(`/api/purchaseAutoClickerMultiplier?address=${user.address}`);
    dispatch({
      type: "LOGIN",
      payload: data,
    });
    console.log(data);
    // save in local storage
    window.localStorage.setItem("user", JSON.stringify(data));
    setAutoClickerMultiplier(data.autoClickerMultiplier + 0.05);
    setAutoClickerMultiplierCost((10 * (1 + (data.autoClickerMultiplier * 1.5))));
    setCount(data.bonkPoints);
    if(data.bonkPoints < 1) {
      setClaimable(false);
    }
  }


  const handleClickPower = async () => {
    const { data } = await axios.get(`/api/purchaseClickPower?address=${user.address}`);
    dispatch({
      type: "LOGIN",
      payload: data,
    });
    console.log(data);
    // save in local storage
    window.localStorage.setItem("user", JSON.stringify(data));
    setClickPower(data.clickPower);
    setClickPowerCost(1 * (1 + (data.clickPower * 2)));
    setCount(data.bonkPoints);
    if(data.bonkPoints < 1) {
      setClaimable(false);
    }
  }

  const handleClaim = async () => {
    try {
      const { data } = await axios.get(`/api/claim?address=${user.address}`);
      dispatch({
        type: "LOGIN",
        payload: data,
      });
      // save in local storage
      window.localStorage.setItem("user", JSON.stringify(data));
      setClaimable(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container sx={{ borderRadius: 2, paddingLeft:{sm: "0px", xs: "0px"}, paddingRight:{sm: "0px", xs: "0px"} }}>
    <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: "center", mt: 3, fontSize: { lg: "2rem", md: "2rem", sm: "1.4rem", xs: "1.2rem" } }}>{"$BONK clicker is temporarily closed. Working on updates. Will be adding more $BONK soon. With more features!"}</Typography>
  </Container>
  
  )
}

export default function Clicker() {
  return (
    <div>
      <AutoClicker />
    </div>
  )
}
