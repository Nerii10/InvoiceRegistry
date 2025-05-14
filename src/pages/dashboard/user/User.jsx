import Tree from "../../../components/Tree";
import DashboardPageWrapper from "../DashboardPageWrapper";
import Loader from "../../../components/Loader.jsx";
import CompanyCreate from "./CompanyCreate.jsx";
import CompanyPanel from "./CompanyPanel.jsx";
import { useCompany } from "../../../contexts/CompanyContext.jsx";

export default function User() {
  const { data, loading, newUnit, moveUnit, removeUnit, leaveCompany } =
    useCompany();

  return (
    <DashboardPageWrapper maxWidth={"1250px"}>
      <Loader
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
          leaveCompany={leaveCompany}
        ></CompanyPanel>
      ) : (
        <CompanyCreate></CompanyCreate>
      )}
    </DashboardPageWrapper>
  );
}
