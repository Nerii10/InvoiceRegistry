import Tree from "../../../components/Tree";
import DashboardPageWrapper from "../DashboardPageWrapper";
import { useUser } from "../../../contexts/UserContext";
import { useCompany } from "../../../hooks/useCompany";
import Loader from "../../../components/Loader.jsx";
import CompanyCreate from "./CompanyCreate.jsx";
import CompanyPanel from "./CompanyPanel.jsx";

export default function User() {
  const { token } = useUser();
  const {
    data: company,
    loading,
    newUnit,
    moveUnit,
    removeUnit,
    leaveCompany,
  } = useCompany({ token });

  return (
    <DashboardPageWrapper maxWidth={"1250px"}>
      <Loader
        loading={loading}
        error={false}
        size={30}
        color={"black"}
        onlyLoader={true}
      ></Loader>

      {loading && (
        <div>
          <br></br>
          <br></br> 
          <br></br>
        </div>
      )}

      {!loading &&
        (company?.unitsData?.length != 0 ? (
          <CompanyPanel
            company={company}
            newUnit={newUnit}
            moveUnit={moveUnit}
            removeUnit={removeUnit}
            leaveCompany={leaveCompany}
          ></CompanyPanel>
        ) : (
          <CompanyCreate></CompanyCreate>
        ))}
    </DashboardPageWrapper>
  );
}
