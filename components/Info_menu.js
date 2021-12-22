import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
} from 'react-native';
import {info} from './Splash'

const win_width = Dimensions.get('window').width;
const win_height = Dimensions.get('window').height;

export default function Info() {
  return (
    <View style={styles.info}>
      <View style={styles.info_menu}>
        <View style={{ flex: 2 }}>
          <View style={styles.info_header}>
            <Text style={{ fontSize: 36 }}>Information</Text>
            <Image
              style={styles.nav_img}
              source={require('../assets/info_nav.png')}
            />
          </View>
        </View>
        <View style={styles.info_ID}>
          <Text>District</Text>
          <Text style={styles.id_label}>{info['district']}</Text>
          <Text>Route ID</Text>
          <Text style={styles.id_label}>{info['route_id']}</Text>
        </View>
        <View style={styles.info_footer}>
          <View style={styles.footer_content}>
            <Pressable style={{flex: 1}}>
              <Text>Support</Text>
            </Pressable>
            <Text>Version 0.1</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    width: win_width,
    height: win_height,
    flexDirection: 'row',
  },
  info_menu: {
    backgroundColor: '#eccc3b',
    flexDirection: 'column',
    width: '80%',
  },
  info_header: {
    flexDirection: 'row',
    paddingTop: '25%',
    justifyContent: 'center',
  },
  nav_img: {
    marginTop: '2.5%',
    marginLeft: '5%',
    width: 0.075*win_width,
    height: 0.075*win_width,
  },
  info_ID: {
    flex: 7,
    margin: '10%',
  },
  id_label: {
    fontSize: 36,
    padding: '5%',
    backgroundColor: '#fff',
    textAlign: 'center',
    marginTop: '5%',
    marginBottom: '15%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.25,
  },
  info_footer: {
    marginBottom: 0.13*win_height,
    marginLeft: '10%',
    marginRight: '10%',
    justifyContent: 'flex-end',
    flex: 1,
  },
  footer_content: {
    flexDirection: 'row',
    padding: '7%',
  },
});
