/* eslint-disable react-hooks/exhaustive-deps */
import {
  useState,
  createContext,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { Contract, ethers, BigNumber } from "ethers";

import EacAggregatorProxyContractAbi from "../contract/abi/EACAggregatorProxyAbi.json";
import LumanagiPredictionV1Abi from "../contract/abi/LumanagiPredictionV1Abi.json";

import {
  EAC_AGGREGATOR_PROXY_ADDRESS,
  LUMANAGI_PREDICTION_V1_ADDRESS,
} from "../constants/contract";

type MetamaskContextType = {
  errorMessage: null | string;
  setErrorMessage: Dispatch<SetStateAction<string | null>>;
  account: null | string;
  setAccount: Dispatch<SetStateAction<string | null>>;
  balance: null | BigNumber;
  setBalance: Dispatch<SetStateAction<BigNumber | null>>;
  connectHandler: () => void;
  provider: ethers.providers.Web3Provider | null;
  eacAggregatorProxyContract: Contract | null;
  lumanagiPredictionV1Contract: Contract | null;
  postTransaction: (
    to: string,
    data: string,
    value?: number | BigNumber,
    from?: string,
    callback?: Function
  ) => void;
  getBalance: () => Promise<BigNumber>;
};

export const MetmaskContext = createContext<MetamaskContextType>({
  errorMessage: null,
  setErrorMessage: () => null,
  account: null,
  setAccount: () => null,
  balance: null,
  setBalance: () => null,
  connectHandler: () => {},
  provider: null,
  eacAggregatorProxyContract: null,
  lumanagiPredictionV1Contract: null,
  postTransaction: () => {},
  getBalance: () => Promise.resolve(BigNumber.from(0)),
});

const MetmaskContextProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [account, setAccount] = useState<null | string>(null);
  const [balance, setBalance] = useState<null | BigNumber>(null);
  const [provider, setProvider] =
    useState<null | ethers.providers.Web3Provider>(null);
  const [eacAggregatorProxyContract, setEacAggregatorProxyContract] =
    useState<null | Contract>(null);
  const [lumanagiPredictionV1Contract, setLumanagiPredictionV1Contract] =
    useState<null | Contract>(null);

  const [signer, setSigner] = useState<any | ethers.providers.JsonRpcSigner>(
    null
  );

  /**
   * Handles the account change event of metamask
   * @param newAccount New account address
   */

  const accountsChanged = async (newAccount: string) => {
    try {
      if (Array.isArray(newAccount) && newAccount.length > 0) {
        setAccount(newAccount[0]);
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [newAccount.toString(), "latest"],
        });
        setBalance(BigNumber.from(balance));
      } else {
        setAccount(newAccount);
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [newAccount.toString(), "latest"],
        });
        setBalance(BigNumber.from(balance));
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("There was a problem connecting to MetaMask");
    }
  };

  /**
   * Handles the chain change event of metamask
   */

  const chainChanged = () => {
    setErrorMessage(null);
    setAccount(null);
    setBalance(null);
  };

  /**
   * creates contract objects and assigs provider
   */

  const setContracts = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    //set Web3Provider
    setProvider(provider);
    //Connect All your contracts here
    const eacContract = new ethers.Contract(
      EAC_AGGREGATOR_PROXY_ADDRESS,
      EacAggregatorProxyContractAbi,
      provider
    );
    const lumangiContract = new ethers.Contract(
      LUMANAGI_PREDICTION_V1_ADDRESS,
      LumanagiPredictionV1Abi,
      provider
    );

    setEacAggregatorProxyContract(eacContract);
    setLumanagiPredictionV1Contract(lumangiContract);
  };

  /**
   * Connects The webapp to metamsk
   */

  const connectHandler = async () => {
    if (window.ethereum) {
      try {
        setSigner(provider?.getSigner());

        const res = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (res.length > 0) {
          await accountsChanged(res[0]);
        }
      } catch (err) {
        console.error(err);
        setErrorMessage("There was a problem connecting to MetaMask");
      }
    } else {
      setErrorMessage("Install MetaMask");
    }
  };
  /**
   *
   */
  const getBalance = async () => {
    if (window.ethereum) {
      try {
        if (window.ethereum.selectedAddress) {
          const balance = (await provider?.getBalance(
            window.ethereum.selectedAddress
          )) as BigNumber;

          return balance;
        }
        return BigNumber.from(0);
      } catch (error) {
        console.log("LL: getBalance -> error", error);
        throw error;
      }
    } else {
      throw new Error("Install MetaMask");
    }
  };

  /**
   * Handles post call of contracts
   * @param to smart contract address
   * @param data encoded abi of function
   * @param value value to be sent[Optional]
   * @param from from account[Optional]
   */

  const postTransaction = async (
    to: string,
    data: string,
    value?: BigNumber | number,
    from?: string,
    callback?: Function
  ) => {
    let signerTemp = (provider as ethers.providers.Web3Provider).getSigner();
    if (!signer) {
      connectHandler();
    }

    const fromTemp = from ? from : await signerTemp.getAddress();
    const tx = {
      from: fromTemp,
      to,
      value: value ? (value as BigNumber)._hex : undefined,
      data,
    };

    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [tx],
    });
    if (txHash) {
      if (callback) {
        callback(txHash);
      }
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", accountsChanged);
      window.ethereum.on("chainChanged", chainChanged);
      window.ethereum.on("disconnect", chainChanged);
      setContracts();
      if (window.ethereum.selectedAddress) {
        console.log(
          "LL: window.ethereum.selectedAddress",
          window.ethereum.selectedAddress
        );
        setAccount(window.ethereum.selectedAddress);
        (async () => {
          const balace = await getBalance();
          setBalance(balace);
        })();
      }
    }
    return () => {
      setProvider(null);
      setEacAggregatorProxyContract(null);
    };
  }, []);

  return (
    <MetmaskContext.Provider
      value={{
        errorMessage,
        setErrorMessage,
        account,
        setAccount,
        balance,
        setBalance,
        connectHandler,
        provider,
        eacAggregatorProxyContract,
        lumanagiPredictionV1Contract,
        postTransaction,
        getBalance,
      }}
    >
      {children}
    </MetmaskContext.Provider>
  );
};

export default MetmaskContextProvider;
