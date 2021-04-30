import firebase from "firebase/app";

export interface State {
  user: firebase.User | null;
}

export interface Config {
  tags: string[];
}

export class Equipo {
  id = "";
  tags: string[] = [];
  model = "";
  name = "";
  manufacture = "";
  location: firebase.firestore.DocumentReference | null = null; // ref
  notes = "";
  isTakingOut = true;
  isRemoved = false;

  constructor(init?: Partial<Equipo>) {
    Object.assign(this, init);
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  public toObject(): object {
    return Object.assign({}, this);
  }
}

export interface Location {
  ref: firebase.firestore.DocumentReference;
  text: string;
}
