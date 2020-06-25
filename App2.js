import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput
} from "react-native";
import Modal from "react-native-modal";
import Cell from "./Cell";
const { height } = Dimensions.get("window");

const App = () => {
  //grid holds 2D array to represent state of game
  const [grid, setGrid] = useState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ]);
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

  startGame = () => {
    let arr = new Array(size);
    arr.fill(0, 0, size); //Initialize with all 0's
    arr.forEach((row, index, arr) => {
      arr[index] = new Array(size);
      arr[index].fill(0, 0, size);
    });

    setGrid(arr);
    console.log(arr[0][0]);
    setPlayer(1);
    setEnd(0);
  };

  whoWins = (row, col) => {
    let len = grid.length;

    if (grid && len) {
      //If grid has been initialized
      let rowVal = grid[row][0];
      let colVal = grid[0][col];
      let diagVal = grid[1][1];

      //Only need to check rows and columns with the cell just selected
      for (let i = 0, j = 0, k = 0; i < len, j < len, k < len; i++, j++, k++) {
        if (grid[row][i] != rowVal) break;
        if (grid[j][col] != colVal) break;
        if (grid[k][k] != diagVal || grid[k][grid.len - 1 - k] != diagVal)
          break;
      }

      if (i == len) return rowVal;
      if (j == len) return colVal;
      if (k == len) return diagVal;

      for (let i = 0; i < len; i++) {
        //If there are still unselected cells, game is not over
        if (grid[i].includes(0)) return -1;
      }
      return 0; //Only possibility left is that there is a draw
    }
    return -1;
  };

  markCell = index => {
    if (end) return;
    let row = index[0];
    let col = index[1];
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
          setModal(true);
          setWinner("O Wins");
          setEnd(1);
          break;
        case 2:
          setModal(true);
          setWinner("X Wins");
          setEnd(1);
          break;
        case 0:
          setModal(true);
          setWinner("Draw");
          setEnd(1);
      }
    }
  };

  // useEffect(() => {
  //   //Initialize the game
  //   this.startGame();
  // });

  return (
    <View style={styles.container}>
      {grid.map((row, index) => (
        <View style={styles.row} key={index}>
          {row.map((cell, col) => (
            <Cell
              grid_={grid}
              mark={markCell}
              index={[index, col]} //Corresponds to grid
              key={"" + index + col}
            />
          ))}
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={this.startGame}>
        {/* Button for starting a new game at any time */}
        <Text style={styles.text}>New Game</Text>
      </TouchableOpacity>
      {/* Button for starting a new game at any time */}
      <TextInput
        placeholder="3"
        placeholderTextColor="#4575EF"
        textAlign="center"
        style={[styles.button, styles.text]}
        onSubmitEditing={event => {
          if (!isNaN(event)) {
            setSize(event);
            startGame();
          }
        }}
      />
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
  row: {
    flexDirection: "row"
  },
  // left: {
  //   borderLeftWidth: 0
  // },
  // right: {
  //   borderRightWidth: 0
  // },
  // top: {
  //   borderTopWidth: 0
  // },
  // bottom: {
  //   borderBottomWidth: 0
  // },
  button: {
    marginTop: 0.05 * height,
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
  }
});
