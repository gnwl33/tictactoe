import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");

class Cell extends React.Component {
  WhatIcon = index => {
    let icon;
    if (this.props.grid && this.props.grid.length) {
      let player = this.props.grid[index[0]][index[1]];

      let O = (
        <MaterialCommunityIcons
          name="radiobox-blank"
          size={0.12 * height}
          color="#01FFFF"
        />
      );
      let X = (
        <MaterialCommunityIcons
          name="close"
          size={0.14 * height}
          color="#01FFC3"
        />
      );

      icon = player == 1 ? O : player == 2 ? X : <View />;
    } else icon = <View />;

    return icon;
  };

  render() {
    return (
      <View style={[styles.cell, this.props.style_]}>
        <TouchableOpacity onPress={() => this.props.mark(this.props.index)}>
          {this.WhatIcon(this.props.index)}
        </TouchableOpacity>
      </View>
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.markCell = this.markCell.bind(this);
  }

  state = { gridState: [], player: 1 };

  startGame = () => {
    this.setState({
      gridState: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ]
    });
  };

  markCell = index => {
    let row = index[0];
    let col = index[1];
    let copyGrid = [...this.state.gridState];
    if (copyGrid[row][col] == 0) {
      copyGrid[row][col] = this.state.player;
      this.setState({ gridState: copyGrid });

      let change = this.state.player == 1 ? 2 : 1;
      this.setState({ player: change });
    }
  };

  componentDidMount() {
    this.startGame();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Cell
            grid={this.state.gridState}
            mark={this.markCell}
            index={[0, 0]}
            style_={[styles.top, styles.left]}
          />
          <Cell
            grid={this.state.gridState}
            mark={this.markCell}
            index={[0, 1]}
            style_={styles.top}
          />
          <Cell
            grid={this.state.gridState}
            mark={this.markCell}
            index={[0, 2]}
            style_={[styles.top, styles.right]}
          />
        </View>
        <View style={styles.row}>
          <Cell
            grid={this.state.gridState}
            mark={this.markCell}
            index={[1, 0]}
            style_={styles.left}
          />
          <Cell
            grid={this.state.gridState}
            mark={this.markCell}
            index={[1, 1]}
          />
          <Cell
            grid={this.state.gridState}
            mark={this.markCell}
            index={[1, 2]}
            style_={styles.right}
          />
        </View>
        <View style={styles.row}>
          <Cell
            grid={this.state.gridState}
            mark={this.markCell}
            index={[2, 0]}
            style_={[styles.bottom, styles.left]}
          />
          <Cell
            grid={this.state.gridState}
            mark={this.markCell}
            index={[2, 1]}
            style_={styles.bottom}
          />
          <Cell
            grid={this.state.gridState}
            mark={this.markCell}
            index={[2, 2]}
            style_={[styles.bottom, styles.right]}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#29303B",
    alignItems: "center",
    justifyContent: "center"
  },
  cell: {
    height: 0.15 * height,
    width: 0.15 * height,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#FFB3FD",
    borderWidth: 7
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
  }
});
