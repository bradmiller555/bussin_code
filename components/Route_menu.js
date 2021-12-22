import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';

const win_width = Dimensions.get('window').width;
const win_height = Dimensions.get('window').height;

function Route_Item(eta, address, color, key) {
  return (
    <View style={styles.route_item} key={key}>
      <View style={[styles.item_eta, {backgroundColor: color}]}>
        <Text style={styles.eta_txt}>{eta}</Text>
      </View>
      <View style={styles.item_add}>
        <Text style={styles.add_txt}>{address}</Text>
      </View>
    </View>
  );
}

export default function Route({parentToChild}) {
  const stops = parentToChild;

  function Route_Items() {
    var items = [];
    for (const i in stops) {
      items.push(Route_Item(stops[i].eta_text, stops[i].address, stops[i].color, i));
    }
    return (items);
  }

  return (
    <View style={styles.route}>
      <View style={styles.route_menu}>
        <View style={{ flex: 2 }}>
          <View style={styles.route_header}>
            <Text style={{ fontSize: 36 }}>Route</Text>
            <Image
              style={styles.nav_img}
              source={require('../assets/route_nav.png')}
            />
          </View>
        </View>
        <View style={styles.route_items}>
          <View style={{ height: '82%' }}>
            <ScrollView>
              <Route_Items />
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  route: {
    width: win_width,
    height: win_height,
    flexDirection: 'row',
  },
  route_menu: {
    marginLeft: '20%',
    width: '80%',
    backgroundColor: '#eccc3b',
    flexDirection: 'column',
  },
  route_header: {
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
  route_items: {
    flex: 8,
    backgroundColor: '#eccc3b',
  },
  route_item: {
    width: '90%',
    height: 0.08 * win_height,
    marginLeft: '5%',
    marginRight: '5%',
    marginBottom: '2%',
    marginTop: '2%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 0.05*win_width,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.25,
    shadowRadius: 0.01*win_width,
  },
  item_eta: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 0.05*win_width,
  },
  eta_txt: {
    fontSize: 20,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  item_add: {
    flex: 3,
    justifyContent: 'center',
  },
  add_txt: {
    fontSize: 16,
    padding: '5%',
  },
});
