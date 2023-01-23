/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useState, useRef } from "react";
import { BigNumber, Contract } from "ethers";
import { MetmaskContext } from "../contexts/MetmaskContextProvider";
import Timer from "../components/Timer";
import Button from "../UI/Button";
import {
  LUMANAGI_PREDICTION_V1_ADDRESS,
  PREVIOUS_ROUNDS,
  NEXT_ROUNDS,
} from "../constants/contract";
import { convertEpochToDate, getSecondsDiffrence } from "../utils/index";

import {
  postBetBearAbi,
  postBetBullAbi,
  getUserRounds,
  postClaimAbi,
  getEpochDetails,
  getCurrentEpoch,
} from "../contract/functions/lumangiPredicationV1";
import {
  getLatestAnswer,
  getDescription,
} from "../contract/functions/eacAggregatorProxy";
import Prev from "../components/card/Prev";
import Live from "../components/card/Live";
import Next from "../components/card/Next";
import { ReactComponent as Back } from "../assets/images/back.svg";
import lumangiLogoPng from "../assets/images/lumangi.png";

import AnimatedNumber from "../common/AnimatedNumber";
import { SCROLL_AMOUNT } from "../constants/common";

const Tabs = () => {
  return (
    <>
      <div className="mx-20">
        <Button color={"secondary"} label="Crypto" size={"sm"} />
        <Button
          color="default"
          label="Stock"
          size={"sm"}
          customStyle="!text-white ml-2"
        />
      </div>
    </>
  );
};

const Dashboard: React.FC<{}> = () => {
  const {
    lumanagiPredictionV1Contract,
    postTransaction,
    eacAggregatorProxyContract,
    getBalance,
    account,
  } = useContext(MetmaskContext);
  const [userRounds, setUserRounds] = useState<any>({});
  const [rounds, setRounds] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [calculating, setCalculating] = useState<boolean>(true);
  const [currentEpoch, setCurrentEpoch] = useState<number>(-1);
  const [disableUpDown, setDisableUpDown] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<null | number>(null);
  const [minutes, setMinutes] = useState<null | number>(null);
  const [descrition, setDescription] = useState<string>("null");
  const [oldest, setOldest] = useState<any>(null);

  const [latestAnswer, setLatestAnswer] = useState<null | number>(null);
  const [prevAnswer, setPrevAnswer] = useState<number>(0);

  const cardsContainer = useRef<HTMLDivElement>(null);

  const setDisplayData = async (selectedEpoch: number) => {
    const epochIds = [];
    const tempRounds = [];
    for (let index = PREVIOUS_ROUNDS + 1; index > 0; index--) {
      epochIds.push(selectedEpoch - index);
      tempRounds.push({
        live: true,
        active: false,
        epoch: selectedEpoch - index,
      });
    }
    epochIds.push(selectedEpoch);
    tempRounds.push({
      live: true,
      active: true,
      epoch: selectedEpoch,
    });
    for (let index = 1; index <= NEXT_ROUNDS; index++) {
      epochIds.push(selectedEpoch + index);
      tempRounds.push({
        live: false,
        active: index > 1 ? false : true,
        epoch: selectedEpoch + index,
      });
    }
    setRounds(tempRounds);
    const allData = await getRoundsData(tempRounds);

    setCurrentEpoch(selectedEpoch);
    const lockEpochDataTimpStamp = allData[PREVIOUS_ROUNDS + 1].lockTimestamp;
    const secondsData = getSecondsDiffrence(
      new Date(),
      convertEpochToDate(lockEpochDataTimpStamp)
    );
    if (secondsData > 0) {
      setSeconds(secondsData % 60);
      setMinutes(secondsData < 60 ? 0 : Math.floor(secondsData / 60));
      setCalculating(false);
    }
    if (account) {
      const userRounds = await getUserRounds(
        lumanagiPredictionV1Contract as Contract,
        account
      );
      setUserRounds(userRounds);
    }

    setOldest(allData[0]);
    setRounds(allData.filter((data, index) => index !== 0));
  };
  /**
   * Handles callback for start round event
   * @param epoch Epoch of newly started round
   */

  const startRoundCallback = async (epoch: BigNumber) => {
    const newEpoch = Number(epoch);
    setDisableUpDown(false);
    setLoading(true);
    setDisplayData(newEpoch);
    setLoading(false);
  };

  /**
   * Handles callback for Lock round event
   */

  const lockRoundCallback = async (
    epoch: BigNumber,
    roundId: BigNumber,
    price: BigNumber
  ) => {};

  /**
   * Handles callback for end round event
   */

  const endRoundCallback = async () => {};

  /**
   * Handles click of enter up button
   * @param amount: amount to be sent as bet
   */

  const betBearHandler = async (amount: Number) => {
    if (lumanagiPredictionV1Contract) {
      const abi = await postBetBearAbi(
        lumanagiPredictionV1Contract,
        currentEpoch
      );

      postTransaction(
        LUMANAGI_PREDICTION_V1_ADDRESS,
        abi,
        BigNumber.from(amount),
        undefined,
        () => {
          setDisableUpDown(true);
          setUserRounds({
            ...userRounds,
            [Number(currentEpoch)]: {
              claimable: false,
              claimed: false,
            },
          });
        }
      );
    }
  };

  /**
   * Handles click of enter down button
   * @param amount: amount to be sent as bet
   */

  const betBullHandler = async (amount: Number) => {
    if (lumanagiPredictionV1Contract) {
      const abi = await postBetBullAbi(
        lumanagiPredictionV1Contract,
        currentEpoch
      );

      postTransaction(
        LUMANAGI_PREDICTION_V1_ADDRESS,
        abi,
        BigNumber.from(amount),
        undefined,
        () => {
          setDisableUpDown(true);
          setUserRounds({
            ...userRounds,
            [Number(currentEpoch)]: {
              claimable: false,
              claimed: false,
            },
          });
        }
      );
    }
  };

  /**
   * Handles claiming of the round
   * @param epoch round number to be claimed
   */

  const postClaim = async (epoch: BigNumber) => {
    if (lumanagiPredictionV1Contract) {
      const abi = await postClaimAbi(lumanagiPredictionV1Contract, [epoch]);
      postTransaction(
        LUMANAGI_PREDICTION_V1_ADDRESS,
        abi,
        undefined,
        undefined,
        () => {
          setUserRounds({
            ...userRounds,
            [Number(epoch)]: {
              claimable: true,
              claimed: true,
            },
          });
        }
      );
    }
  };

  /**
   * Gets all display round details for display
   * @param epochArray
   * @returns All display round details
   */

  const getRoundsData = (epochArray: any[]) =>
    Promise.all(
      epochArray.map(async (epochInfo: any, index: number) => {
        const epochDetails = await getEpochDetails(
          lumanagiPredictionV1Contract as Contract,
          BigNumber.from(epochInfo.epoch)
        );
        return {
          ...epochDetails,
          ...epochInfo,
        };
      })
    );

  /**
   * Gets Latest price of the currency
   */

  const getLatestPrice = async () => {
    if (eacAggregatorProxyContract) {
      const latestAnswerTemp = await getLatestAnswer(
        eacAggregatorProxyContract
      );
      setPrevAnswer(latestAnswer ? latestAnswer : 0);
      setLatestAnswer(latestAnswerTemp);
    }
  };

  /**
   * Intial function calls for lumangi predication contracts
   */
  useEffect(() => {
    if (lumanagiPredictionV1Contract) {
      setLoading(true);
      lumanagiPredictionV1Contract.on("StartRound", startRoundCallback);
      lumanagiPredictionV1Contract.on("LockRound", lockRoundCallback);
      lumanagiPredictionV1Contract.on("EndRound", endRoundCallback);
      (async () => {
        const currentEpoch = await getCurrentEpoch(
          lumanagiPredictionV1Contract
        );
        await setDisplayData(currentEpoch);
        await getBalance();

        setLoading(false);
        if (cardsContainer.current) {
          cardsContainer.current.scrollLeft =
            cardsContainer.current.offsetWidth - 750;
        }
      })();
    }
  }, [lumanagiPredictionV1Contract]);

  /**
   * Intial function calls for Eac contract
   */
  useEffect(() => {
    setInterval(async () => {
      getLatestPrice();
    }, 10000);
    if (eacAggregatorProxyContract) {
      (async () => {
        await getLatestPrice();
        setDescription(await getDescription(eacAggregatorProxyContract));
      })();
    }
    const element = document.getElementById("cards-data") as any;
    if (element) {
      element.addEventListener("wheel", function (e: any) {
        e.preventDefault();
        element.scrollLeft = element.scrollLeft + e.deltaY;
      });
    }
  }, [eacAggregatorProxyContract]);

  const scrollCards = (where: "left" | "right") => {
    if (cardsContainer.current) {
      if (where === "left") {
        cardsContainer.current.scrollLeft -= SCROLL_AMOUNT;
      } else {
        cardsContainer.current.scrollLeft += SCROLL_AMOUNT;
      }
    }
  };

  return (
    <div className="w-full">
      <Tabs />
      <div className="flex items-center mx-20">
        <div className="justify-center w-1/5 text-center ">
          {loading ? (
            <div className="flex items-center justify-center w-48 text-white bg-[#259da822] rounded p-2 ">
              Loading...
            </div>
          ) : (
            <div className="flex items-center justify-center w-48 text-white bg-[#259da822] rounded p-2 ">
              <div className="mr-1">
                {descrition.replaceAll(" ", "").replace("/", "")}
              </div>
              <div className="text-xs">
                <AnimatedNumber
                  n={latestAnswer ? latestAnswer : 0}
                  from={prevAnswer}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center w-3/5 poi">
          <Back
            className="cursor-pointer stroke-white fill-white"
            onClick={() => scrollCards("left")}
          />
          <img src={lumangiLogoPng} alt="logo" className="w-10 h-10 mx-2" />
          <Back
            className="rotate-180 cursor-pointer stroke-white fill-white"
            onClick={() => scrollCards("right")}
          />
        </div>
        <div className="w-1/5">
          <Timer
            seconds={seconds}
            minutes={minutes}
            setSeconds={setSeconds}
            setMinutes={setMinutes}
            setDisableUpDown={setDisableUpDown}
            setCalculating={setCalculating}
          />
        </div>
      </div>
      <div
        className="grid grid-flow-col auto-cols-[100%] grid-rows-none gap-10 mt-10  w-100 card-data sm:auto-cols-[35%] md:auto-cols-[20%] lg:auto-cols-[20%] xl:auto-cols-[20%] 2xl:auto-cols-[20%] !overflow-x-auto w-screen px-8"
        id="cards-data"
        style={{
          height: "450px",
          overflowY: "visible",
          scrollBehavior: "smooth",
        }}
        ref={cardsContainer}
      >
        {rounds.map((data, index) => {
          if (data.epoch < currentEpoch) {
            return (
              <React.Fragment key={index}>
                <Prev
                  active={data.epoch === currentEpoch - 1}
                  minutes={minutes as number}
                  seconds={seconds as number}
                  epoch={data.epoch}
                  latestAnswer={latestAnswer as number}
                  closePrice={data.closePrice}
                  prevClosePrice={
                    index > 0
                      ? rounds[index - 1]?.closePrice || 0
                      : oldest?.closePrice || 0
                  }
                  totalAmount={data.totalAmount}
                  totalAmountDisplay={data.totalAmountDisplay}
                  loading={loading}
                  bearAmount={data.bearAmount}
                  bullAmount={data.bullAmount}
                  postClaim={postClaim}
                  userRounds={userRounds}
                  lockPrice={data.lockPrice}
                  calculating={calculating}
                  prevAnswer={prevAnswer}
                />
              </React.Fragment>
            );
          } else if (data.epoch === currentEpoch) {
            return (
              <React.Fragment key={index}>
                <Live
                  epoch={data.epoch}
                  loading={loading}
                  betBearHandler={betBearHandler}
                  betBullHandler={betBullHandler}
                  disableUpDown={disableUpDown}
                  userRounds={userRounds}
                />
              </React.Fragment>
            );
          } else {
            return (
              <React.Fragment key={index}>
                <Next epoch={data.epoch} loading={loading} />
              </React.Fragment>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Dashboard;
