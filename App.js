import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import Modal from "react-native-modal";
import Cell from "./Cell"; /* * IMPORT * */
const { height } = Dimensions.get("window");

const App = () => {
  /* * HOOKS * */
  //grid holds 2D array to represent state of game
  const [grid, setGrid] = useState([]);
  //size of grid
  const [size, setSize] = useState(3);
  //player keeps track of whose turn it is (1 or 2)
  const [player, setPlayer] = useState(1);
  //winner has string of who wins
  const [winner, setWinner] = useState("");
  //end signifies game is over and no further moves can be made
  const [end, setEnd] = useState(0);
  //modal is true or false for if modal should be visible
  const [modal, setModal] = useState(false);

  const startGame = () => {
    /* * SCALABLE * */
    let arr = new Array(size);
    arr.fill(0); //Initialize with all 0's
    arr.forEach((row, index, arr) => {
      arr[index] = new Array(size);
      arr[index].fill(0);
    });

    setGrid(arr);
    setPlayer(1);
    setEnd(0);
  };

  useEffect(() => {
    //Initialize the game
    startGame();
  }, [size]); /* * CALL WHEN SIZE CHANGES, setSize is async * */

  const whoWins = (row, col) => {
    if (grid && size) {
      //If grid has been initialized
      let val = grid[row][col];

      let rowWin = true,
        colWin = true,
        diagWin1 = true,
        diagWin2 = true;

      /* * SCALABLE * */
      for (let i = 0; i < size; i++) {
        if (grid[row][i] != val) rowWin = false;
        if (grid[i][col] != val) colWin = false;
        if (grid[i][i] != grid[0][0]) diagWin1 = false;
        if (grid[i][size - 1 - i] != grid[0][size - 1]) diagWin2 = false;
      }

      if (rowWin || colWin) return val;
      if (diagWin1 && grid[0][0] != 0) return grid[0][0];
      if (diagWin2 && grid[0][size - 1] != 0) return grid[0][size - 1];

      for (let i = 0; i < size; i++) {
        //If there are still unselected cells, game is not over
        if (grid[i].includes(0)) return -1;
      }
      return 0; //Only possibility left is that there is a draw
    }
    return -1;
  };

  const markCell = (row, col) => {
    if (end) return;

    let copyGrid = [...grid]; //Create a copy of the array to edit cell with index
    let currPlayer = copyGrid[row][col];
    if (!currPlayer) {
      //Can only change unselected cells
      copyGrid[row][col] = player;
      setGrid(copyGrid); //Change the grid state

      let changePlayer = player == 1 ? 2 : 1; //Alternating turns, so switch players
      setPlayer(changePlayer);

      let winner = whoWins(row, col); //Check who is the winner, if there is one
      switch (winner) {
        case 1:
          setWinner("O Wins");
          break;
        case 2:
          setWinner("X Wins");
          break;
        case 0:
          setWinner("Draw");
      }
      if (winner != -1) {
        setModal(true);
        setEnd(1);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {/* * FOR INPUT * */}
      <View style={styles.container}>
        <TextInput
          placeholder="3"
          placeholderTextColor="#4575EF"
          textAlign="center"
          style={[styles.button, styles.text]}
          onSubmitEditing={event => {
            let input = event.nativeEvent.text;
            if (!isNaN(input)) {
              input = parseInt(input);
              setSize(input); /* * CHANGE GRID SIZE * */
            }
          }}
        />

        <TouchableOpacity style={styles.button} onPress={startGame}>
          {/* Button for starting a new game at any time */}
          <Text style={styles.text}>New Game</Text>
        </TouchableOpacity>
        {/* Button for starting a new game at any time */}

        <View style={styles.square}>
          {/* * EACH ROW & CELL HAS DYNAMIC SIZE* */}
          {grid.map((row, rowIdx) => (
            <View style={styles.row} key={rowIdx}>
              {row.map((cell, colIdx) => {
                //To get rid of outside borders
                let styleVert =
                  rowIdx == 0
                    ? styles.top
                    : rowIdx == grid.length - 1
                    ? styles.bottom
                    : {};
                let styleHor =
                  colIdx == 0
                    ? styles.left
                    : colIdx == grid.length - 1
                    ? styles.right
                    : {};
                return (
                  <Cell
                    grid={grid}
                    mark={markCell}
                    row={rowIdx}
                    col={colIdx}
                    style_={[styleVert, styleHor]}
                    key={"" + rowIdx + colIdx}
                  />
                );
              })}
            </View>
          ))}
        </View>

        <Modal
          // Message that pops up to declare winner
          isVisible={modal}
          backdropTransitionOutTiming={0}
          onBackdropPress={() => setModal(false)} // Close when select backdrop
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <View style={styles.popup}>
            <Text style={styles.message}>{winner}</Text>
            <TouchableOpacity onPress={() => setModal(false)}>
              <Text
                style={{ color: "#241239", fontSize: 22, fontWeight: "bold" }}
              >
                Close
                {/* Button to close popup */}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151A21",
    alignItems: "center",
    justifyContent: "center"
  },
  square: {
    width: 0.387 * height,
    aspectRatio: 1,
    marginTop: 0.03 * height,
    marginBottom: 0.07 * height
  },
  row: {
    flexDirection: "row",
    flex: 1
  },
  button: {
    marginBottom: 0.05 * height,
    height: 0.07 * height,
    width: 0.21 * height,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    borderColor: "#E8488B",
    borderWidth: 2
  },
  text: {
    color: "#4575EF",
    fontSize: 20
  },
  popup: {
    height: 0.25 * height,
    width: 0.35 * height,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF"
  },
  message: {
    color: "#326C52",
    fontSize: 45,
    marginBottom: 0.06 * height,
    fontWeight: "bold"
  },
  left: {
    borderLeftWidth: 0
  },
  right: {
    borderRightWidth: 0
  },
  top: {
    borderTopWidth: 0
  },
  bottom: {
    borderBottomWidth: 0
  }
});
