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
import { Alert } from 'react-native';
import { baseUrl } from './baseUrl';

const Customer = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [customerData, setCustomerData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = '181|8Cjdie9eq95lFBiD1ODuU3hpG9E4I39woo4RBnPZ6794ab68';

  useEffect(() => {
    fetch(`${baseUrl}/customers`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
      .then(response => response.json())
      .then(json => {
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

    const customerPayload = {
      name: name,
      phone: mobile,
      address: address,
    };

    if (editMode && selectedCustomer) {
      fetch(`${baseUrl}/customers/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(customerPayload),
      })
        .then(async res => {
          const text = await res.text();
          const data = text ? JSON.parse(text) : {};
          if (res.ok) {
            alert('Customer updated successfully!');
            setCustomerData(prev =>
              prev.map(item =>
                item.id === selectedCustomer.id ? { ...item, ...customerPayload } : item
              )
            );
            setModalVisible(false);
            setEditMode(false);
            setSelectedCustomer(null);
            handleResetForm();
          } else {
            alert('Update failed: ' + (data.message || 'Unknown error'));
          }
        })
        .catch(err => {
          console.error('Update error:', err);
          alert('Something went wrong while updating the customer.');
        });
    } else {
      fetch('${baseUrl}/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(customerPayload),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert('Customer added successfully!');
            setCustomerData(prev => [data.data, ...prev]);
            setModalVisible(false);
            handleResetForm();
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

  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this customer?",
      [
        {
          text: "Cancel",
          onPress: () => { },
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            fetch(`${baseUrl}/customers/${id}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
              },
            })
              .then(async (res) => {
                const text = await res.text();
                const data = text ? JSON.parse(text) : {};

                if (res.ok) {
                  alert('Customer deleted successfully!');
                  setCustomerData(prev => prev.filter(item => item.id !== id));
                } else {
                  alert('Delete failed: ' + (data.message || 'Unknown error'));
                }
              })
              .catch((err) => {
                console.error('Delete error:', err);
                alert('Something went wrong while deleting the customer.');
              });
          },
          style: "destructive"
        }
      ]
    );
  };

  const filteredData = customerData.filter(item => {
    const lowerSearch = searchText.toLowerCase();
    return (
      item.name.toLowerCase().includes(lowerSearch) ||
      item.id.toString().includes(lowerSearch)
    );
  });


  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = searchText === ''
    ? filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredData;


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Customer List</Text>

      <TextInput
        style={styles.searchInput}
        placeholder='Search by Name ,id'
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.buttonRow}>
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

      <ScrollView>
        {paginatedData.map(customer => (
          <View key={customer.id} style={styles.Card}>
            <View style={styles.cardTopRow}>
              <Text style={styles.cardTitle}>ID: {customer.id}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.IconBtn} onPress={() => handleEdit(customer)}>
                  <Icon name="edit" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.IconBtn, { backgroundColor: '#ff4d4d' }]}
                  onPress={() => handleDelete(customer.id)}
                >
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
                  ? customer.pending_items.map(obj => obj.name).join(', ')
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

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
          <TouchableOpacity
            disabled={currentPage === 1}
            onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            style={[styles.pageBtn, currentPage === 1 && { opacity: 0.5 }]}
          >
            <Text style={styles.pageBtnText}>Previous</Text>
          </TouchableOpacity>

          <Text style={{ alignSelf: 'center', marginHorizontal: 10, fontSize: 16 }}>
            Page {currentPage} of {totalPages}
          </Text>

          <TouchableOpacity
            disabled={currentPage === totalPages}
            onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            style={[styles.pageBtn, currentPage === totalPages && { opacity: 0.5 }]}
          >
            <Text style={styles.pageBtnText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
                style={[styles.modalButton, { backgroundColor: '#FF595E' }]}
                onPress={handleResetForm}
              >
                <Text style={styles.BtnText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#1FAB89' }]}
                onPress={handleSubmit}
              >
                <Text style={styles.BtnText}>{editMode ? 'Update' : 'Submit'}</Text>
              </TouchableOpacity>


            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Customer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f6f9',
    padding: 15,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#05445E',
    textAlign: 'center',
  },
  searchInput: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  ResetBtn: {
    backgroundColor: '#FF595E',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginRight: 5,
  },
  AddNewBtn: {
    backgroundColor: '#1FAB89',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginLeft: 5,
  },
  BtnText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  Card: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 15,
    elevation: 4,
    marginBottom: 20,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  IconBtn: {
    backgroundColor: '#3a7cf7',
    padding: 6,
    borderRadius: 6,
    marginLeft: 10,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  CardLabel: {
    fontSize: 16,
    fontWeight: '600',
    width: 130,
    color: '#333',
  },
  CardValue: {
    fontSize: 16,
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#05445E',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 10,
    marginBottom: 5,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 10,
  },
  cancelIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 5,
  },
  pageBtn: {
    backgroundColor: '#05445E',
    padding: 10,
    borderRadius: 10,
  },
  pageBtnText: {
    color: 'white',
    fontWeight: '600',
  },
});


