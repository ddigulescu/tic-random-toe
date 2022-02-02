import React, { useState, useRef, useReducer, useEffect } from "react";
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Remove from "@material-ui/icons/Remove";
import Add from "@material-ui/icons/Add";
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/styles";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

function gameReducer({ squares, isTicNext }, action) {
  switch (action.type) {
    case "click":
      return {
        isTicNext: !isTicNext,
        squares: [
          ...squares.slice(0, action.payload.index),
          squares[action.payload.index] ? null : action.payload.value,
          ...squares.slice(action.payload.index + 1)
        ]
      };
    default:
      return { squares, isTicNext };
  }
}

function Game({ squareLine, tic, tac, setTicFocus }) {
  const useButtonStyles = makeStyles(() => ({
    root: {
      minWidth: squareLine,
      textAlign: "center",
      fontSize: squareLine / 2,
      border: "1px solid black"
    }
  }));

  const useRowStyles = makeStyles(() => ({
    root: {
      display: "flex",
      justifyContent: "space-between",
      height: squareLine,
      lineHeight: squareLine
    }
  }));

  const useBoardStyles = makeStyles(() => ({
    root: {
      width: squareLine * 3 + 2,
      height: squareLine * 3 + 2,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  }));

  const initialState = { squares: Array(9).fill(null), isTicNext: true };

  const [{ squares, isTicNext }, gameDispatch] = useReducer(
    gameReducer,
    initialState
  );

  useEffect(() => setTicFocus(isTicNext));

  function Board({ children }) {
    const classes = useBoardStyles();
    return <div className={classes.root}>{children}</div>;
  }

  function Row({ children }) {
    const classes = useRowStyles();
    return <div className={classes.root}>{children}</div>;
  }

  function Square({ index, value }) {
    const classes = useButtonStyles();
    const handleClick = () => {
      gameDispatch({
        type: "click",
        payload: { index, value: isTicNext ? tic : tac }
      });
    };
    return (
      <Button onClick={handleClick} className={classes.root}>
        {value}
      </Button>
    );
  }
  if (!squares) {
    return null;
  }

  return (
    <Board>
      <Row>
        <Square index={0} value={squares[0]} />
        <Square index={1} value={squares[1]} />
        <Square index={2} value={squares[2]} />
      </Row>
      <Row>
        <Square index={3} value={squares[3]} />
        <Square index={4} value={squares[4]} />
        <Square index={5} value={squares[5]} />
      </Row>
      <Row>
        <Square index={6} value={squares[6]} />
        <Square index={7} value={squares[7]} />
        <Square index={8} value={squares[8]} />
      </Row>
    </Board>
  );
}

function App() {
  const fruits = ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇"];
  const vegies = ["🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶", "🌽"];
  const [squareLine, setSquareLine] = useState(45);
  const [tic, setTic] = useState("🍏");
  const [tac, setTac] = useState("🍅");
  const [ticFocus, setTicFocus] = useState(true);

  useInterval(() => {
    const rnd = getRandomInt(0, 7);
    setTic(fruits[rnd]);
  }, 2000);
  useInterval(() => {
    const rnd = getRandomInt(0, 7);
    setTac(vegies[rnd]);
  }, 2100);

  return (
    <div>
      <div style={{ width: "33%", marginBottom: "20px" }}>
        <Typography>Zoom</Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Remove />
          </Grid>
          <Grid item xs>
            <Slider
              min={45}
              max={180}
              onChange={(e, val) => setSquareLine(val)}
            />
          </Grid>
          <Grid item>
            <Add />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl focused={ticFocus}>
              <InputLabel id="select-tic-label">Tic</InputLabel>
              <Select
                labelId="select-tic-label"
                id="select-tic"
                value={tic}
                onChange={(e) => setTic(e.target.value)}
              >
                {fruits.map((f) => (
                  <MenuItem key={f} value={f}>
                    {f}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl focused={!ticFocus}>
              <InputLabel id="select-tac-label">Tac</InputLabel>
              <Select
                labelId="select-tac-label"
                id="select-tac"
                value={tac}
                onChange={(e) => setTac(e.target.value)}
              >
                {vegies.map((v) => (
                  <MenuItem key={v} value={v}>
                    {v}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </div>
      <Game
        setTicFocus={setTicFocus}
        squareLine={squareLine}
        tic={tic}
        tac={tac}
      />
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector("#app"));
