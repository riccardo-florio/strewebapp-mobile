import { Text, View, StyleSheet, TextInput } from 'react-native'
import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from '@react-navigation/elements';

export class app extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>StreWebApp</Text>
        <View style={styles.searchBar}>
          <TextInput
            placeholder='Nome del film / serie tv'
            style={{ color: 'white' }}
          />
          <Button style={styles.icon} >
            <Icon name='search' size={20} styles={{color:'white'}} />
          </Button>
        </View>
      </View>
    )
  }
}

export default app

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#212121',
    gap: 20,
  },
  searchBar: {
    borderWidth: 1,
    borderRadius: 100,
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
  },
  text: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'semibold',
  },
  icon: {
    color: 'white',
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 100,
  }
})