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
  const [autoClickerCost, setAutoClickerCost] = useState(.01)
  const [autoClickerMultiplier, setAutoClickerMultiplier] = useState(1)
  const [autoClickerMultiplierCost, setAutoClickerMultiplierCost] = useState(.01)
  const [clickPower, setClickPower] = useState(1)
  const [clickPowerCost, setClickPowerCost] = useState(.01)
  const [clickable, setClickable] = useState(true)
  const [claimable, setClaimable] = useState(false)

  // console.log('the user', user);

  useEffect(() => {
    if (user) {


      setCount(user.bonkPoints);
      setAutoClicker(user.autoClicker);
      setAutoClickerCost((.01 * (1 + (user.autoClicker * 1.7))));
      setAutoClickerMultiplier(user.autoClickerMultiplier);
      setAutoClickerMultiplierCost((.01 * (1 + (user.autoClickerMultiplier * 1.5))));
      setClickPower(user.clickPower);
      setClickPowerCost(.01 * (1 + (user.clickPower * 2)));
      if (user.bonkPoints > .01) {
        setClaimable(true);
      }
    }
  }, [user]);
  useEffect(() => {
    let intervalId = null;
    console.log('here baby!');
    if (autoClicker) {
      intervalId = setInterval(() => {
        setCount(count => count + (0.00001 * (autoClickerMultiplier * .05) * autoClicker))
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
      setAutoClickerCost((.01 * (1 + (data.autoClicker * 1.7))));
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
    setAutoClickerMultiplierCost((.01 * (1 + (data.autoClickerMultiplier * 1.5))));
    setCount(data.bonkPoints);
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
    setClickPowerCost(.01 * (1 + (data.clickPower * 2)));
    setCount(data.bonkPoints);
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
    <Container>
      <Grid
        container
        sx={{
          displau: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Grid item sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', background: "#fccc69", borderRadius: 5, m: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: "center", mt: 3 }}>Bonk Clicker</Typography>
        </Grid>
      </Grid>
      {user &&
        <Grid
          container
          sx={{
            displau: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Grid item sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', background: "#f7a804", borderRadius: 5, m: 2}}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: "center", mt: 3, fontSize: {lg: "2rem", md: "2rem", sm: "1.4rem", xs: "1.2rem"}  }}>{`Bonk Points: ${count}`}</Typography>
          </Grid>
          <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={handleClick} disabled={!clickable}>Get BONK</Button>
          </Grid>
          <Grid item sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', background: "#f7a804", borderRadius: 5, m: 2}}>
            <Button onClick={handleAutoClicker} disabled={count < autoClickerCost}>
              Buy AutoClicker
            </Button>
            <Typography variant="h4" component="h3" gutterBottom sx={{ textAlign: "center", mt: 3, fontSize: {lg: "2rem", md: "2rem", sm: "1.4rem", xs: "1.2rem"}  }}>{`AutoBONKers: ${autoClicker}`}</Typography>
            <Typography variant="h4" component="h3" gutterBottom sx={{ textAlign: "center", mt: 3, fontSize: {lg: "2rem", md: "2rem", sm: "1.4rem", xs: "1.2rem"}  }}>{`AutoBONKers Cost: ${autoClickerCost}`}</Typography>
          </Grid>
          <Grid item sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', background: "#f7a804", borderRadius: 5, m: 2}}>
            <Button onClick={handleMultiplier} disabled={count < autoClickerMultiplierCost}>
              Buy AutoClicker Multiplier
            </Button>
            <Typography variant="h4" component="h3" gutterBottom sx={{ textAlign: "center", mt: 3, fontSize: {lg: "2rem", md: "2rem", sm: "1.4rem", xs: "1.2rem"}  }}>{`AutoBONKer Multiplier: ${autoClickerMultiplier}`}</Typography>
            <Typography variant="h4" component="h3" gutterBottom sx={{ textAlign: "center", mt: 3, fontSize: {lg: "2rem", md: "2rem", sm: "1.4rem", xs: "1.2rem"}  }}>{`AutoBONKer Multiplier Cost: ${autoClickerMultiplierCost}`}</Typography>
          </Grid>
          <Grid item sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', background: "#f7a804", borderRadius: 5, m: 2}}>
            <Button onClick={handleClickPower} disabled={count < clickPowerCost}>
              Buy Click Power
            </Button>
            <Typography variant="h4" component="h3" gutterBottom sx={{ textAlign: "center", mt: 3, fontSize: {lg: "2rem", md: "2rem", sm: "1.4rem", xs: "1.2rem"}  }}>{`BONK Click Power: ${clickPower}`}</Typography>
            <Typography variant="h4" component="h3" gutterBottom sx={{ textAlign: "center", mt: 3, fontSize: {lg: "2rem", md: "2rem", sm: "1.4rem", xs: "1.2rem"}  }}>{`BONK Click Power Cost: ${clickPowerCost}`}</Typography>
          </Grid>
          <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={handleClaim} disabled={!claimable}>Claim BONK</Button>
          </Grid>
        </Grid>

      }

      {!user &&
        <Grid
          container
          sx={{
            displau: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
            <SignMessage />
          </Grid>
        </Grid>
      }

    </Container>
    // <div>
    //   <p>You have clicked the button {count} times.</p>
    //   <button onClick={handleClick} disabled={!clickable}>Click me</button>
    //   <p>AutoClicker: {autoClicker}</p>
    //   <p>AutoClicker Cost: {autoClickerCost}</p>
    //   <button onClick={handleAutoClicker} disabled={count < autoClickerCost}>
    //     Buy AutoClicker
    //   </button>
    //   <p>Multiplier: {(autoClickerMultiplier - 1) * 100}%</p>
    //   <p>Multiplier Cost: {autoClickerMultiplierCost}</p>
    //   <button onClick={handleMultiplier} disabled={count < autoClickerMultiplierCost}>
    //     Buy Multiplier
    //   </button>
    //   <p>Click Power: {(clickPower - 1) * 100}%</p>
    //   <p>Click Power Cost: {clickPowerCost}</p>
    //   <button onClick={handleClickPower} disabled={count < clickPowerCost}>
    //     Buy Click Power
    //   </button>
    //   <button onClick={handleClaim}>
    //     Claim BONK
    //   </button>
    // </div>
  )
}

export default function Clicker() {
  return (
    <div>
      <AutoClicker />
    </div>
  )
}
