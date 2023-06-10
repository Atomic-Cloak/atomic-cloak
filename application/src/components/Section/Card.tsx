import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Chains from "@/components/Section/Chains";
import Quantity from "@/components/Section/Quantity";
import { TransactionContext } from "@/providers/TransactionProvider";

const style = {
  content: `bg-[#191B1F] w-[30rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none w-full`,
  transferPropInput2: `bg-transparent text-white outline-none w-full`,
  transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-4 border border-[#20242A] hover:border-[#41444F] flex justify-between`,
  swapButton: `bg-[#3898FF] my-2 rounded-2xl py-4 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
};

const Card = ({ mode }: { mode?: string }) => {
  const [isNew, setIsNew] = useState<boolean>(true);

  useEffect(() => {
    switch (mode) {
      case "open":
        setIsNew(true);
        break;
      case "closed":
        setIsNew(false);
        break;
      default:
        setIsNew(true);
        break;
    }
  }, []);

  const { formData, handleChange, sendOpenSwapTransaction, isLoading, isOpen } =
    useContext(TransactionContext);

  const handleSubmit = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isLoading) {
      const { addressTo } = formData;
      e.preventDefault();
      console.log("addressTo", addressTo);
      sendOpenSwapTransaction();
    }
  };

  return (
    <div className="flex flex-col rounded-2xl px-6 sm:px-8">
      <div className={style.content}>
        {isNew ? (
          <>
            {isOpen ? null : (
              <>
                <div className={style.formHeader}>
                  <div>Quantity</div>
                </div>
                <Quantity />
                <div className={style.formHeader}>
                  <div>Receiving Address</div>
                </div>
                <div className={style.transferPropContainer}>
                  <input
                    type="text"
                    className={style.transferPropInput}
                    placeholder="0x..."
                    value={formData.addressTo}
                    onChange={(e) => handleChange(e.target.value, "addressTo")}
                  />
                </div>
                <div className={style.formHeader}>
                  <div>Receiving Chain</div>
                </div>
                <Chains />
                <div className={style.formHeader}>
                  <div>Fee</div>
                </div>
                <div className={style.transferPropContainer}>
                  <div className={style.transferPropInput2}>0.0001</div>
                </div>
                <div
                  onClick={(e) => handleSubmit(e)}
                  className={style.swapButton}
                >
                  Swap
                </div>
              </>
            )}
          </>
        ) : (
          <Image
            src="/background.png"
            width={500}
            height={520}
            alt="Background"
          />
        )}
      </div>
    </div>
  );
};

export default Card;
