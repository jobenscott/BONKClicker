import TopNav from "../components/TopNav";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "../public/css/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "../context";
import { AppProps } from "next/app";
import {AppBar} from "../components/AppBar";
import { ContextProvider } from '../context/ContextProvider';


require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <ContextProvider>
      <ToastContainer position="top-center" />
      <AppBar/>
      <TopNav />
      <Component {...pageProps} />
      </ContextProvider>
    </Provider>
  );
}

export default MyApp;