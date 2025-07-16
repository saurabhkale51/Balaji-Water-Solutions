import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Customer = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [customerData, setCustomerData] = useState([]);

  const token = '181|8Cjdie9eq95lFBiD1ODuU3hpG9E4I39woo4RBnPZ6794ab68';

  useEffect(() => {
    fetch('https://onlinetradings.in/batla-backend/public/api/customers', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
      .then(response => response.json())
      .then(json => {
        console.log('API Response:', json);
        if (json.success) {
          setCustomerData(json.data);
        } else {
          console.error('API error:', json.message);
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }, []);

  const handleSubmit = () => {
    if (!name || !mobile) {
      alert('Please fill required fields');
      return;
    }

    const newCustomer = {
      name: name,
      phone: mobile,
      address: address,
    };

    if (editMode) {
      console.log('Edit Mode Active - Update Logic Here');
      // Update logic याठिकाणी येईल (PATCH/PUT logic if API देत असेल)
    } else {
      // Add New Customer
      fetch('https://onlinetradings.in/batla-backend/public/api/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert('Customer added successfully!');
            // Updated list साठी GET call
            setCustomerData(prev => [...prev, data.data]); // नवीन डेटा append करतो
            setModalVisible(false);
            setName('');
            setMobile('');
            setAddress('');
          } else {
            alert('Failed: ' + data.message);
          }
        })
        .catch(err => {
          console.error('POST Error:', err);
          alert('Something went wrong!');
        });
    }
  };


  const handleResetForm = () => {
    setName('');
    setMobile('');
    setAddress('');
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setName(customer.name);
    setMobile(customer.phone);
    setAddress(customer.address || '');
    setEditMode(true);
    setModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Customer List</Text>

      <TextInput
        style={styles.searchInput}
        placeholder='Search by Name'
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.SearchBtn}>
          <Text style={styles.BtnText}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ResetBtn} onPress={() => setSearchText('')}>
          <Text style={styles.BtnText}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.AddNewBtn}
          onPress={() => {
            setModalVisible(true);
            setEditMode(false);
            setSelectedCustomer(null);
            handleResetForm();
          }}
        >
          <Text style={styles.BtnText}>+ Add New</Text>
        </TouchableOpacity>
      </View>

      {/* Customer Cards */}
      {customerData
        .filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()))
        .map(customer => (
          <View key={customer.id} style={styles.Card}>
            <View style={styles.cardTopRow}>
              <Text style={styles.cardTitle}>ID: {customer.id}</Text>
              <View style={styles.actionButtons}>

                <TouchableOpacity style={styles.IconBtn} onPress={() => handleEdit(customer)}>
                  <Icon name="edit" size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.IconBtn, { backgroundColor: '#ff4d4d' }]}>
                  <Icon name="delete" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.cardRow}>
              <Text style={styles.CardLabel}>Name:</Text>
              <Text style={styles.CardValue}>{customer.name}</Text>
            </View>

            <View style={styles.cardRow}>
              <Text style={styles.CardLabel}>Pending Items:</Text>
              <Text style={styles.CardValue}>
                {customer.pending_items?.length > 0
                  ? customer.pending_items.join(', ')
                  : 'None'}
              </Text>
            </View>

            <View style={styles.cardRow}>
              <Text style={styles.CardLabel}>Mobile No:</Text>
              <Text style={styles.CardValue}>{customer.phone}</Text>
            </View>

            <View style={styles.cardRow}>
              <Text style={styles.CardLabel}>Address:</Text>
              <Text style={styles.CardValue}>{customer.address || 'N/A'}</Text>
            </View>
          </View>
        ))}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.cancelIcon}
              onPress={() => {
                setModalVisible(false);
                setEditMode(false);
                setSelectedCustomer(null);
                handleResetForm();
              }}
            >
              <Icon name="close" size={24} color="#444" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>{editMode ? 'Edit Customer' : 'Add New Customer'}</Text>

            <Text style={styles.inputLabel}>Name *</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter Name *"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.inputLabel}>Mobile Number *</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter Mobile Number *"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={setMobile}
            />

            <Text style={styles.inputLabel}>Address</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter Address"
              value={address}
              onChangeText={setAddress}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#1FAB89' }]}
                onPress={handleSubmit}
              >
                <Text style={styles.BtnText}>{editMode ? 'Update' : 'Submit'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#FF595E' }]}
                onPress={handleResetForm}
              >
                <Text style={styles.BtnText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Customer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f6f9',
    padding: 15
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#05445E',
    textAlign: 'center'
  },
  searchInput: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25
  },
  SearchBtn: {
    backgroundColor: '#189AB4',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginRight: 5
  },
  ResetBtn: {
    backgroundColor: '#FF595E',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5
  },
  AddNewBtn: {
    backgroundColor: '#1FAB89',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginLeft: 5
  },
  BtnText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: 'white'
  },
  Card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 15,
    elevation: 4,
    marginBottom: 20
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  actionButtons: {
    flexDirection: 'row'
  },
  IconBtn: {
    backgroundColor: '#3a7cf7',
    padding: 6,
    borderRadius: 6,
    marginLeft: 10
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6
  },
  CardLabel: {
    fontSize: 16,
    fontWeight: '600',
    width: 130,
    color: '#333'
  },
  CardValue: {
    fontSize: 16,
    color: '#555'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#05445E'
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 10,
    marginBottom: 5
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 8
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 10
  },
  cancelIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 5
  }
});
