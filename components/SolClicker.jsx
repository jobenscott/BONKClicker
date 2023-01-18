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

    let starting_reward = .00001;
    let starting_cost = .0001;

    const [count, setCount] = useState(0)
    const [autoClicker, setAutoClicker] = useState(0)
    const [autoClickerCost, setAutoClickerCost] = useState(starting_cost)
    const [autoClickerMultiplier, setAutoClickerMultiplier] = useState(1)
    const [autoClickerMultiplierCost, setAutoClickerMultiplierCost] = useState(starting_cost)
    const [clickPower, setClickPower] = useState(1)
    const [clickPowerCost, setClickPowerCost] = useState(starting_cost)
    const [clickable, setClickable] = useState(true)
    const [claimable, setClaimable] = useState(false)

    // console.log('the user', user);

    useEffect(() => {
        if (user) {
            console.log('ello', user);

            setCount(user.solPoints);
            setAutoClicker(user.solAutoClicker);
            setAutoClickerCost((starting_cost * (1 + (user.solAutoClicker * 1.7))));
            setAutoClickerMultiplier(user.solAutoClickerMultiplier);
            setAutoClickerMultiplierCost((starting_cost * (1 + (user.solAutoClickerMultiplier * 1.5))));
            setClickPower(user.solClickPower);
            setClickPowerCost(starting_cost * (1 + (user.solClickPower * 2)));
            if (user.solPoints > .00001) {
                setClaimable(true);
            }
        }
    }, [user]);
    useEffect(() => {
        let intervalId = null;
        console.log('here baby!');
        if (autoClicker) {
            intervalId = setInterval(() => {
                setCount(count => count + (0.0000001 * (autoClickerMultiplier * .05) * autoClicker))
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

            const { data } = await axios.get(`/api/solManualClick?address=${user.address}`);
            // console.log("REGISTER RESPONSE", data);
            dispatch({
                type: "LOGIN",
                payload: data,
            });
            // save in local storage
            window.localStorage.setItem("user", JSON.stringify(data));

            console.log(user);
            if (data.solPoints != null) {
                setCount(data.solPoints);
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
            const { data } = await axios.get(`/api/solPurchaseAutoClicker?address=${user.address}`);
            dispatch({
                type: "LOGIN",
                payload: data,
            });
            console.log(data);
            // save in local storage
            window.localStorage.setItem("user", JSON.stringify(data));
            setAutoClicker(data.solAutoClicker);
            setAutoClickerCost((starting_reward * (1 + (data.solAutoClicker * 1.7))));
            setCount(data.solPoints);
        } catch (error) {
            console.log(error);
        }

    }

    const handleMultiplier = async () => {
        const { data } = await axios.get(`/api/solPurchaseAutoClickerMultiplier?address=${user.address}`);
        dispatch({
            type: "LOGIN",
            payload: data,
        });
        console.log(data);
        // save in local storage
        window.localStorage.setItem("user", JSON.stringify(data));
        setAutoClickerMultiplier(data.solAutoClickerMultiplier + 0.05);
        setAutoClickerMultiplierCost((starting_reward * (1 + (data.solAutoClickerMultiplier * 1.5))));
        setCount(data.solPoints);
        if (data.solPoints < 1) {
            setClaimable(false);
        }
    }


    const handleClickPower = async () => {
        const { data } = await axios.get(`/api/solPurchaseClickPower?address=${user.address}`);
        dispatch({
            type: "LOGIN",
            payload: data,
        });
        console.log(data);
        // save in local storage
        window.localStorage.setItem("user", JSON.stringify(data));
        setClickPower(data.solClickPower);
        setClickPowerCost(starting_reward * (1 + (data.solClickPower * 2)));
        setCount(data.solPoints);
        if (data.solPoints < 1) {
            setClaimable(false);
        }
    }

    const handleClaim = async () => {
        try {
            const { data } = await axios.get(`/api/solClaim?address=${user.address}`);
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
                    <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: "center", mt: 3, fontSize: { lg: "2rem", md: "2rem", sm: "1.4rem", xs: "1.2rem" } }}>{"$SOL Clicker is temporarily closed(y'all emptied the account fast!)"}</Typography>
                    {/* <Grid container item sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', background: "white", borderRadius: 2, flexDirection: "column", maxWidth: {md: "70%", sm: "80%"} }}>
                        <Grid item sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', borderRadius: 2 }}>
                            <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: "center", mt: 3, fontSize: { lg: "2rem", md: "2rem", sm: "1.4rem", xs: "1.2rem" } }}>{`$SOL - ${count.toFixed(8)}`}</Typography>
                        </Grid>
                        <Grid item sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
                            <Button sx={{ m: 1, background: "black", minWidth: "20rem", color: "white", "&:hover": { background: "#4e3868" }, "&:disabled": { background: "gray" } }} onClick={handleClaim} disabled={!claimable}>Claim</Button>
                        </Grid>
                        <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button sx={{ m: 1, background: "black", minWidth: "20rem", color: "white", "&:hover": { background: "#4e3868" }, "&:disabled": { background: "gray" } }} onClick={handleClick} disabled={!clickable}>Click</Button>
                        </Grid>
                        <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button sx={{ m: 1, background: "black", minWidth: "20rem", color: "white", "&:hover": { background: "#4e3868" }, "&:disabled": { background: "gray" } }} onClick={handleClickPower} disabled={count < clickPowerCost}>
                                {`Buy Click Power(${clickPower}) ~ ${autoClickerCost.toFixed(4)} $SOL`}
                            </Button>
                        </Grid>
                        <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button sx={{ m: 1, background: "black", minWidth: "20rem", color: "white", "&:hover": { background: "#4e3868" }, "&:disabled": { background: "gray" } }} onClick={handleAutoClicker} disabled={count < autoClickerCost}>
                                {`Buy Auto Clicker(${autoClicker}) ~ ${autoClickerCost.toFixed(4)} $SOL`}
                            </Button>
                        </Grid>
                        <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button sx={{ m: 1, background: "black", minWidth: "20rem", color: "white", "&:hover": { background: "#4e3868" }, "&:disabled": { background: "gray" } }} onClick={handleMultiplier} disabled={count < autoClickerMultiplierCost}>
                                {`Buy Auto Multiplier(${autoClickerMultiplier}) ~ ${autoClickerCost.toFixed(4)} $SOL`}
                            </Button>
                        </Grid>
                    </Grid> */}
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

export default function SolClicker() {
    return (
        <div>
            <AutoClicker />
        </div>
    )
}
