import "../styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { useAuth } from "../lib/auth";

type Props = {
  children: JSX.Element;
};

//Authコンポーネントで挟まれた要素を監視し、ユーザーアカウントが認証されていれば要素を返す
const Auth = ({ children }: Props): JSX.Element => {
  const isLoading = useAuth();

  return isLoading ? <p>Loading...</p> : children;
};

function MyApp({ Component, pageProps }: AppProps) {
  //認証されていればAuthに挟まれたComponentが返る
  return (
    <RecoilRoot>
      <Auth>
        <Component {...pageProps} />
      </Auth>
    </RecoilRoot>
  );
}

export default MyApp;
