import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Customer = () => {
  return (
   <View style={styles.container}>
         <Text style={styles.text}>Welcome to Customer Screen</Text>
       </View>
  )
}

export default Customer

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
  },
})