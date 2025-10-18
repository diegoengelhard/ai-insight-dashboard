import DashboardGrid from '../../components/organisms/DashboardGrid';

/**
 * The third main section, displaying the user's personalized dashboard.
 * @param {{
 * datasetId: string,
 * charts: Array<object>
 * }} props
 */
const DashboardSection = ({ datasetId, charts }) => {
  return (
    <section aria-labelledby="dashboard-heading">
      <h2 id="dashboard-heading" className="text-2xl font-bold mb-6">
        Your Personalized Dashboard
      </h2>
      <DashboardGrid datasetId={datasetId} charts={charts} />
    </section>
  );
};

export default DashboardSection;
