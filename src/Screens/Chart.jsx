import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const OrderChart = () => {
  const chartData = {
    labels: [
      '01/07', '02/07', '03/07', '04/07', '05/07',
      '06/07', '07/07', '08/07', '09/07', '10/07',
      '11/07', '12/07', '13/07', '14/07', '15/07',
      '16/07', '17/07', '18/07', '19/07', '20/07',
      '21/07', '22/07', '23/07'
    ],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 20, 0, 0, 0, 0, 10, 0, 0, 60, 1400, 200, 0],
        color: (opacity = 1) => `rgba(0, 191, 255, ${opacity})`,
        label: 'Bottle Order Quantity',
      },
      {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 40, 0, 0, 0, 0, 0, 30, 0, 120, 0, 0, 0],
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
        label: 'Jar Order Quantity',
      },
    ],
    legend: ['Bottle Order Quantity', 'Jar Order Quantity']
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.6,
  };

  return (
    <ScrollView horizontal>
      <View style={styles.container}>
        <Text style={styles.title}>Bottle and Jar Order Quantity (Monthly)</Text>
        <BarChart
          data={chartData}
          width={1600}
          height={320}
          yAxisLabel=""
          chartConfig={chartConfig}
          verticalLabelRotation={45}
          style={styles.chartStyle}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  chartStyle: {
    borderRadius: 16,
  },
});

export default OrderChart;
