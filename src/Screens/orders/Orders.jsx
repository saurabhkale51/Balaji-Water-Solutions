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


const Order = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState([]);

  const itemsPerPage = 10;

  const token = '188|UitrKqKR3BWekraCScqaFd6xf1ILMeusDe3ZXr48a354bd26';

  useEffect(() => {

    setLoading(true);
    fetch('https://onlinetradings.in/batla-backend/public/api/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.data || []);
      })
      .catch((error) => console.error('App Error:', error))
      .finally(() => setLoading(false));

    fetch('https://onlinetradings.in/batla-backend/public/api/customers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data.data || []);
      })
      .catch((error) => console.error('Customer Fetch Error:', error));
  }, []);

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const initialFormData = {
    Customer: '',
    date: getTodayDate(),
    Items: '',
    Quantity: '1',
    Price: '25',
    'Total Amount': '',
    'Paid Amount': '',
    Discount: '',
    'Unpaid Amount': '',
    Description: '',
    date: new Date().toISOString().split('T')[0],
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleReset = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = () => {
    fetch('https://onlinetradings.in/batla-backend/public/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        customer: formData.Customer,
        items: formData.Items,
        quantity: formData.Quantity,
        price: formData.Price,
        total_amount: formData['Total Amount'],
        paid_amount: formData['Paid Amount'],
        discount: formData.Discount,
        unpaid_amount: formData['Unpaid Amount'],
        description: formData.Description,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert('Customer order submitted successfully!');
        const customerObj = customers.find(
          (c) => String(c.id) === String(formData.Customer)
        );
        const newOrder = {
          id: data?.data?.id,
          date: data?.data?.date || new Date().toISOString().split('T')[0],
          customer: customerObj ? { name: customerObj.name } : { name: '' },
          total_amount: formData['Total Amount'],
          paid_amount: formData['Paid Amount'],
          unpaid_amount: formData['Unpaid Amount'],
        };
        setPosts([newOrder, ...posts]);
        setFormData(initialFormData);
        setCurrentPage(1);
        setModalVisible(false);
      })
      .catch((error) => {
        console.error('Submit Error:', error);
        alert('Something went wrong!');
      });
  };

  useEffect(() => {
    setLoading(true);
    fetch('https://onlinetradings.in/batla-backend/public/api/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.data || []);
      })
      .catch((error) => console.error('App Error:', error))
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = posts.filter((post) => {
    const input = searchId.toLowerCase();
    const customerName = post && post.customer && post.customer.name
      ? post.customer.name.toLowerCase()
      : '';
    return (
      post?.id?.toString().includes(input) ||
      customerName.includes(input)
    );
  });


  const handleChangeCalucaltion = (key, value) => {
    const updatedForm = { ...formData, [key]: value };

    const qty = parseInt(updatedForm.Quantity) || 0;
    const price = parseInt(updatedForm.Price) || 0;
    const paid = parseInt(updatedForm['Paid Amount']) || 0;
    const discount = parseInt(updatedForm['Discount']) || 0;

    // Calculate total
    const total = qty * price;
    updatedForm['Total Amount'] = total.toString();

    // Calculate unpaid: total - paid - discount
    const unpaid = total - paid - discount;
    updatedForm['Unpaid Amount'] = unpaid.toString();

    setFormData(updatedForm);
  };



  const paginatedPosts = filteredPosts.slice(0, currentPage * itemsPerPage);

  const renderCard = ({ item: post }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Order ID: </Text>
        <Text style={styles.description}>{post.id}</Text>
      </View>
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
          name="trash"
          backgroundColor="#DB4437"
          onPress={() => alert('Deleted')}
          iconStyle={styles.iconStyle}>
          Delete
        </Icon.Button>
        <Icon.Button
          name="check"
          backgroundColor="#4CAF50"
          onPress={() => alert('Confirmed')}
          iconStyle={styles.iconStyle}>
          Edit
        </Icon.Button>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search by ID or Name..."
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
            <Text style={styles.modalText}>Add New Order</Text>
            <ScrollView style={{ maxHeight: 400 }}>

              {/* Customer Name Dropdown */}
              <Text style={styles.label}>Select Customer *</Text>
              <Picker
                selectedValue={formData.Customer}
                onValueChange={(value) => handleChangeCalucaltion('Customer', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Customer..." value="" />
                {customers.map((customer) => (
                  <Picker.Item
                    key={customer.id}
                    label={customer.name}
                    value={customer.id}
                  />
                ))}
              </Picker>

              {/* Date Picker */}
              <Text style={styles.label}>Select Date *</Text>
              <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
                <TextInput
                  style={styles.inputModal}
                  placeholder="YYYY-MM-DD"
                  value={formData.date || ''}
                  editable={false}
                />
              </TouchableOpacity>

              {/* Items Dropdown */}
              <Text style={styles.label}>Select Item *</Text>
              <Picker
                selectedValue={formData.Items}
                onValueChange={(value) => handleChangeCalucaltion('Items', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Item........." value="" />
                <Picker.Item label="Jar" value="Jar" />
                <Picker.Item label="Bottle" value="Bottle" />
              </Picker>

              {/* Quantity */}
              <Text style={styles.label}>Quantity *</Text>
              <TextInput
                style={styles.inputModal}
                placeholder="1"
                value={formData.Quantity}
                onChangeText={(text) => handleChangeCalucaltion('Quantity', text)}
                keyboardType="numeric"
              />

              {/* Price */}
              <Text style={styles.label}>Price (₹) *</Text>
              <TextInput
                style={styles.inputModal}
                placeholder="25"
                value={formData.Price}
                onChangeText={(text) => handleChangeCalucaltion('Price', text)}
                keyboardType="numeric"
              />

              {/* Total Amount */}
              <Text style={styles.label}>Total Amount *</Text>
              <TextInput
                style={styles.inputModal}
                placeholder="0"
                value={formData['Total Amount']}
                editable={false}
              />

              {/* Paid Amount */}
              <Text style={styles.label}>Paid Amount *</Text>
              <TextInput
                style={styles.inputModal}
                placeholder="0"
                value={formData['Paid Amount']}
                onChangeText={(text) => handleChangeCalucaltion('Paid Amount', text)}
                keyboardType="numeric"
              />

              {/* Discount */}
              <Text style={styles.label}>Discount</Text>
              <TextInput
                style={styles.inputModal}
                placeholder="0"
                value={formData['Discount']}
                onChangeText={(text) => handleChangeCalucaltion('Discount', text)}
                keyboardType="numeric"
              />

              {/* Unpaid Amount */}
              <Text style={styles.label}>Unpaid Amount</Text>
              <TextInput
                style={styles.inputModal}
                placeholder="0"
                value={formData['Unpaid Amount']}
                editable={false}
              />

              {/* Description */}
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.inputModal}
                placeholder="Enter Description"
                value={formData.Description}
                onChangeText={(text) => handleChange('Description', text)}
              />
            </ScrollView>

            {/* Buttons */}
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
  },
  searchContainer: {
    marginBottom: 10,
    // backgroundColor: '#491919ff',
    // flexDirection: 'row',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    color: 'white',
    borderRadius: 5,
    fontWeight: "bold",
    marginTop: 10,
  },
  buttonReset: {
    backgroundColor: '#3499e6ff',
    padding: 10,
    color: 'white',
    borderRadius: 5,
    fontWeight: "bold",
    marginTop: 10,
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
    justifyContent: 'space-between',
    marginTop: 10,
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
    marginBottom: 15,
    textAlign: 'center',
  },
  inputModal: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
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

});
