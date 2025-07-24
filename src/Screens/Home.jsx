import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import { baseUrl } from './baseUrl';

const { width } = Dimensions.get('window');

const StatCard = ({ title, value, icon, iconColor, widthValue }) => (
  <View style={[styles.statCard, { width: widthValue }]}>
    <View style={[styles.statIconCircle, { backgroundColor: iconColor }]}>
      <Icon name={icon} size={16} color="#fff" />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const OrderCard = ({ title, bottle, jar, total, paid, unpaid, discount, iconColor }) => (
  <View style={styles.orderCard}>
    <View style={[styles.orderIconCircle, { backgroundColor: iconColor }]}>
      <Icon name="calendar" size={16} color="#fff" />
    </View>
    <Text style={styles.orderTitle}>{title}</Text>
    <View style={styles.row}><Icon name="dropbox" size={12} /><Text style={styles.label}> Bottle:</Text><Text>{bottle}</Text></View>
    <View style={styles.row}><Icon name="dropbox" size={12} /><Text style={styles.label}> Jar:</Text><Text>{jar}</Text></View>
    <View style={styles.row}><Icon name="money" size={12} color="#27ae60" /><Text style={styles.label}> Total:</Text><Text>₹{total}</Text></View>
    <View style={styles.row}><Icon name="check" size={12} color="#2ecc71" /><Text style={styles.label}> Paid:</Text><Text>₹{paid}</Text></View>
    <View style={styles.row}><Icon name="clock-o" size={12} color="#e67e22" /><Text style={styles.label}> Unpaid:</Text><Text>₹{unpaid}</Text></View>
    <View style={styles.row}><Icon name="tag" size={12} color="#8e44ad" /><Text style={styles.label}> Discount:</Text><Text>₹{discount}</Text></View>
  </View>
);

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('today');
  const [items, setItems] = useState([
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
  ]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${baseUrl}/dashboard`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer 217|RVgUyETM41CzjeK0d6rAcQ0dGZ7ygXPpFo1UVM1m7559b263',
          'Content-Type': 'application/json'
        }
      });
      const json = await response.json();
      if (json.success) {
        setDashboardData(json.data);
      } else {
        console.error('API Error:', json.message);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getItemQuantity = (items, name) => {
    const found = items?.find(i => i.item === name);
    return found ? found.quantity : 0;
  };

  if (loading || !dashboardData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2980b9" />
        <Text style={{ color: '#2980b9', marginTop: 10 }}>Loading Dashboard...</Text>
      </View>
    );
  }

  const selectedOrders = dashboardData[selected];
  const bottle = getItemQuantity(selectedOrders?.order_count_item_wise, 'Bottle');
  const jar = getItemQuantity(selectedOrders?.order_count_item_wise, 'Jar');

  const selectedCard = {
    title: selected === 'today' ? "Today's Orders" : selected === 'week' ? "This Week's Orders" : "This Month's Orders",
    bottle: bottle.toString(),
    jar: jar.toString(),
    total: selectedOrders.total_amount.toString(),
    paid: selectedOrders.paid_amount.toString(),
    unpaid: selectedOrders.unpaid_amount.toString(),
    discount: selectedOrders.discount.toString(),
    iconColor: selected === 'today' ? "#2ecc71" : selected === 'week' ? "#e74c3c" : "#6c5ce7"
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Dashboard Overview</Text>

      <View style={styles.statsRow}>
        <StatCard title="Customers" value={dashboardData.total_customers.toString()} icon="users" iconColor="#3498db" widthValue={width / 2 - 18} />
        <StatCard title="Items" value={dashboardData.total_items.toString()} icon="cubes" iconColor="#9b59b6" widthValue={width / 2 - 18} />
      </View>

      <View style={styles.statsRow}>
        <StatCard title="Orders" value={dashboardData.orders.total.toString()} icon="shopping-cart" iconColor="#f39c12" widthValue={width / 3 - 20} />
        <StatCard title="Completed" value={dashboardData.orders.complete.toString()} icon="check" iconColor="#2ecc71" widthValue={width / 3 - 20} />
        <StatCard title="Pending" value={dashboardData.orders.pending.toString()} icon="hourglass-half" iconColor="#e67e22" widthValue={width / 3 - 20} />
      </View>

      <Text style={styles.heading}>Order Summary</Text>

      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={open}
          value={selected}
          items={items}
          setOpen={setOpen}
          setValue={setSelected}
          setItems={setItems}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
          textStyle={{ color: '#2c3e50', fontSize: 14 }}
          labelStyle={{ fontWeight: '600', color: '#34495e' }}
          placeholderStyle={{ color: '#bdc3c7' }}
          listItemLabelStyle={{ color: '#2c3e50' }}
          listItemContainerStyle={{ borderBottomColor: '#ecf0f1', borderBottomWidth: 1 }}
          selectedItemLabelStyle={{ color: '#fff', fontWeight: 'bold' }}
          selectedItemContainerStyle={{ backgroundColor: '#6c5ce7' }}
        />
      </View>

      <OrderCard {...selectedCard} />
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fb',
    padding: 12,
  },
  heading: {
    color: '#2c3e50',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statTitle: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    marginTop: 2,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    position: 'relative',
    elevation: 3,
  },
  orderTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#34495e',
    marginBottom: 12,
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
    marginBottom: 6,
  },
  label: {
    marginLeft: 6,
    marginRight: 4,
    fontWeight: '500',
    color: '#2c3e50',
    fontSize: 13,
  },
  dropdownContainer: {
    zIndex: 1000,
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    height: 46,
    borderRadius: 12,
    elevation: 4,
    paddingHorizontal: 10,
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: 10,
    elevation: 3,
  },
});
