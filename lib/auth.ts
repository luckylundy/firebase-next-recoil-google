import { useEffect, useState } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import {
  User,
  getAuth,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { app } from "./firebase";

type UserState = User | null;

//useRecoilのatomを使い、ユーザーのログイン状態を保持する
const userState = atom<UserState>({
  key: "userState",
  default: null,
  dangerouslyAllowMutability: true,
});

export const login = (): Promise<void> => {
  //googleプロバイダオブジェクトを作成
  const provider = new GoogleAuthProvider();
  //アプリ構築キットのfirebase SDKの情報をauthに代入
  const auth = getAuth(app);
  //認証するアプリとgoogleプロバイダオブジェクトを引数にとり、ログインする
  return signInWithRedirect(auth, provider);
};

export const logout = (): Promise<void> => {
  const auth = getAuth(app);
  return signOut(auth);
};

//ユーザー認証を監視する
export const useAuth = (): boolean => {
  //onAuthStateChangedを実行中かどうかの状態を定義
  const [isLoading, setIsLoading] = useState(true);
  //useRecoilのsetUser関数を呼び出す
  const setUser = useSetRecoilState(userState);

  //setUser関数に変化がある時useEffectが発火
  useEffect(() => {
    //認証するappをauthに代入
    const auth = getAuth(app);
    //ユーザー認証を監視し、変更があれば引数のコールバック関数を実行する
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
  }, [setUser]);
  //最後にisLoadingをfalseで返し、コールバック関数の実行を止める
  return isLoading;
};

//userStateを他のコンポーネントで呼び出す
export const useUser = (): UserState => {
  return useRecoilValue(userState);
};
