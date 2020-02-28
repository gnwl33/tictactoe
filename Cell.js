import React from "react";
import { StyleSheet, View, Dimensions, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
const { height } = Dimensions.get("window");

const Cell = ({ grid, mark, row, col, style_ }) => {
  //Component for grid cells
  const WhichIcon = (row, col) => {
    //Determine whether to render O or X
    let icon;
    let blank /* * DYNAMIC SIZE * */ = (
      <View
        style={{
          height: (0.375 / grid.length) * height,
          width: (0.375 / grid.length) * height
        }}
      />
    ); //No icon if unselected

    if (grid && grid.length) {
      //After grid has been initialized
      let player = grid[row][col];

      let O = ( //O mark
        <Animatable.View animation="bounceIn">
          <MaterialCommunityIcons
            name="radiobox-blank"
            size={(0.3 / grid.length) * height}
            color="#4575EF"
          />
        </Animatable.View>
      );

      let X = ( //X mark
        <Animatable.View animation="bounceIn">
          <MaterialCommunityIcons
            name="close"
            size={(0.33 / grid.length) * height}
            color="#E8488B"
          />
        </Animatable.View>
      );

      icon = player == 1 ? O : player == 2 ? X : blank;
      // Player 1 = O, Player 2 = X; blank when still unselected
    } else icon = blank; //to handle rendering before componentDidMount calls startGame()

    return icon;
  };

  //Cell component returns the following
  return (
    <View style={[style_, styles.cell]}>
      <TouchableOpacity onPress={() => mark(row, col)}>
        {/* Call markCell() when pressed given index in grid */}
        {WhichIcon(row, col)}
      </TouchableOpacity>
    </View>
  );
};
export default Cell;

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#8E52FC",
    borderWidth: 5
  }
});
