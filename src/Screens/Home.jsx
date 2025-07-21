import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const StatCard = ({ title, value, icon }) => (
  <View style={styles.statCard}>
    <View style={styles.statIconCircle}>
      <Icon name={icon} size={20} color="#fff" />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const OrderCard = ({ title, bottle, jar, total, paid, unpaid, discount, iconColor }) => (
  <View style={styles.orderCard}>
    <View style={[styles.orderIconCircle, { backgroundColor: iconColor }]}>
      <Icon name="calendar" size={20} color="#fff" />
    </View>
    <Text style={styles.orderTitle}>{title}</Text>
    <View style={styles.row}><Icon name="dropbox" size={14} /><Text style={styles.label}> Bottle:</Text><Text>{bottle}</Text></View>
    <View style={styles.row}><Icon name="dropbox" size={14} /><Text style={styles.label}> Jar:</Text><Text>{jar}</Text></View>
    <View style={styles.row}><Icon name="money" size={14} color="#2ecc71" /><Text style={styles.label}> Total:</Text><Text>{total}</Text></View>
    <View style={styles.row}><Icon name="check" size={14} color="#2ecc71" /><Text style={styles.label}> Paid:</Text><Text>{paid}</Text></View>
    <View style={styles.row}><Icon name="clock-o" size={14} color="orange" /><Text style={styles.label}> Unpaid:</Text><Text>{unpaid}</Text></View>
    <View style={styles.row}><Icon name="tag" size={14} color="#9b59b6" /><Text style={styles.label}> Discount:</Text><Text>{discount}</Text></View>
  </View>
);

const Dashboard = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Dashboard Overview</Text>
      <View style={styles.statsRow}>
        <StatCard title="Customers" value="17" icon="user" />
        <StatCard title="Items" value="2" icon="dropbox" />
        <StatCard title="Orders" value="23" icon="shopping-basket" />
      </View>

      <View style={styles.statsRow}>
        <StatCard title="Completed" value="3" icon="check-circle" />
        <StatCard title="Pending" value="20" icon="clock-o" />
      </View>

      <Text style={styles.heading}>Order Summary</Text>
      <OrderCard
        title="Today's Orders"
        bottle="230"
        jar="1429"
        total="41475"
        paid="0"
        unpaid="41475"
        discount="0"
        iconColor="#2ecc71"
      />
      <OrderCard
        title="This Week's Orders"
        bottle="230"
        jar="1429"
        total="41475"
        paid="0"
        unpaid="41475"
        discount="0"
        iconColor="#e74c3c"
      />
      <OrderCard
        title="This Month's Orders"
        bottle="246"
        jar="1596"
        total="48525"
        paid="3895"
        unpaid="44545"
        discount="65"
        iconColor="#6c5ce7"
      />
    </ScrollView>
  );
};

export default Dashboard;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1931',
    padding: 12,
  },
  heading: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: width / 3 - 16,
    marginBottom: 10,
  },
  statIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  statTitle: {
    fontSize: 12,
    color: '#636e72',
    textAlign: 'center',
    marginTop: 4,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    position: 'relative',
  },
  orderTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#34495e',
    marginBottom: 10,
    paddingLeft: 6,
  },
  orderIconCircle: {
    position: 'absolute',
    right: 14,
    top: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    marginLeft: 6,
    marginRight: 4,
    fontWeight: '500',
    color: '#2d3436',
  },
});
