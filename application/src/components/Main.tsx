import React, { useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { AiOutlineDown } from "react-icons/ai";
import { TransactionContext } from "@/providers/TransactionProvider";

const style = {
  wrapper: `flex justify-center items-center h-screen mt-14`,
  content: `bg-[#191B1F] w-[30rem] rounded-2xl p-4`,
  transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-4 text-xl border border-[#20242A] hover:border-[#41444F]  flex justify-between`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none w-full text-2xl`,
  currencySelector: `flex w-1/4`,
  currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36] hover:bg-[#41444F] rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
  currencySelectorIcon: `flex items-center`,
  currencySelectorTicker: `mx-2`,
  currencySelectorArrow: `text-lg`,
  swapButton: `bg-[#627EEA] my-2 rounded-2xl py-4 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#0a0b0d",
    padding: 0,
    border: "none",
  },
  overlay: {
    backgroundColor: "rgba(10, 11, 13, 0.75)",
  },
};

export const Main: React.FC = () => {
  const router = useRouter();

  const { formData, handleChange, sendOpenSwapTransaction, isLoading } =
    useContext(TransactionContext);

  const handleSubmit = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isLoading) {
      const { addressTo, amount } = formData;
      e.preventDefault();
      console.log("addressTo", addressTo);

    //   if (!addressTo || !amount) return;

      sendOpenSwapTransaction();
    }
  };

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.transferPropContainer}>
          <input
            type="text"
            className={style.transferPropInput}
            placeholder="0.0"
            pattern="^[0-9]*[.,]?[0-9]*$"
            value={formData.amount}
            onChange={(e) => handleChange(e, "amount")}
          />
          <div className={style.currencySelector}>
            <div className={style.currencySelectorContent}>
              <div className={style.currencySelectorIcon}>
                <Image
                  src="/images/eth.png"
                  alt="eth logo"
                  height={20}
                  width={20}
                />
              </div>
              <div className={style.currencySelectorTicker}>ETH</div>
              <AiOutlineDown className={style.currencySelectorArrow} />
            </div>
          </div>
        </div>
        <div className={style.transferPropContainer}>
          <input
            type="text"
            className={style.transferPropInput}
            placeholder="0x..."
            value={formData.addressTo}
            onChange={(e) => handleChange(e, "addressTo")}
          />
          <div className={style.currencySelector}></div>
        </div>
        <div onClick={(e) => handleSubmit(e)} className={style.swapButton}>
          Swap
        </div>
      </div>
    </div>
  );
};