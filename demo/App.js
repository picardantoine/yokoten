import React, { Component } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  Image
} from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";

const image = require("./src/images/bam.png");

export default class App extends Component<Props> {
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this.scroll
    );
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
  }
  scroll = () => setTimeout(this.scrollView.scrollToEnd, 0);

  render() {
    return (
      <ScrollView ref={component => (this.scrollView = component)}>
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
        <KeyboardSpacer />
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
  image: {
    width: "100%"
  },
  textInputContainer: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 20,
    marginBottom: 20
  }
});
