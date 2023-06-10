import React, { useState, useEffect } from "react";
import fetch from "node-fetch";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { contractABI, contractAddress } from "@/lib/constants";

export const TransactionContext = React.createContext();

let eth;

// get ethereum Object
if (typeof window !== "undefined") {
    eth = window.ethereum;
}

// get deployed contract
const getAtomicCloakContract = () => {
    const provider = new ethers.providers.Web3Provider(eth);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
    );
    return transactionContract;
};

export const TransactionProvider = ({ children }) => {
    const router = useRouter();
    // global app states
    const [currentAccount, setCurrentAccount] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        addressTo: "",
        amount: "",
        receivingChainID: "",
    });

    // check connection of wallet
    useEffect(() => {
        checkIfWallterIsConnected();
    }, []);

    // to connect to the wallet
    const connectWallet = async (metamask = eth) => {
        try {
            if (!metamask) return alert("Please install metamask ");

            const accounts = await metamask.request({
                method: "eth_requestAccounts",
            });

            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.error(error);
            throw new Error("No ethereum object.");
        }
    };

    // to check wallet connection
    const checkIfWallterIsConnected = async (metamask = eth) => {
        try {
            if (!metamask) return alert("Please install metamask ");
            const accounts = await metamask.request({ method: `eth_accounts` });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
                console.log("Wallet is already connected");
            }
        } catch (error) {
            console.error(error);
            throw new Error("No ethereum object.");
        }
    };

    /* 
    to send transaction 
    */
    const sendOpenSwapTransaction = async (
        metamask = eth,
        connectedAccount = currentAccount
    ) => {
        console.log("sendOpenSwapTransaction");
        try {
            if (!metamask) return alert("Please install metamask ");

            const { addressTo, amount, receivingChainID } = formData;

            // get AtomicCloak contract
            const atomicCloak = getAtomicCloakContract();

            const parsedAmount = ethers.utils.parseEther(amount);

            const secret = ethers.utils.randomBytes(32);
            console.log("Secret: ", Buffer.from(secret).toString("hex"));
            const [qx, qy] = await atomicCloak.commitmentFromSecret(secret);
            console.log("qx:", qx._hex);
            console.log("qy:", qy._hex);
            const recipient = "0xBDd182877dEc564d96c4A6e21920F237487d01aD";
            const provider = new ethers.providers.Web3Provider(eth);
            const blockNumBefore = await provider.getBlockNumber();
            const blockBefore = await provider.getBlock(blockNumBefore);
            const timestampBefore = blockBefore.timestamp;

            const trs = await atomicCloak.openETH(
                qx,
                qy,
                recipient,
                timestampBefore + 120,
                {
                    value: parsedAmount,
                }
            );
            // setting app state
            setIsLoading(true);
            setFormData({
                addressTo: "",
                amount: "",
                receivingChainID: "",
            });
            const receipt = await trs.wait();
            console.log("receipt:", receipt);

            const response = await fetch("http://localhost:7777/api/v1/swap", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    z: Buffer.from(secret).toString("hex"),
                    qx: qx._hex,
                    qy: qy._hex,
                    addressTo: addressTo,
                    receivingChainID: receivingChainID,
                    value: parsedAmount.toString(),
                }),
            });

            const data = await response.text();

            console.log(data);

            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    // handle form data
    const handleChange = (e, name) => {
        setFormData((prevState) => ({
            ...prevState,
            [name]: e.target.value,
        }));
    };

    // Triger Loading Model
    useEffect(() => {
        if (isLoading) {
            router.push(`/?loading=${currentAccount}`);
        } else {
            router.push("/");
        }
    }, [isLoading]);

    return (
        <TransactionContext.Provider
            value={{
                currentAccount,
                connectWallet,
                sendOpenSwapTransaction,
                handleChange,
                formData,
                isLoading,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
};
