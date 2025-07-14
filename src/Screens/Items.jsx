import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Items = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Items Screen</Text>
    </View>
  )
}

export default Items

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