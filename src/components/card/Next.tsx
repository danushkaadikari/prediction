import React from "react";
import Button from "../../UI/Button";
import { ReactComponent as Loader } from "../../assets/images/loader.svg";
import upSideSvg from "../../assets/images/UpSide.svg";
import downSideSvg from "../../assets/images/DownSide.svg";

interface LiveCardHeader {
  loading: boolean;
  epoch: number;
}

const Header = ({ loading, epoch }: LiveCardHeader) => {
  return (
    <>
      <div className="flex justify-between px-4 py-2 bg-[#fd073a80] bg-opacity-50 rounded-tl-3xl rounded-tr-3xl">
        <p className="text-white uppercase">next</p>
        {loading ? (
          <div className="flex items-center justify-center text-black">
            <Loader className="w-12 h-12 mr-3 -ml-1 text-white animate-spin" />
          </div>
        ) : (
          <p className="text-2xl text-white font-poppins">#{epoch}</p>
        )}
      </div>

      <div className="bg-[#283573] bg-opacity-50 w-full h-4"></div>
    </>
  );
};

const Body = ({ loading }: { loading: boolean }) => {
  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center py-8 mx-1 h-80">
          <Loader className="w-12 h-12 mr-3 -ml-1 text-white animate-spin" />
        </div>
      ) : (
        <div className="py-8 mx-1">
          <div
            className="flex flex-col items-center justify-center py-4 text-sm text-white bg-no-repeat"
            style={{
              backgroundImage: `url(${upSideSvg})`,
              backgroundSize: "100% 150%",
              backgroundPositionY: "-1px",
            }}
          >
            <p className="text-xs font-medium uppercase">up</p>
            <p className="text-xs opacity-70"> 0x Payout</p>
          </div>

          <div className="space-y-2 h-48 border-[#3D8DFF] border-[1px] border-solid p-2 mx-2 rounded-lg text-white opacity-50">
            <div className="flex justify-between mb-4 text-xs font-bold">
              <p>Prize Pool</p>
              <p className="text-xs font-bold">$0.00</p>
            </div>
            <Button
              size={"sm"}
              label="Enter Up"
              color={"success"}
              customStyle="!w-full !py-3 !text-xs !font-bold"
              disabled={true}
            />
            <Button
              size={"sm"}
              label="Enter Down"
              color={"danger"}
              customStyle="!w-full !py-3 !mb-8 !text-xs !font-bold"
              disabled={true}
            />
          </div>
          <div
            className="flex flex-col items-center justify-center py-4 text-sm text-white rotate-180 bg-no-repeat "
            style={{
              backgroundImage: `url(${downSideSvg})`,
              backgroundSize: "100% 150%",
            }}
          >
            <p className="text-xs font-medium uppercase rotate-180">down</p>
            <p className="text-xs rotate-180 opacity-70">0x Payout</p>
          </div>
        </div>
      )}
    </>
  );
};

export function Next({
  loading = false,
  epoch,
}: {
  loading: boolean;
  epoch: number;
}) {
  return (
    <div className="h-full flip-card">
      <div className="flip-card-inner ">
        <div className="flip-card-front rounded-3xl bg-[#283573] border-slate-600 border-[1px] backdrop-blur-lg w-full">
          <Header loading={loading} epoch={epoch} />
          <Body loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default Next;
