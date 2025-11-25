import React from 'react';
import { Sankey, ResponsiveContainer, Tooltip } from 'recharts';

interface SankeyData {
    nodes: { name: string }[];
    links: { source: number; target: number; value: number }[];
}

interface SankeyChartProps {
    data: SankeyData;
    height?: number;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    
    // Check if it's a LINK payload
    if (data.payload && data.payload.source && data.payload.target) {
      const { source, target, value } = data.payload;
      return (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-3 rounded-md shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{`${source.name} -> ${target.name}`}</p>
          <p className="text-sm text-indigo-600 dark:text-indigo-400">{formatCurrency(value)}</p>
        </div>
      );
    }
    
    // Check if it's a NODE payload
    if (data.name && typeof data.value !== 'undefined') {
      return (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-3 rounded-md shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{data.name}</p>
          <p className="text-sm text-indigo-600 dark:text-indigo-400">{`Total Flow: ${formatCurrency(data.value)}`}</p>
        </div>
      );
    }
  }

  return null;
};

const SankeyChart: React.FC<SankeyChartProps> = ({ data, height = 300 }) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <Sankey
                data={data}
                nodePadding={50}
                margin={{
                    left: 100,
                    right: 100,
                    top: 20,
                    bottom: 20,
                }}
                link={{ stroke: '#6366f1', strokeOpacity: 0.5 }}
                node={({ x, y, width, height, index, payload, containerWidth }: any) => {
                    const isSource = x === 0;
                    const isTarget = x + width === containerWidth;
                    const isSink = payload.targetLinks?.length === 0;
                    const isRoot = payload.sourceLinks?.length === 0;
                    
                    let textColorClass = "fill-slate-700 dark:fill-slate-200";
                    if (isRoot) textColorClass = "fill-green-600 dark:fill-green-400";
                    if (isSink) textColorClass = "fill-indigo-600 dark:fill-indigo-400";

                    return (
                        <g>
                            <rect x={x} y={y} width={width} height={height} fill="#a5b4fc" stroke="#4338ca" strokeWidth={1} rx={2} />
                            <text
                                x={isSource || isSink ? x - 6 : x + width + 6}
                                y={y + height / 2}
                                textAnchor={isSource || isSink ? "end" : "start"}
                                dominantBaseline="middle"
                                className={`font-medium text-sm ${textColorClass}`}
                            >
                                {payload.name}
                            </text>
                        </g>
                    );
                }}
            >
              <Tooltip content={<CustomTooltip />} />
            </Sankey>
        </ResponsiveContainer>
    );
};

export default SankeyChart;