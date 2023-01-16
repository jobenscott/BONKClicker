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
  const [autoClickerCost, setAutoClickerCost] = useState(1)
  const [autoClickerMultiplier, setAutoClickerMultiplier] = useState(1)
  const [autoClickerMultiplierCost, setAutoClickerMultiplierCost] = useState(1)
  const [clickPower, setClickPower] = useState(1)
  const [clickPowerCost, setClickPowerCost] = useState(1)
  const [clickable, setClickable] = useState(true)
  const [claimable, setClaimable] = useState(false)

  // console.log('the user', user);

  useEffect(() => {
    if (user) {


      setCount(user.bonkPoints);
      setAutoClicker(user.autoClicker);
      setAutoClickerCost((1 * (1 + (user.autoClicker * 1.7))));
      setAutoClickerMultiplier(user.autoClickerMultiplier);
      setAutoClickerMultiplierCost((1 * (1 + (user.autoClickerMultiplier * 1.5))));
      setClickPower(user.clickPower);
      setClickPowerCost(1 * (1 + (user.clickPower * 2)));
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
        setCount(count => count + (0.01 * (autoClickerMultiplier * .05) * autoClicker))
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
      setAutoClickerCost((1 * (1 + (data.autoClicker * 1.7))));
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
    setAutoClickerMultiplierCost((1 * (1 + (data.autoClickerMultiplier * 1.5))));
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
    <Container sx={{ borderRadius: 2 }}>
      {user &&
      <Grid
      container
      sx={{
          displau: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          // width: {md: "97.8%", sm: "92%", xs: "92%"},
      }}
  >
      <Grid container item sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', background: "white", borderRadius: 2, flexDirection: "column", m: 2, maxWidth: {md: "70%", sm: "80%"} }}>
          <Grid item sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', borderRadius: 2, m: 2 }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: "center", mt: 3, fontSize: { lg: "2rem", md: "2rem", sm: "1.4rem", xs: "1.2rem" } }}>{`$BONK - ${count.toFixed(8)}`}</Typography>
          </Grid>
          <Grid item sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
              <Button sx={{ m: 1, background: "black", minWidth: { md: "13rem", sm: "8rem"}, color: "white", "&:hover": { background: "#4e3868" }, "&:disabled": { background: "gray" } }} onClick={handleClaim} disabled={!claimable}>Claim</Button>
          </Grid>
          <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button sx={{ m: 1, background: "black", minWidth: { md: "13rem", sm: "8rem"}, color: "white", "&:hover": { background: "#4e3868" }, "&:disabled": { background: "gray" } }} onClick={handleClick} disabled={!clickable}>Click</Button>
          </Grid>
          <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button sx={{ m: 1, background: "black", minWidth: { md: "13rem", sm: "8rem"}, color: "white", "&:hover": { background: "#4e3868" }, "&:disabled": { background: "gray" } }} onClick={handleClickPower} disabled={count < clickPowerCost}>
                  {`Buy Click Power(${clickPower})`}
              </Button>
          </Grid>
          <Grid item sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
              <Button sx={{ m: 1, background: "black", minWidth: { md: "13rem", sm: "8rem"}, color: "white", "&:hover": { background: "#4e3868" }, "&:disabled": { background: "gray" } }} onClick={handleAutoClicker} disabled={count < autoClickerCost}>
                  {`Buy Auto Clicker(${autoClicker})`}
              </Button>
          </Grid>
          <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button sx={{ m: 1, background: "black", minWidth: { md: "13rem", sm: "8rem"}, color: "white", "&:hover": { background: "#4e3868" }, "&:disabled": { background: "gray" } }} onClick={handleMultiplier} disabled={count < autoClickerMultiplierCost}>
                  {`Buy Auto Multiplier(${autoClickerMultiplier})`}
              </Button>
          </Grid>
      </Grid>
  </Grid>
        // <Grid
        //   container
        //   sx={{
        //     displau: 'flex',
        //     justifyContent: 'center',
        //     flexDirection: 'column',
        //     // width: {md: "97.8%", sm: "92%", xs: "92%"},
        //   }}
        // >
        //   <Grid container item sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', background: "#f7a804", borderRadius: 5, flexDirection: "column", mt: 2 }}>
        //     <Grid item sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', background: "#f7a804", borderRadius: 5, m: 2 }}>
        //       <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: "center", mt: 3, fontSize: { lg: "2rem", md: "2rem", sm: "1.4rem", xs: "1.2rem" } }}>{`$BONK - ${count.toFixed(8)}`}</Typography>
        //     </Grid>
        //     <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
        //       <Button onClick={handleClick} disabled={!clickable}>Get BONK</Button>
        //     </Grid>
        //   </Grid>
        //   <Grid container item sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', background: "#f7a804", borderRadius: 5, flexDirection: "column", mt: 2 }}>
        //     <Grid item sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
        //       <Button onClick={handleAutoClicker} disabled={count < autoClickerCost}>
        //         Buy
        //       </Button>
        //     </Grid>
        //     <Grid container item sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', flexDirection: "row" }}>

        //       <Grid item xs="6">
        //         <Typography variant="h4" component="h3" gutterBottom sx={{ textAlign: "center", mt: 3, fontSize: { lg: "2rem", md: "2rem", sm: "1.4rem", xs: ".8rem" } }}>{`Auto-BONK-ers: ${autoClicker}`}</Typography>
        //       </Grid>
        //       <Grid item xs="6">
        //         <Typography variant="h4" component="h3" gutterBottom sx={{ textAlign: "center", mt: 3, fontSize: { lg: "2rem", md: "2rem", sm: "1.4rem", xs: ".8rem" } }}>{`Cost: ${autoClickerCost.toFixed(8)}`}</Typography>
        //       </Grid>
        //     </Grid>
        //   </Grid>
        //   <Grid container item sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', background: "#f7a804", borderRadius: 5, flexDirection: "column", mt: 2 }}>
        //     <Grid item sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
        //       <Button onClick={handleMultiplier} disabled={count < autoClickerMultiplierCost}>
        //         Buy
        //       </Button>
        //     </Grid>
        //     <Grid container item sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', flexDirection: "row" }}>

        //       <Grid item xs="6">
        //         <Typography variant="h4" component="h3" gutterBottom sx={{ textAlign: "center", mt: 3, fontSize: { lg: "2rem", md: "2rem", sm: "1.4rem", xs: ".8rem" }}}>{`Auto-BONK-er Multiplier: ${autoClickerMultiplier}`}</Typography>
        //       </Grid>
        //       <Grid item xs="6">
        //         <Typography variant="h4" component="h3" gutterBottom sx={{ textAlign: "center", mt: 3, fontSize: { lg: "2rem", md: "2rem", sm: "1.4rem", xs: ".8rem" } }}>{`Cost: ${autoClickerMultiplierCost.toFixed(8)}`}</Typography>
        //       </Grid>
        //     </Grid>
        //   </Grid>
        //   <Grid container item sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', background: "#f7a804", borderRadius: 5, flexDirection: "column", mt: 2 }}>
        //     <Grid item sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
        //       <Button onClick={handleClickPower} disabled={count < clickPowerCost}>
        //         Buy
        //       </Button>
        //     </Grid>
        //     <Grid container item sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', flexDirection: "row" }}>

        //       <Grid item xs="6">
        //         <Typography variant="h4" component="h3" gutterBottom sx={{ textAlign: "center", mt: 3, fontSize: { lg: "2rem", md: "2rem", sm: "1.4rem", xs: ".8rem" } }}>{`BONK Click Power: ${clickPower}`}</Typography>

        //       </Grid>
        //       <Grid item xs="6">
        //         <Typography variant="h4" component="h3" gutterBottom sx={{ textAlign: "center", mt: 3, fontSize: { lg: "2rem", md: "2rem", sm: "1.4rem", xs: ".8rem" } }}>{`Cost: ${clickPowerCost.toFixed(8)}`}</Typography>
        //       </Grid>
        //     </Grid>
        //   </Grid>
        //   <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
        //     <Button onClick={handleClaim} disabled={!claimable}>Claim $BONK</Button>
        //   </Grid> 
        //   {/* <Grid item sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', background: "#f7a804", borderRadius: 5, m: 2 }}>
        //     <Button onClick={handleMultiplier} disabled={count < autoClickerMultiplierCost}>
        //       Buy AutoClicker Multiplier
        //     </Button>
            
           
        //   </Grid> */}
        //   {/* <Grid item sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', background: "#f7a804", borderRadius: 5, m: 2 }}>
        //     <Button onClick={handleClickPower} disabled={count < clickPowerCost}>
        //       Buy Click Power
        //     </Button>
        //     <Typography variant="h4" component="h3" gutterBottom sx={{ textAlign: "center", mt: 3, fontSize: { lg: "2rem", md: "2rem", sm: "1.4rem", xs: "1.2rem" } }}>{`BONK Click Power: ${clickPower}`}</Typography>
        //     <Typography variant="h4" component="h3" gutterBottom sx={{ textAlign: "center", mt: 3, fontSize: { lg: "2rem", md: "2rem", sm: "1.4rem", xs: "1.2rem" } }}>{`BONK Click Power Cost: ${clickPowerCost.toFixed(8)}`}</Typography>
        //   </Grid>
        //   <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
        //     <Button onClick={handleClaim} disabled={!claimable}>Claim BONK</Button>
        //   </Grid> */}
        // </Grid>

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
