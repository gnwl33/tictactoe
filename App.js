import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import Modal from "react-native-modal";
const { height } = Dimensions.get("window");

//Main App component further down!

class Cell extends React.Component {
  //Component for grid cells
  WhichIcon = index => {
    //Determine whether to render O or X
    let icon;
    let grid = this.props.grid_;
    let blank = (
      <View style={{ height: 0.125 * height, width: 0.125 * height }} />
    ); //No icon if unselected
    if (grid && grid.length) {
      //After grid has been initialized
      let player = grid[index[0]][index[1]];
      let O = ( //O mark
        <Animatable.View animation="bounceIn">
          {/* Animation */}
          <MaterialCommunityIcons
            name="radiobox-blank"
            size={0.1 * height}
            color="#4575EF"
          />
        </Animatable.View>
      );
      let X = ( //X mark
        <Animatable.View animation="bounceIn">
          <MaterialCommunityIcons
            name="close"
            size={0.11 * height}
            color="#E8488B"
          />
        </Animatable.View>
      );

      icon = player == 1 ? O : player == 2 ? X : blank;
      // Player 1 = O, Player 2 = X; blank when still unselected
    } else icon = blank; //to handle rendering before componentDidMount calls startGame()

    return icon;
  };

  render() {
    //Cell component returns the following
    return (
      <View style={[styles.cell, this.props.style_]}>
        <TouchableOpacity onPress={() => this.props.mark(this.props.index)}>
          {/* Call markCell() when pressed given index in grid */}
          {this.WhichIcon(this.props.index)}
        </TouchableOpacity>
      </View>
    );
  }
}

export default class App extends React.Component {
  state = { grid: [], player: 1, winner: "", end: 0, modal: false };
  //grid holds 2D array to represent state of game
  //player keeps track of whose turn it is (1 or 2)
  //winner has string of who wins
  //end signifies game is over and no further moves can be made
  //modal is true or false for if modal should be visible

  startGame = () => {
    this.setState({
      //Initialize with all 0's
      grid: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      player: 1,
      end: 0
    });
  };

  whoWins = (row, col) => {
    let grid = this.state.grid;

    if (grid && grid.length) {
      //If grid has been initialized
      let rowVal = grid[row][0];
      let colVal = grid[0][col];
      let diagVal = grid[1][1];

      //Only need to check rows and columns with the cell just selected
      if (rowVal == grid[row][1] && rowVal == grid[row][2]) return rowVal;
      if (colVal == grid[1][col] && colVal == grid[2][col]) return colVal;
      if (
        //Check diagonals, and make sure not to accept 0's
        diagVal != 0 &&
        ((diagVal == grid[0][0] && diagVal == grid[2][2]) ||
          (diagVal == grid[0][2] && diagVal == grid[2][0]))
      ) {
        return diagVal;
      }

      for (let i = 0; i < 3; i++) {
        //If there are still unselected cells, game is not over
        if (grid[i].includes(0)) return -1;
      }
      return 0; //Only possibility left is that there is a draw
    }
    return -1;
  };

  markCell = index => {
    if (this.state.end) return;
    let row = index[0];
    let col = index[1];
    let copyGrid = [...this.state.grid]; //Create a copy of the array to edit cell with index
    let currPlayer = copyGrid[row][col];
    if (!currPlayer) {
      //Can only change unselected cells
      copyGrid[row][col] = this.state.player;
      this.setState({ grid: copyGrid }); //Change the grid state

      let changePlayer = this.state.player == 1 ? 2 : 1; //Alternating turns, so switch players
      this.setState({ player: changePlayer });

      let winner = this.whoWins(row, col); //Check who is the winner, if there is one
      switch (winner) {
        case 1:
          this.setState({ modal: true, winner: "O Wins", end: 1 });
          break;
        case 2:
          this.setState({ modal: true, winner: "X Wins", end: 1 });
          break;
        case 0:
          this.setState({ modal: true, winner: "Draw", end: 1 });
      }
    }
  };

  componentDidMount() {
    //Initialize the game
    this.startGame();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          {/* Rows of cells */}
          <Cell
            grid_={this.state.grid}
            mark={this.markCell}
            index={[0, 0]} //Corresponds to grid
            style_={[styles.top, styles.left]} //Get rid of outside borders
          />
          <Cell
            grid_={this.state.grid}
            mark={this.markCell}
            index={[0, 1]}
            style_={styles.top}
          />
          <Cell
            grid_={this.state.grid}
            mark={this.markCell}
            index={[0, 2]}
            style_={[styles.top, styles.right]}
          />
        </View>
        <View style={styles.row}>
          <Cell
            grid_={this.state.grid}
            mark={this.markCell}
            index={[1, 0]}
            style_={styles.left}
          />
          <Cell grid_={this.state.grid} mark={this.markCell} index={[1, 1]} />
          <Cell
            grid_={this.state.grid}
            mark={this.markCell}
            index={[1, 2]}
            style_={styles.right}
          />
        </View>
        <View style={styles.row}>
          <Cell
            grid_={this.state.grid}
            mark={this.markCell}
            index={[2, 0]}
            style_={[styles.bottom, styles.left]}
          />
          <Cell
            grid_={this.state.grid}
            mark={this.markCell}
            index={[2, 1]}
            style_={styles.bottom}
          />
          <Cell
            grid_={this.state.grid}
            mark={this.markCell}
            index={[2, 2]}
            style_={[styles.bottom, styles.right]}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={this.startGame}>
          {/* Button for starting a new game at any time */}
          <Text style={styles.text}>New Game</Text>
        </TouchableOpacity>
        <Modal
          // Message that pops up to declare winner
          isVisible={this.state.modal}
          backdropTransitionOutTiming={0}
          onBackdropPress={() => this.setState({ modal: false })} // Close when select backdrop
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <View style={styles.popup}>
            <Text style={styles.message}>{this.state.winner}</Text>
            <TouchableOpacity onPress={() => this.setState({ modal: false })}>
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
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151A21",
    alignItems: "center",
    justifyContent: "center"
  },
  cell: {
    height: 0.129 * height,
    width: 0.129 * height,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#8E52FC",
    borderWidth: 5
  },
  row: {
    flexDirection: "row"
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
  },
  button: {
    marginTop: 0.09 * height,
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
