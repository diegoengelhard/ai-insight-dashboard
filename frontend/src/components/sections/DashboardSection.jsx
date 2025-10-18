import DashboardGrid from '../../components/organisms/DashboardGrid';

/**
 * The third main section, displaying the user's personalized dashboard.
 * @param {{
 * charts: Array<object>
 * }} props
 */
const DashboardSection = ({ charts }) => {
  return (
    <section aria-labelledby="dashboard-heading">
      <h2 id="dashboard-heading" className="text-2xl font-bold mb-6">
        Your Personalized Dashboard
      </h2>
      <DashboardGrid charts={charts} />
    </section>
  );
};

export default DashboardSection;
