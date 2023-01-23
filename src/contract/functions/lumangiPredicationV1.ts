import { BigNumber, Contract } from "ethers";
import { getMaticValue } from "../../utils/index";
export const getMinBetAmount = async (contract: Contract) => {
  try {
    const betAmount: BigNumber = await contract.minBetAmount();
    return betAmount;
  } catch (error) {
    console.log("LL: getLatestRound -> error", error);
    throw error;
  }
};

export const postBetBearAbi = async (contract: Contract, epoch: number) => {
  try {
    return contract.interface.encodeFunctionData("betBear", [epoch]);
  } catch (error) {
    console.log("LL: getLatestRound -> error", error);
    throw error;
  }
};

export const postBetBullAbi = async (contract: Contract, epoch: number) => {
  try {
    return contract.interface.encodeFunctionData("betBull", [
      BigNumber.from(epoch),
    ]);
  } catch (error) {
    console.log("LL: getLatestRoundData -> error", error);
    throw error;
  }
};

export const getCurrentEpoch = async (contract: Contract) => {
  try {
    const latestRoundData: BigNumber = await contract.currentEpoch();
    return Number(latestRoundData);
  } catch (error) {
    console.log("LL: getCurrentEpoch -> error", error);
    throw error;
  }
};
export const getUserRoundsLength = async (contract: Contract) => {
  try {
    const latestRoundData: BigNumber = await contract.currentEpoch();
    return Number(latestRoundData);
  } catch (error) {
    console.log("LL: getCurrentEpoch -> error", error);
    throw error;
  }
};

export const getClaimable = async (
  contract: Contract,
  epoch: number,
  user: string
) => {
  try {
    const isClaimable: boolean = await contract.claimable(
      BigNumber.from(epoch),
      user
    );
    return isClaimable;
  } catch (error) {
    console.log("LL: error", error);
    throw error;
  }
};

export const getUserRounds = async (
  contract: Contract,
  user: string,
  cursor: Number = 0,
  size: Number = 1000
) => {
  try {
    const allRounds = await contract.getUserRounds(user, cursor, size);
    const allRoundsData = await allRounds[0].reduce(
      async (prev: any, epoch: BigNumber, index: number) => {
        const newPrev = await prev;
        const claimable = await getClaimable(contract, Number(epoch), user);
        const { amount, claimed, position } = allRounds[1][index];
        newPrev[Number(epoch)] = {
          amount: Number(amount),
          claimed,
          position,
          claimable,
        };
        return newPrev;
      },
      Promise.resolve({})
    );
    return allRoundsData;
  } catch (error) {
    console.log("LL: getCurrentEpoch -> error", error);
    throw error;
  }
};

export const getEpochDetails = async (
  contract: Contract,
  roundId: BigNumber
) => {
  try {
    const roundData = await contract.rounds(roundId);
    const rewardAmount = Number(roundData.rewardAmount);
    const totalAmount = Number(roundData.totalAmount);
    return {
      bearAmount: Number(roundData.bearAmount),
      bullAmount: Number(roundData.bullAmount),
      closeOracleId: Number(roundData.closeOracleId),
      closePrice: (Number(roundData.closePrice) / 100000000).toFixed(2),
      closeTimestamp: Number(roundData.closeTimestamp),
      epoch: Number(roundData.epoch),
      lockOracleId: Number(roundData.lockOracleId),
      lockPrice: (Number(roundData.lockPrice) / 100000000).toFixed(2),
      lockTimestamp: Number(roundData.lockTimestamp),
      oracleCalled: roundData.oracleCalled,
      rewardAmount:
        rewardAmount > 0 ? getMaticValue(roundData.rewardAmount) : rewardAmount,
      rewardBaseCalAmount: Number(roundData.rewardBaseCalAmount),
      startTimestamp: Number(roundData.startTimestamp),
      totalAmount,
      totalAmountDisplay:
        totalAmount > 0 ? getMaticValue(roundData.totalAmount) : totalAmount,
    };
  } catch (error) {
    console.log("LL: getEpochDetails -> error", error);
    throw error;
  }
};

export const postClaimAbi = async (contract: Contract, epochs: BigNumber[]) => {
  try {
    return contract.interface.encodeFunctionData("claim", [epochs]);
  } catch (error) {
    console.log("LL: getLatestRound -> error", error);
    throw error;
  }
};
