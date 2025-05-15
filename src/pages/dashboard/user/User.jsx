import Tree from "../../../components/Tree";
import DashboardPageWrapper from "../DashboardPageWrapper";
import Loader from "../../../components/Loader.jsx";
import CompanyCreate from "./CompanyCreate.jsx";
import CompanyPanel from "./CompanyPanel.jsx";
import { useCompany } from "../../../contexts/CompanyContext.jsx";
import MessagePopup from "../../../components/MessagePopup.jsx";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Input from "../../../components/Input.jsx";




export default function User() {
  const {
    data,
    loading,
    message,
    newUnit,
    moveUnit,
    removeUnit,
    leaveCompany,
  } = useCompany();

  const [showExitPopup, setShowExitPopup] = useState(false);

  return (
    <>
      <MessagePopup message={message} loading={loading} />
      
      <AnimatePresence mode="wait">
        {showExitPopup && (
          <motion.div
            className="exit-popup-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              delay: showExitPopup ? 0 : 2,
              type: "tween",
              duration: 0.25,
              ease: "circInOut",
            }}
          >
            <motion.div
              className="exit-popup"
              initial={{
                opacity: 0,
                filter: "blur(10px)",
                scale: 0.5,
                skewY: "2deg",
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
                scale: 1,
                skewY: "0deg",
              }}
              exit={{
                opacity: 0,
                filter: "blur(10px)",
                scale: 0.5,
                skewY: "5deg",
              }}
              transition={{
                type: "spring",
                damping: 15,
                delay: showExitPopup ? 0.3 : 0,
              }}
            >
              <p className="exit-popup-text">
                {data?.me?.userType === "owner"
                  ? "Are you sure you want to delete the organization? This action will permanently remove all invoices and data associated with your company."
                  : "Are you sure you want to leave the organization? You will lose access to all units and invoices associated with this company."}
              </p>

              <div className="exit-poput-buttons">
                <Input
                  onClick={() => {
                    setShowExitPopup((o) => !o);
                  }}
                  width="45%"
                  maxWidth="125px"
                  borderRadius="10px"
                  height="50px"
                  type="button"
                >
                  No, Keep my company
                </Input>
                <Input
                  width="45%"
                  maxWidth="125px"
                  borderRadius="10px"
                  customStyle={{
                    color: "white",
                    border: "1px rgb(195, 75, 75) solid",
                    backgroundColor: "rgb(255, 124, 124)",
                  }}
                  height="50px"
                  type="button"
                  onClick={() => {
                    leaveCompany();
                    setShowExitPopup(false);
                  }}
                >
                  Im sure, delete my company
                </Input>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <DashboardPageWrapper maxWidth={"1250px"}>
        <Loader
          position={"center"}
          loading={loading}
          error={false}
          size={30}
          color={"black"}
          onlyLoader={true}
        ></Loader>

        {data?.unitsData?.length != 0 ? (
          <CompanyPanel
            company={data}
            newUnit={newUnit}
            moveUnit={moveUnit}
            loading={loading}
            removeUnit={removeUnit}
            setShowExitPopup={setShowExitPopup}
            leaveCompany={leaveCompany}
          ></CompanyPanel>
        ) : (
          <CompanyCreate></CompanyCreate>
        )}
      </DashboardPageWrapper>
    </>
  );
}
