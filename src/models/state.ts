import firebase from "firebase";

export interface State {
  user: firebase.User | null;
}
