import React, { Component } from "react";
import { ScrollView, StyleSheet, View, TextInput, Image } from "react-native";

const image = require("./src/images/bam.png");

export default class App extends Component<Props> {
  render() {
    return (
      <ScrollView>
        <View style={styles.pageContainer}>
          <View style={{ width: "100%" }}>
            <Image
              style={styles.imageContainer}
              resizeMode="center"
              source={image}
            />
          </View>
          <View style={styles.textInputContainer}>
            <TextInput placeholder="Ecrivez quelquechose" />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  pageContainer: {
    paddingTop: 20,
    paddingHorizontal: 20
  },
  imageContainer: {
    width: "100%",
    height: 400
  },
  textInputContainer: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 20,
    marginBottom: 20
  }
});
