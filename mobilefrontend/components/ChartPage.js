import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-svg-charts';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import Navbar from './Navbar';

const ChartPage = () => {
  const route = useRoute();
  const { UserID } = route.params;
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    axios.get(`http://192.168.1.217:5000/api/Budget/${UserID}`)
      .then(res => setBudgets(res.data))
      .catch(err => console.error(err));
  }, [UserID]);

  const chartColors = [
    '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
    '#0ea5e9', '#f43f5e', '#14b8a6', '#f472b6', '#facc15'
  ];

  const pieData = budgets
    .filter(b => b.UsedAmount > 0)
    .map((budget, index) => ({
      value: budget.UsedAmount,
      svg: { fill: chartColors[index % chartColors.length] },
      key: `pie-${index}`,
      label: budget.BudgetName,
      color: chartColors[index % chartColors.length],
    }));

  const barData = [
    {
      data: budgets.map(b => b.UsedAmount),
      svg: { fill: '#ef4444' },
    },
    {
      data: budgets.map(b => b.CurrentAmount),
      svg: { fill: '#10b981' },
    },
  ];

  const labels = budgets.map(b => b.BudgetName);

  return (
    <ScrollView style={styles.container}>
      <Navbar />

      <Text style={styles.heading}>📊 Budget Usage (Pie Chart)</Text>
      {pieData.length > 0 ? (
        <>
          <PieChart
            style={{ height: 220 }}
            data={pieData}
            innerRadius="40%"
            outerRadius="90%"
          />

          {/* Horizontal labels under Pie */}
          <View style={styles.pieLegendContainer}>
            {pieData.map((item, index) => (
              <View key={index} style={styles.pieLegendItem}>
                <View style={[styles.pieLegendColor, { backgroundColor: item.color }]} />
                <Text style={styles.pieLegendLabel}>
                  {item.label.length > 8 ? item.label.slice(0, 8) + '…' : item.label}
                </Text>
              </View>
            ))}
          </View>
        </>
      ) : (
        <Text style={styles.noData}>No data available</Text>
      )}

      <Text style={styles.heading}>📉 Used vs Remaining (Bar Chart)</Text>
      {budgets.length > 0 ? (
        <>
          <BarChart
            style={{ height: 280 }}
            data={barData}
            contentInset={{ top: 30, bottom: 10 }}
            spacingInner={0.3}
            spacingOuter={0.1}
            yMin={0}
          />

          {/* Horizontal X-Axis Labels */}
          <View style={styles.barLabels}>
            {labels.map((label, index) => (
              <Text key={index} style={styles.barLabelText}>
                {label.length > 7 ? label.slice(0, 7) + '…' : label}
              </Text>
            ))}
          </View>

          {/* Bar chart legend */}
          <View style={styles.barLegendContainer}>
            <View style={styles.barLegendItem}>
              <View style={[styles.barLegendColor, { backgroundColor: '#ef4444' }]} />
              <Text style={styles.barLegendLabel}>Used</Text>
            </View>
            <View style={styles.barLegendItem}>
              <View style={[styles.barLegendColor, { backgroundColor: '#10b981' }]} />
              <Text style={styles.barLegendLabel}>Remaining</Text>
            </View>
          </View>
        </>
      ) : (
        <Text style={styles.noData}>No data available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
    marginVertical: 16,
    textAlign: 'center',
  },
  noData: {
    color: '#f87171',
    textAlign: 'center',
    marginVertical: 16,
  },
  pieLegendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  pieLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
    marginVertical: 4,
  },
  pieLegendColor: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginRight: 5,
  },
  pieLegendLabel: {
    color: '#f1f5f9',
    fontSize: 13,
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    paddingHorizontal: 8,
    flexWrap: 'wrap',
  },
  barLabelText: {
    color: '#f1f5f9',
    fontSize: 12,
    width: 50,
    textAlign: 'center',
  },
  barLegendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 20,
  },
  barLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  barLegendColor: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginRight: 6,
  },
  barLegendLabel: {
    color: '#f1f5f9',
    fontSize: 14,
  },
});

export default ChartPage;