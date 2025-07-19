import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';

type GenderData = {
  male: number;
  female: number;
};

export default function GenderPieChart() {
  const [data, setData] = useState<GenderData>({ male: 0, female: 0 });

  useEffect(() => {
    axios.get('http://localhost:8000/api/gender-distribution')
      .then(res => setData(res.data))
      .catch(err => console.error('Gender fetch error:', err));
  }, []);

  const total = data.male + data.female;
  if (total === 0) return null; // sau loading spinner

  const series = [
    { value: (data.male / total) * 100, color: '#4A90E2' },
    { value: (data.female / total) * 100, color: '#CBD8F6' },
  ];

  const size = 200;
  const strokeWidth = 30;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const createArcPath = (startAngle: number, endAngle: number, radius: number, center: number) => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      `M ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    ].join(' ');
  };

  let startAngle = 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gender</Text>

      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {series.map((slice, index) => {
            const angle = (slice.value / 100) * 360;
            const endAngle = startAngle + angle;
            const path = createArcPath(startAngle, endAngle, radius, center);
            const midAngle = startAngle + angle / 2;
            const labelPos = polarToCartesian(center, center, radius , midAngle);
            startAngle += angle;

            return (
              <G key={index}>
                <Path
                  d={path}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
                <G>
                  <Circle cx={labelPos.x} cy={labelPos.y} r={16} fill="#fff" />
                  <SvgText
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize={14}
                    fontWeight="bold"
                    fill="#333"
                    transform={`rotate(90, ${labelPos.x}, ${labelPos.y})`}
                  >
                    {Math.round(slice.value)}%
                  </SvgText>


                </G>
              </G>
            );
          })}
        </G>
      </Svg>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#4A90E2' }]} />
          <Text style={styles.legendText}>Male</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#CBD8F6' }]} />
          <Text style={styles.legendText}>Female</Text>
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
    width: 370,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  legendRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 20,
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
    fontSize: 14,
    color: '#333',
  },
});
