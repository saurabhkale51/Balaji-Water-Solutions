import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import { baseUrl } from '../../baseUrl';



const Order = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [ itemss , setItemss] = useState([]);

  const itemsPerPage = 10;

  const token = '193|6Ka40eDonU5Y0BvdpjF0gFuZqNKPaGgOIqUvLRTUe9f9cbe6';

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setOrder(data.data || []);
    } catch (error) {
      console.error('App Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${baseUrl}/customers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCustomers(data.data || []);
    } catch (error) {
      console.error('Customer Fetch Error:', error);
    }
  };

    const fetchItems = async () => {
    try {
      const res = await fetch(`${baseUrl}/items`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setItemss(data.data || []);
    } catch (error) {
      console.error('Items Fetch Error:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchItems();
  }, []);

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const initialFormData = {
    Customer: '',
    date: new Date().toISOString().split('T')[0],
    Items: '',
    Quantity: '1',
    Price: '25',
    'Total Amount': '0',
    'Paid Amount': '0',
    Discount: '0',
    'Unpaid Amount': '0',
    Description: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleReset = () => {
    setFormData({
      Customer: '',
      date: formData.date,
      'Total Amount': '',
      'Paid Amount': '',
      'Discount': '',
      'Unpaid Amount': '',
      Description: '',
    });
    setItems([{ item: '', quantity: '', price: '25' }]);
  };

  const handleSubmit = () => {
    // Validate customer
    if (!formData.Customer) {
      alert('Please select a customer.');
      return;
    }

    // Validate items
    const isValidItems = items.every(
      item => item.item && item.quantity && parseInt(item.quantity) > 0
    );
    if (!isValidItems) {
      alert('Please select valid items with quantity.');
      return;
    }

const formattedItems = items.map(itemObj => {
  const foundItem = itemss.find(i => i.name === itemObj.item);
  return {
    item_id: foundItem ? foundItem.id : '', 
    price: 25,
    quantity: itemObj.quantity ? itemObj.quantity.toString() : "1",
  };
});

const bodyData = {
  customer_id: Number(formData.Customer),
  discription: formData.Description || '',
  date: formData.date || getTodayDate(),
  total_amount: formData['Total Amount'] ? Number(formData['Total Amount']) : 0,
  paid_amount: formData['Paid Amount'] ? formData['Paid Amount'].toString() : "0",
  unpaid_amount: formData['Unpaid Amount'] ? Number(formData['Unpaid Amount']) : 0,
  discount: formData['Discount'] ? formData['Discount'].toString() : "0",
  status: 'Pending',
  has_returned: false,
  returned_items: [],
  items: formattedItems,
};

    // const bodyData = {
    //   customer_id: 44,
    //   discription: "",
    //   date: "2025-07-17",
    //   total_amount: 25,
    //   paid_amount: "0",
    //   unpaid_amount: 25,
    //   discount: "0",
    //   status: "Pending",
    //   has_returned: false,
    //   returned_items: [],
    //   items: [
    //     {
    //       item_id: 2,
    //       price: 25,
    //       quantity: "1"
    //     }
    //   ]
    // }

    console.log('Body Data:', bodyData);

    // Make API call
    fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success || data.status === 'success' || data.message === 'Order created successfully') {
          alert('Customer order submitted successfully!');
          fetchOrders();
          setFormData(initialFormData);
          setItems([{ item: '', quantity: '' }]);
          setCurrentPage(1);
          setModalVisible(false);
        } else {
          alert(data.message || 'Failed to submit order!');
        }
      })
      .catch(error => {
        console.error('Submit Error:', error);
        alert('Something went wrong!');
      });
  };

  const calculateTotals = (updatedItems = items, form = formData) => {
    let total = 0;
    updatedItems.forEach((item) => {
      const qty = parseInt(item.quantity) || 0;
      const price = 25;
      total += qty * price;
    });

    const paid = parseInt(form['Paid Amount']) || 0;
    const discount = parseInt(form['Discount']) || 0;
    const unpaid = total - paid - discount;

    setFormData((prev) => ({
      ...prev,
      'Total Amount': total.toString(),
      'Unpaid Amount': unpaid >= 0 ? unpaid.toString() : '0',
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
    calculateTotals(updatedItems);
  };

  const handleChangeCalucaltion = (field, value) => {
    const updatedForm = { ...formData, [field]: value };
    setFormData(updatedForm);
    calculateTotals(items, updatedForm);
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${baseUrl}/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrder(data.data || []);
      })
      .catch((error) => console.error('App Error:', error))
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = order.filter((post) => {
    const input = searchId.toLowerCase();
    const customerName = post && post.customer && post.customer.name
      ? post.customer.name.toLowerCase()
      : '';
    return (
       customerName.includes(input)
    );
  });

  // initial state
  const [items, setItems] = useState([{ item: '', quantity: '1', price: '' }]);

  const handleAddItem = () => {
    setItems([...items, { item: '', quantity: '1', price: '' }]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };


  const paginatedPosts = filteredPosts.slice(0, currentPage * itemsPerPage);

  const renderCard = ({ item: post }) => (
    <View style={styles.card}>
      {/* <View style={styles.row}>
        <Text style={styles.label}>Order ID: </Text>
        <Text style={styles.description}>{post.id}</Text>
      </View> */}
      <View style={styles.row}>
        <Text style={styles.label}>Date: </Text>
        <Text style={styles.description}>{post.date || 'N/A'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Customer Name: </Text>
        <Text style={styles.description}>{post.customer?.name || 'N/A'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Total Amount: </Text>
        <Text style={styles.description}>₹{post.total_amount}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Paid Amount: </Text>
        <Text style={styles.description}>₹{post.paid_amount}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Unpaid Amount: </Text>
        <Text style={styles.description}>₹{post.unpaid_amount}</Text>
      </View>
      <View style={styles.actions}>
        <Icon.Button
          name="pencil"
          backgroundColor="#4CAF50"
          onPress={() => alert('Confirmed')}
          iconStyle={styles.iconStyle}>
        </Icon.Button>

        <Icon.Button
          name="trash"
          backgroundColor="#DB4437"
          onPress={() => alert('Deleted')}
          iconStyle={styles.iconStyle}>
        </Icon.Button>
      </View>
    </View>
  );



  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={{ fontSize: 25, textAlign: "center", marginBottom: 14, fontWeight: "bold" }}>*** Order List ***</Text>
        <TextInput
          style={styles.input}
          placeholder="Search by Name..."
           placeholderTextColor="#888"
          value={searchId}
          onChangeText={(text) => {
            setSearchId(text);
            setCurrentPage(1);
          }}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              setSearchId('');
              setCurrentPage(1);
            }}>
            <Text style={styles.buttonReset}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.button}>+ Add New</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={paginatedPosts}
          keyExtractor={(post, index) =>
            typeof post?.id === 'number' || typeof post?.id === 'string'
              ? String(post.id)
              : `key-${index}`
          }
          renderItem={renderCard}
          contentContainerStyle={styles.scrollContainer}
          ListFooterComponent={
            paginatedPosts.length < filteredPosts.length && (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={() => setCurrentPage(currentPage + 1)}>
                <Text style={styles.loadMoreText}>Load More</Text>
              </TouchableOpacity>
            )
          }
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>

            {/* ❌ Close Button */}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ alignSelf: 'flex-end' }}>
              <Text style={{ fontSize: 18, color: 'black' }}>✖</Text>
            </TouchableOpacity>

            <Text style={styles.modalText}>Add New Order</Text>

            <ScrollView style={{ maxHeight: 400 }} keyboardShouldPersistTaps="handled">

              {/* 👤 Customer Picker */}
              <Text style={styles.label}>Select Customer *</Text>
              <Picker
                selectedValue={formData.Customer}
                onValueChange={(value) => handleChangeCalucaltion('Customer', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Customer..." value="" />
                {customers.map((customer) => (
                  <Picker.Item key={customer.id} label={customer.name} value={customer.id} />
                ))}
              </Picker>

              {/* 📅 Date Picker */}
              <Text style={styles.label}>Select Date *</Text>
              <TouchableOpacity onPress={() => setDatePickerVisible(false)}>
                <TextInput
                  style={styles.inputModal}
                  placeholder="YYYY-MM-DD"
                  value={formData.date || ''}
                  editable={false}
                />
              </TouchableOpacity>

              {/* 📦 Items Section */}
              <Text style={styles.label}>Items *</Text>
              {items.map((itemObj, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <Picker
                    selectedValue={itemObj.item}
                    onValueChange={(value) => handleItemChange(index, 'item', value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Item" value="" />
                    <Picker.Item label="Jar" value="Jar" />
                    <Picker.Item label="Bottle" value="Bottle" />
                  </Picker>

                  <View style={{ flexDirection: 'row', gap: 5 }}>
                    <TextInput
                      style={[styles.inputModalextra, { flex: 1 }]}
                      placeholder="Qty"
                      value={itemObj.quantity}
                      onChangeText={(text) => handleItemChange(index, 'quantity', text)}
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={[styles.inputModalextra, { flex: 1 }]}
                      placeholder="25"
                      value="25"
                      onChangeText={(text) => handleChangeCalucaltion('Price', text)}
                      editable={false}
                    />
                    {index !== 0 && (
                      <Icon.Button
                        name="trash"
                        color="red"
                        backgroundColor="white"
                        style={{ fontSize: 44, marginTop: 10 }}
                        onPress={() => handleRemoveItem(index)}
                      />
                    )}
                    {index === items.length - 1 && (
                      <Icon.Button
                        name="plus"
                        color="green"
                        backgroundColor="white"
                        style={{ fontSize: 74, marginTop: 10 }}
                        onPress={handleAddItem}
                      />
                    )}
                  </View>
                </View>
              ))}

              {/* 💰 Total, Paid, Discount, Unpaid */}
              <Text style={styles.label}>Total Amount *</Text>
              <TextInput
                style={styles.inputModal}
                placeholder="0"
                value={formData['Total Amount']}
                editable={false}
              />

              <Text style={styles.label}>Paid Amount *</Text>
              <TextInput
                style={styles.inputModal}
                placeholder="0"
                value={formData['Paid Amount']}
                onChangeText={(text) => handleChangeCalucaltion('Paid Amount', text)}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Discount</Text>
              <TextInput
                style={styles.inputModal}
                placeholder="0"
                value={formData['Discount']}
                onChangeText={(text) => handleChangeCalucaltion('Discount', text)}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Unpaid Amount</Text>
              <TextInput
                style={styles.inputModal}
                placeholder="0"
                value={formData['Unpaid Amount']}
                editable={false}
              />

              {/* 📝 Description */}
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.inputModal}
                placeholder="Enter Description"
                value={formData.Description}
                onChangeText={(text) => handleChange('Description', text)}
              />
            </ScrollView>

            {/* 🔘 Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.ResetButton} onPress={handleReset}>
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.SubmitButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


    </View>
  );
};

export default Order;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#e4eef3ff',
  },
  searchContainer: {
    marginBottom: 10,
    // backgroundColor: '#ffffffff',
    // flexDirection: 'row',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 5,
    borderRadius: 9,
    backgroundColor: "white",
    color: '#000',
    width: '93%',
    marginLeft: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#51ac07ff',
    padding: 10,
    color: 'white',
    borderRadius: 5,
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 17,
    paddingHorizontal: 20,
  },
  buttonReset: {
    backgroundColor: '#d45353ff',
    padding: 10,
    color: 'white',
    borderRadius: 5,
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 17,
    paddingHorizontal: 35,
    // paddingVertical: 14,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  description: {
    flex: 1,
    marginLeft: 5,
  },
  descCustomerName: {
    flex: 1,
    marginLeft: 5,
    textTransform: 'uppercase',
  },
  actions: {
    flexDirection: 'row',
    // justifyContent: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  iconStyle: {
    marginRight: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 19,
    textAlign: 'center',
  },
  inputModal: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 13,
    marginBottom: 14,
    marginTop: 6,
  },
  inputModalextra: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  ResetButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  SubmitButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputsearch: {
    borderWidth: 1,
    borderColor: 'darkgray',
    borderRadius: 8,
    width: '70%',
    padding: 10,
    backgroundColor: '#fff',
    color: '#000',
    fontSize: 15,
    height: 45,
    marginBottom: 10,
  },
  buttonNew: {
    backgroundColor: '#007bff',
    padding: 10,
    color: 'white',
    borderRadius: 5,
    marginLeft: 10,
  },
  loadMoreButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  loadMoreText: {
    color: 'white',
    fontWeight: 'bold',
  },
  picker: {
    backgroundColor: '#f0f0f0',
    color: '#000',
  },
  labeldate: {
    fontWeight: 'bold',
    marginTop: 10,
  }

});
