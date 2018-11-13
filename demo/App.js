import React, { Component } from "react";
import { StyleSheet, View, TextInput, Image } from "react-native";

const image = require("./src/images/bam.png");

export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.pageContainer}>
        <View style={styles.textInputContainer}>
          <TextInput placeholder="Ecrivez quelquechose" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pageContainer: {
    paddingTop: 20,
    paddingHorizontal: 20
  },
  textInputContainer: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 20,
    marginBottom: 20
  }
});
