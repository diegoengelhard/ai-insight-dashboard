import { useEffect, useMemo } from 'react';
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  ScatterChart, Scatter,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer,
} from 'recharts';
import Skeleton from '../atoms/Skeleton';
import { useChartData } from '../../hooks/useChartData';

/**
 * Renders a chart using Recharts based on suggestion parameters and server data.
 * Expects backend shape: { series: [{ label, data: [{ x, y }] }] }
 */
const ChartRenderer = ({ datasetId, suggestion }) => {
  const { status, chartData, error, fetchChartData } = useChartData();

  const params = useMemo(() => {
    const p = suggestion.parameters;
    return {
      datasetId,
      chart_type: p.chart_type,
      x_axis: p.x_axis,
      y_axis: p.y_axis,
      aggregation: p.aggregation,
    };
  }, [datasetId, suggestion]);

  useEffect(() => {
    if (datasetId && suggestion?.parameters) {
      fetchChartData(params);
    }
  }, [datasetId, suggestion, fetchChartData, params]);

  if (status === 'loading' || status === 'idle') return <Skeleton className="h-full w-full rounded-lg" />;
  if (status === 'error') return <div className="text-red-600 text-sm">Chart error: {error}</div>;

  const series = chartData?.series || [];
  const first = series[0] || { label: 'Value', data: [] };
  const data = first.data;

  const COLORS = ['#2563EB', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#14B8A6'];
  const chartType = suggestion?.parameters?.chart_type || 'bar';

  return (
    <ResponsiveContainer width="100%" height="100%">
      {chartType === 'bar' && (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="y" name={first.label} fill="#2563EB" />
        </BarChart>
      )}

      {chartType === 'line' && (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="y" name={first.label} stroke="#2563EB" dot={false} />
        </LineChart>
      )}

      {chartType === 'pie' && (
        <PieChart>
          <Tooltip />
          <Legend />
          <Pie data={data} dataKey="y" nameKey="x" cx="50%" cy="50%" outerRadius="75%" label>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      )}

      {chartType === 'scatter' && (
        <ScatterChart>
          <CartesianGrid />
          <XAxis dataKey="x" type="category" name="x" />
          <YAxis dataKey="y" type="number" name="y" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <Scatter name={first.label} data={data} fill="#2563EB" />
        </ScatterChart>
      )}
    </ResponsiveContainer>
  );
};

export default ChartRenderer;
