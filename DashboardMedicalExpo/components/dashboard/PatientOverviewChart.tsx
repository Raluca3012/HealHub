import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { G, Line, Rect, Text as SvgText } from 'react-native-svg';


type ChartData = {
  period: string;
  recovered: number;
  hospitalized: number;
};

export default function PatientOverviewChart() {
  const [mode, setMode] = useState<'yearly' | 'monthly' | 'weekly'>('yearly');
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    axios
      .get<ChartData[]>(`http://localhost:8000/api/patient-overview/${mode}`)
      .then((res) => {
        const cleaned = res.data.map(item => ({
          ...item,
          recovered: Number(item.recovered),
          hospitalized: Number(item.hospitalized),
        }));
        setChartData(cleaned);
      })
      .catch((err) => console.error('Chart error:', err));
  }, [mode]);

  const rawMax = Math.max(...chartData.map(d => Math.max(d.recovered, d.hospitalized)), 0);
  const maxValue = rawMax < 10 ? 10 : Math.ceil(rawMax / 10) * 10;

  const chartWidth = 750;
  const chartHeight = 170;
  const barWidth = 13;
  const spacing = 27;
  const groupWidth = barWidth * 2 + spacing;
  const stepCount = 5;
  const stepValue = maxValue / stepCount;
  const stepHeight = chartHeight / stepCount;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Patient Overview</Text>
        <View style={styles.modes}>
          {(['weekly', 'monthly', 'yearly'] as const).map((m) => (
            <Pressable key={m} onPress={() => setMode(m)}>
              <Text style={[styles.modeOption, mode === m && styles.activeOption]}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Svg width={chartWidth} height={chartHeight + 40}>
        {Array.from({ length: stepCount + 1 }).map((_, i) => {
          const y = chartHeight - i * stepHeight + 10;
          const label = `${Math.round(i * stepValue)}`;
          return (
            <G key={i}>
              <Line x1={30} y1={y} x2={chartWidth + 30} y2={y} stroke="#ccc" strokeDasharray="4,4" />
              <SvgText x={28} y={y + 4} fontSize="10" fill="#888" textAnchor="end">
                {label}
              </SvgText>
            </G>
          );
        })}

        {chartData.map((item, index) => {
          const recHeight = (item.recovered / maxValue) * chartHeight;
          const hosHeight = (item.hospitalized / maxValue) * chartHeight;
          const x = index * (groupWidth + 8) + 40;
          const yRec = chartHeight - recHeight + 10;
          const yHos = chartHeight - hosHeight + 10;

          return (
            <G key={index}>
              <Rect x={x} y={yHos} width={barWidth} height={hosHeight} fill="#CBD8F6" rx={3} />
              <Rect x={x + barWidth + 2} y={yRec} width={barWidth} height={recHeight} fill="#4A5AA6" rx={3} />
              <SvgText x={x + barWidth} y={chartHeight + 30} fontSize="10" fill="#666" textAnchor="middle">
                {item.period}
              </SvgText>
            </G>
          );
        })}
      </Svg>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#4A5AA6' }]} />
          <Text style={styles.legendText}>Recovered</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#CBD8F6' }]} />
          <Text style={styles.legendText}>Hospitalized</Text>
        </View>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    width: 800,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  modes: {
    flexDirection: 'row',
    gap: 15,
  },
  modeOption: {
    fontSize: 12,
    color: '#888',
  },
  activeOption: {
    color: '#4A90E2',
    textDecorationLine: 'underline',
  },
  legend: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    color: '#333',
  },
});
