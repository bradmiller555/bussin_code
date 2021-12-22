import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Dimensions,
  Image,
  Pressable
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import Route from './components/Route_menu';
import Info from './components/Info_menu';
import { Splash, info } from './components/Splash';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

const g_apikey = '';
const code = info['route_id'];
const district = info['district'];
const map_delta = 0.05;

const win_width = Dimensions.get('window').width;
const win_height = Dimensions.get('window').height;
const nav_size = win_height * 0.07;

const LView = Animated.createAnimatedComponent(Animated.View);
const RView = Animated.createAnimatedComponent(Animated.View);
const INav = Animated.createAnimatedComponent(Animated.View);
const RNav = Animated.createAnimatedComponent(Animated.View);
const CNav = Animated.createAnimatedComponent(Animated.View);
const NavImg = Animated.createAnimatedComponent(Animated.Image);
const Overlay = Animated.createAnimatedComponent(Animated.View);

let info_open = false;
let route_open = false;

let stops = [];
let visited = [];
let etas = [];
let fb_stops = [];

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function getDistricts() {
  const db = getDatabase();
  const reference = ref(db);
  let data;
  let district_array = []
  onValue(reference, (snapshot) => {
    data = snapshot.val();
  })
  for (let d in data) {

  }
  console.log('data:' + data);
  return (district_array);
}

function setLocation(code, locX, locY,) {
  if (locX !== undefined && locY !== undefined) {
    const db = getDatabase();
    set(ref(db, info['district'] + '/' + code + '/coords'), {
      X: locX,
      Y: locY
    });
  }
}

function getStops(code) {
  console.log('get stops');
  const db = getDatabase();
  const reference = ref(db, info['district'] + '/' + code + '/routes');
  let data;
  let fb_stops = []
  onValue(reference, (snapshot) => {
    data = snapshot.val();
  })
  let i = 10;
  for (const d in data) {
    fb_stops.push(data[i.toString()]);
    i++;
  }
  return (fb_stops);
}

async function generateStops() {
  let i = 0;
  for (const s in fb_stops) {
    let axios = require('axios');
    let config = {
      method: 'get',
      url: 'https://maps.googleapis.com/maps/api/geocode/json?place_id=' + fb_stops[s] + '&key=' + g_apikey,
      headers: {}
    };

    let latitude;
    let longitude;
    let address;

    const j = i.valueOf();

    await axios(config)
      .then(function (response) {
        let resp = response.data;
        let results = resp.results[0];
        let location = results.geometry.location;
        latitude = location.lat;
        longitude = location.lng;
        let add = results.address_components[1];
        address = add.short_name;
        stops[j] = new Stop(0, address, latitude, longitude);
      })
      .catch(function (error) {
        console.log(error);
      });

    i++;
  }
  console.log("stops generated");
}

class Stop {
  constructor(eta, address, latitude, longitude) {
    this.eta = eta;
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.formatEta(this.eta);
  }

  formatEta(eta) {
    if (eta == 0) {
      this.eta_text = 'Visited';
      this.color = '#59f';
    } else {
      this.eta_text = eta + ' min';
      this.color = '#0f0';
    }
  }

  changeEta(eta) {
    if (eta < 15) {
      this.eta = 0;
    } else {
      this.eta = Math.ceil(eta / 60);
    }
    this.eta_text = this.eta.toString() + ' min';
    this.formatEta(this.eta);
  }
}

export default function App() {
  console.log('\n\nReload');
  return (
    <>
      <Splash />
      <Main />
    </>
  );
}

function Main() {

  const info_anim = useRef(new Animated.Value(-win_width)).current;
  const route_anim = useRef(new Animated.Value(-win_width)).current;
  const inav_anim = useRef(new Animated.Value(0.1 * win_width)).current;
  const rnav_anim = useRef(new Animated.Value(0.1 * win_width)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const overlay_fade = useRef(new Animated.Value(0)).current;
  const overlay_z = useRef(new Animated.Value(-1)).current;
  const anim_dur = 250;
  const cnav = useRef(new Animated.Value(0.5 * win_width - 0.5 * nav_size)).current;

  function Map_Marker(eta, address, color, latitude, longitude, key) {
    return (
      <Marker
        coordinate={{ latitude, longitude }}
        title={address}
        description={eta}
        pinColor={color}
        key={key}
      />
    );
  }

  function Map_Markers() {
    let items = [];
    for (const i in stops) {
      items.push(Map_Marker(stops[i].eta_text, stops[i].address, stops[i].color, stops[i].latitude, stops[i].longitude, i));
    }
    return (items);
  }

  const info_toggle = () => {
    if (!info_open && !route_open) {
      Animated.timing(info_anim, {
        toValue: 0,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(inav_anim, {
        toValue: 0.6 * win_width,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(rnav_anim, {
        toValue: -0.4 * win_width,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(fade, {
        toValue: 0,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(overlay_fade, {
        toValue: 0.5,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(overlay_z, {
        toValue: 1,
        duration: anim_dur * 1.5,
        useNativeDriver: false,
      }).start();
      Animated.timing(cnav, {
        toValue: win_width,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      info_open = true;
    } else if (info_open) {
      Animated.timing(info_anim, {
        toValue: -win_width,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(inav_anim, {
        toValue: 0.1 * win_width,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(rnav_anim, {
        toValue: 0.1 * win_width,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(fade, {
        toValue: 1,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(overlay_fade, {
        toValue: 0,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(overlay_z, {
        toValue: -1,
        duration: anim_dur * 1.5,
        useNativeDriver: false,
      }).start();
      Animated.timing(cnav, {
        toValue: 0.5 * win_width - 0.5 * nav_size,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      info_open = false;
    }
  };

  const route_toggle = () => {
    // Will change fadeAnim value to 1 in duration milliseconds
    if (!info_open && !route_open) {
      Animated.timing(route_anim, {
        toValue: 0,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(rnav_anim, {
        toValue: 0.6 * win_width,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(inav_anim, {
        toValue: -0.4 * win_width,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(fade, {
        toValue: 0,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(overlay_fade, {
        toValue: 0.5,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(overlay_z, {
        toValue: 1,
        duration: anim_dur * 1.5,
        useNativeDriver: false,
      }).start();
      Animated.timing(cnav, {
        toValue: -1 * nav_size,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      route_open = true;
      parentToChild();
    } else if (route_open) {
      Animated.timing(route_anim, {
        toValue: -win_width,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(rnav_anim, {
        toValue: 0.1 * win_width,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(inav_anim, {
        toValue: 0.1 * win_width,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(fade, {
        toValue: 1,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(overlay_fade, {
        toValue: 0,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(overlay_z, {
        toValue: -1,
        duration: anim_dur * 1.5,
        useNativeDriver: false,
      }).start();
      Animated.timing(cnav, {
        toValue: 0.5 * win_width - 0.5 * nav_size,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      route_open = false;
    }
  };

  const [data, setData] = useState('');
  const parentToChild = () => {
    setData(stops);
  }

  const [region, setRegion] = useState({
    curLoc: {
      latitude: 40,
      longitude: -74,
    },
  });

  let curLoc = region.curLoc;

  async function calculateRoute() {
    console.log('calculating route');
    etas = [];
    let time_total = 0;
    let start = 0;

    for (let s = 0; s < visited.length; s++) {
      if (visited[s]) {
        start = s+1;
        etas.push(0);
      }
    }

    const url1 = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + curLoc.latitude.toString() + '%2C' + curLoc.longitude.toString() + '&destinations=place_id:' + fb_stops[start] + '&units=imperial&key=' + g_apikey;

    let axios = require('axios');
    //time value is in seconds
    let config = {
      method: 'get',
      url: url1,
      headers: {}
    };

    await axios(config)
      .then(function (response) {
        let mapData = response.data;
        let time = mapData.rows[0].elements[0].duration.value;
        //HERE IT PRINTS OUT THE JSON RETURNED BY GOOGLE API
        //console.log(JSON.stringify(response.data));
        if(time < 15){
          visited[start] = true;
        }
        time_total += time;
        etas.push(time_total);
        //console.log(time_total);
      })
      .catch(function (error) {
        console.log(error);
      });

    for (let s = start; s < fb_stops.length-1; s++) {
      console.log('s' + s);
      const url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:' + fb_stops[s] + '&destinations=place_id:' + fb_stops[s+1] + '&units=imperial&key=' + g_apikey;

      axios = require('axios');
      //time value is in seconds
      config = {
        method: 'get',
        url: url,
        headers: {}
      };

      await axios(config)
        .then(function (response) {
          let mapData = response.data;
          let time = mapData.rows[0].elements[0].duration.value;
          //HERE IT PRINTS OUT THE JSON RETURNED BY GOOGLE API
          //console.log(JSON.stringify(response.data));
          time_total += time;
          etas.push(time_total);
          console.log('success' + s);
          //console.log(time_total);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    etaStops();
    console.log('visited ' + visited);
    console.log('calculated');
    return etas;
  }

  function etaStops() {
    for (const eta in etas) {
      //console.log('eta: ' + etas[eta]);
      stops[eta].changeEta(etas[eta]);
    }
    parentToChild();
  }

  function center() {
    setRegion({
      curLoc: curLoc,
    });
  }

  async function getDriver() {
    const start = await Location.getCurrentPositionAsync();
    //WE will manually enter coordinates for each stop, you can also add lat and longitude as function paramters
    let longitude1 = start.coords.longitude;
    let latitude1 = start.coords.latitude;
    setLocation(code, longitude1, latitude1);
    console.log('driver:' + latitude1 + ' ' + longitude1);
  }

  const getLocation = (code) => {
    const db = getDatabase();
    const reference = ref(db, district + '/' + code + '/coords');
    onValue(reference, (snapshot) => {
      const longitude = snapshot.val().X;
      const latitude = snapshot.val().Y;
      console.log('retrieved: ' + latitude + " " + longitude);
      setRegion({
        curLoc: { latitude, longitude },
      });
    });
  }

  useEffect(() => {
    fb_stops = getStops(code);
    for (let s in fb_stops) {
      visited.push(false);
    }
    generateStops();
    if (info['driver'] == true) {
      getDriver();
    }
    getLocation(code);
    calculateRoute();
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('7 seconds')
      fb_stops = getStops(code);
      if (info['driver'] == true) {
        getDriver();
      }
      getLocation(code);
      calculateRoute();
    }, 7000);
    return () => clearInterval(interval)
  })

  return (
    <View style={styles.main}>
      <MapView style={styles.map} provider={'google'} region={{
        latitude: curLoc.latitude,
        longitude: curLoc.longitude,
        latitudeDelta: map_delta,
        longitudeDelta: map_delta,
      }}
      >
        <Map_Markers />
        <Marker.Animated
          coordinate={curLoc}
          title={"Driver"}
          pinColor={'#ff0'}
        />
      </MapView>
      <Overlay style={[styles.overlay, { opacity: overlay_fade }, { zIndex: overlay_z }]} />
      <LView style={[styles.lview, { left: info_anim }]}>
        <Info />
      </LView>
      <RView style={[styles.rview, { right: route_anim }]}>
        <Route parentToChild={data} />
      </RView>
      <INav style={[styles.nav, { left: inav_anim }]}>
        <Pressable style={styles.nav_button} onPress={info_toggle}>
          <Image
            style={styles.nav_img}
            source={require('./assets/back_left.png')}
          />
          <NavImg
            style={[styles.nav_img, { opacity: fade }]}
            source={require('./assets/info_nav.png')}
          />
        </Pressable>
      </INav>
      <CNav style={[styles.nav, { left: cnav }]}>
        <Pressable style={styles.nav_button} onPress={center}>
          <Image
            style={styles.nav_img}
            source={require('./assets/bus.png')}
          />
        </Pressable>
      </CNav>
      <RNav style={[styles.nav, { right: rnav_anim }]}>
        <Pressable style={styles.nav_button} onPress={route_toggle}>
          <Image
            style={styles.nav_img}
            source={require('./assets/back_right.png')}
          />
          <NavImg
            style={[styles.nav_img, { opacity: fade }]}
            source={require('./assets/route_nav.png')}
          />
        </Pressable>
      </RNav>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: win_width,
    height: win_height,
    zIndex: 0,
  },
  overlay: {
    position: 'absolute',
    backgroundColor: '#000',
    width: win_width,
    height: win_height,
  },
  rview: {
    position: 'absolute',
    zIndex: 2,
  },
  lview: {
    position: 'absolute',
    zIndex: 2,
  },
  nav: {
    position: 'absolute',
    bottom: '5%',
    zIndex: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  nav_button: {
    width: nav_size,
    height: nav_size,
    backgroundColor: '#eccc3b',
    color: '#fff',
    borderRadius: 0.05 * win_width,
  },
  nav_img: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    alignSelf: 'center',
    top: '25%',
    backgroundColor: '#eccc3b',
  },
});
