/**
 * A skeleton loader component to indicate that content is loading.
 * It uses a subtle pulse animation for a better user experience.
 * @param {{ className?: string }} props
 */
const Skeleton = ({ className = '' }) => {
  // Combine base styles with any additional classes passed via props.
  const combinedClassName = `animate-pulse bg-gray-200 rounded-md ${className}`;

  return <div className={combinedClassName} />;
};

export default Skeleton;
