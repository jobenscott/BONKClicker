// TODO: SignMessage
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import { FC, useCallback, useContext } from 'react';
import { sign } from 'tweetnacl';
import { notify } from "../utils/notifications";
import axios from "axios";
import { useRouter } from "next/router";
import { Context } from "../context";

export const SignMessage: FC = ({ }) => {

    // state
    const {
        state: { user },
        dispatch,
    } = useContext(Context);
    // const { user } = state;

    // router
    const router = useRouter();

    const { publicKey, signMessage } = useWallet();

    const onClick = useCallback(async () => {
        try {
            // `publicKey` will be null if the wallet isn't connected
            if (!publicKey) throw new Error('Wallet not connected!');
            // `signMessage` will be undefined if the wallet doesn't support it
            if (!signMessage) throw new Error('Wallet does not support message signing!');
            // Encode anything as bytes
            const message = new TextEncoder().encode('Hello, world!');
            // Sign the bytes using the wallet
            const signature = await signMessage(message);
            // Verify that the bytes were signed using the private key that matches the known public key
            if (!sign.detached.verify(message, signature, publicKey.toBytes())) throw new Error('Invalid signature!');
            notify({ type: 'success', message: 'Sign message successful!', txid: bs58.encode(signature) });
            let pw = bs58.encode(signature);
            console.log(pw);
            const { data } = await axios.post(`/api/login`, {
                address: publicKey,
                password: pw,
            });
            // console.log("REGISTER RESPONSE", data);
            dispatch({
                type: "LOGIN",
                payload: data,
            });
            // save in local storage
            window.localStorage.setItem("user", JSON.stringify(data));
            console.log('sucess!');
            // redirect
            // router.push("/user");
        } catch (error: any) {
            notify({ type: 'error', message: `Sign Message failed!`, description: error?.message });
            console.log('error', `Sign Message failed! ${error?.message}`);
        }
    }, [publicKey, notify, signMessage]);

    return (
        <div>
            <button
                className="group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "
                onClick={onClick} disabled={!publicKey}
            >
                {/* {!signMessage && */}
                    <span className="block group-disabled:hidden" >
                        {!publicKey ? 'Connect Wallet' : 'Login'}
                    </span>
                {/* } */}
            </button>
        </div>
    );
};
