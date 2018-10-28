// @flow

import * as Yup from "yup";
import React, { PureComponent } from "react";
import {
  ScrollView,
  Keyboard,
  View,
  StyleSheet,
  Alert,
  DeviceEventEmitter
} from "react-native";
import { Formik } from "formik";
import firebase from "react-native-firebase";
import { Link, Button, Text } from "src/components";
import i18n from "src/lib/i18n";
import theme from "src/theme";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { TextInput, Form } from ".";

type PropsType = {
  validationSchema: any,
  submitLabel: string,
  onSubmit: Function,
  isLoading: boolean,
  isSignin?: boolean
};

type StateType = {
  askNewPassword: boolean
};

export default class AuthForm extends PureComponent<PropsType, StateType> {
  state = {
    askNewPassword: false
  };

  static defaultProps = {
    showResetPassworkLink: false
  };

  scrollView: any;
  keyboardDidShowListener: *;

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

  sendResetPasswordEmail = (email: string) =>
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        DeviceEventEmitter.emit("stackbar.display", {
          message: i18n.t("signin.reinitializePassword.confirmation"),
          theme: "success"
        });
      })
      .catch(e => {
        if (e.code === "auth/user-not-found") {
          DeviceEventEmitter.emit("stackbar.display", {
            message: i18n.t("signin.reinitializePassword.confirmation"),
            theme: "success"
          });
        } else {
          DeviceEventEmitter.emit("stackbar.display", {
            message: i18n.t("errors.generic"),
            theme: "warning"
          });
        }
      });

  onPressReset = (email: string, setFieldError: Function) => {
    Keyboard.dismiss();
    this.setState({ askNewPassword: true });

    if (!email) {
      setFieldError("password", "");
      setFieldError("email", i18n.t("signin.errors.missingEmail"));
      return;
    }

    const isValidEmail = Yup.string()
      .email()
      .isValidSync(email);

    if (!isValidEmail) {
      setFieldError("password", "");
      setFieldError("email", i18n.t("signup.errors.emailFormat"));
      return;
    }

    // Workaround blabla https://github.com/facebook/react-native/issues/17356
    setTimeout(() =>
      Alert.alert(
        i18n.t("signin.reinitializePassword.title"),
        i18n.t("signin.reinitializePassword.message", { email }),
        [
          {
            text: i18n.t("signin.reinitializePassword.cancel"),
            onPress: () => {}
          },
          {
            text: i18n.t("signin.reinitializePassword.validate"),
            onPress: () => this.sendResetPasswordEmail(email)
          }
        ],
        { cancelable: false }
      )
    );
  };

  render() {
    const { submitLabel, onSubmit, validationSchema, isLoading } = this.props;
    return (
      <>
        <Formik
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          render={(props: {
            submitCount: number,
            submitForm: Function,
            setFieldError: Function,
            values: Object
          }) => {
            return (
              <Form>
                <ScrollView ref={component => (this.scrollView = component)}>
                  <Text style={styles.fieldName}>
                    {i18n.t("authform.email")}
                  </Text>
                  <TextInput
                    placeholder="Email"
                    name="email"
                    keyboardType="email-address"
                    formSubmittedOnce={
                      !!props.submitCount || this.state.askNewPassword
                    }
                  />
                  <Text style={styles.fieldName}>
                    {this.props.isSignin
                      ? i18n.t("authform.signinPassword")
                      : i18n.t("authform.signupPassword")}
                  </Text>
                  <TextInput
                    placeholder="Mot de passe"
                    name="password"
                    secureTextEntry
                    formSubmittedOnce={!!props.submitCount}
                  />

                  {this.props.isSignin && (
                    <Link
                      style={styles.signin}
                      text={i18n.t("signin.forgottenPasword")}
                      onPress={() =>
                        this.onPressReset(
                          props.values.email,
                          props.setFieldError
                        )
                      }
                    />
                  )}
                  <View style={styles.buttonContainer}>
                    <Button
                      big
                      textColor={theme.colors.gray}
                      title={submitLabel}
                      onPress={props.submitForm}
                      isLoading={isLoading}
                    />
                  </View>
                </ScrollView>
                <KeyboardSpacer />
              </Form>
            );
          }}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  signin: {
    marginBottom: 2 * theme.margin
  },
  buttonContainer: {
    alignItems: "center",
    ...theme.fonts.default,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    marginHorizontal: 2 * theme.margin,
    marginVertical: 2 * theme.margin
  },
  fieldName: {
    ...theme.fonts.mediumTitle,
    marginLeft: 2 * theme.margin,
    marginTop: 2 * theme.margin,
    marginBottom: theme.margin
  }
});
