import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { G, Line, Rect, Text as SvgText } from 'react-native-svg';

const dataByMode = {
  yearly: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    recovered: [18000, 10000, 19000, 20000, 21000, 15000, 23000, 21000, 26000, 6000, 17000, 20000],
    hospitalized: [7000, 12000, 6000, 5000, 7000, 8000, 6000, 5000, 4000, 11000, 8000, 7000],
  },
  monthly: {
    labels: ['W1', 'W2', 'W3', 'W4'],
    recovered: [8000, 9500, 10200, 11000],
    hospitalized: [4000, 3000, 5000, 4500],
  },
  weekly: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    recovered: [1500, 1300, 1700, 1900, 2000, 1800, 1600],
    hospitalized: [700, 600, 800, 500, 900, 750, 650],
  },
};

const maxValue = 30000;

export default function PatientOverviewChart() {
  const [mode, setMode] = useState<'yearly' | 'monthly' | 'weekly'>('yearly');

  const { labels, recovered, hospitalized } = dataByMode[mode];

  const chartWidth = 750;
  const chartHeight = 170;
  const yOffset = 10; // for vertical spacing

  const barWidth = 13;
  const spacing = 27;
  const groupWidth = barWidth * 2 + spacing;

  const yAxisSteps = 5;
  const stepValue = maxValue / yAxisSteps;
  const stepHeight = chartHeight / yAxisSteps;

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
        {/* Y Axis labels and dotted lines */}
        {Array.from({ length: yAxisSteps + 1 }).map((_, i) => {
          const y = chartHeight - i * stepHeight + yOffset;
          const label = `${Math.round(i * stepValue / 1000)}k`;

          return (
            <G key={`grid-${i}`}>
              <Line
                x1={30}
                y1={y}
                x2={chartWidth + 30}
                y2={y}
                stroke="#ccc"
                strokeDasharray="4,4"
                strokeWidth={1}
              />
              <SvgText
                x={28}
                y={y + 4}
                fontSize="10"
                fill="#888"
                textAnchor="end"
              >
                {label}
              </SvgText>
            </G>
          );
        })}

        {/* Bars */}
        {recovered.map((value, index) => {
          const recHeight = (value / maxValue) * chartHeight;
          const hosHeight = (hospitalized[index] / maxValue) * chartHeight;
          const x = index * (groupWidth + 8) + 40;
          const yRec = chartHeight - recHeight + yOffset;
          const yHos = chartHeight - hosHeight + yOffset;

          return (
            <G key={index}>
              <Rect
                x={x}
                y={yHos}
                width={barWidth}
                height={hosHeight}
                fill="#CBD8F6"
                rx={3}
              />
              <Rect
                x={x + barWidth + 2}
                y={yRec}
                width={barWidth}
                height={recHeight}
                fill="#4A5AA6"
                rx={3}
              />
              <SvgText
                x={x + barWidth}
                y={chartHeight + yOffset + 25}
                fontSize="10"
                fill="#666"
                textAnchor="middle"
              >
                {labels[index]}
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
