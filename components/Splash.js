import React, { useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
  TextInput,
  Linking,
  Animated,
} from 'react-native';


const win_width = Dimensions.get('window').width;
const win_height = Dimensions.get('window').height;

const Student = Animated.createAnimatedComponent(Animated.View);
const Driver = Animated.createAnimatedComponent(Animated.View);
const Login = Animated.createAnimatedComponent(Animated.View);

const anim_dur = 100;

var login_open = true;
var student_open = false;
var driver_open = false;

const districts = ['MCVSD'];
const routes = ['310694','077600']

export var info = {
  district: 'MCVSD',
  route_id: '310694',
  password: '',
  driver: false,
  open: true,
}

var driver = {
  district: '',
  route_id: '',
  password: '',
}

var student = {
  district: '',
  route_id: '',
}

const saveDist = userInput => {
  driver.district = userInput;
  student.district = userInput;
};
const saveID = userInput => {
  driver.route_id = userInput;
  student.route_id = userInput;
};
const savePass = userInput => {
  driver.password = userInput;
};

export function Splash() {

  const Container = Animated.createAnimatedComponent(Animated.View);

  const login_anim = useRef(new Animated.Value(0)).current;

  const login_fade = useRef(new Animated.Value(1)).current;
  const student_fade = useRef(new Animated.Value(0)).current;
  const student_z = useRef(new Animated.Value(-1)).current;
  const driver_fade = useRef(new Animated.Value(0)).current;
  const driver_z = useRef(new Animated.Value(-1)).current;

  const login_toggle = () => {
    if (!login_open) {
      Animated.timing(login_fade, {
        toValue: 1,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(login_fade, {
        toValue: 0,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
    }
    login_open = !login_open;
  }
  const student_toggle = () => {
    if (!student_open) {
      Animated.timing(student_fade, {
        toValue: 1,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(student_z, {
        toValue: 5,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      login_toggle();
    } else {
      Animated.timing(student_fade, {
        toValue: 0,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(student_z, {
        toValue: -1,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      login_toggle();
    }
    student_open = !student_open;
  }
  const driver_toggle = () => {
    if (!driver_open) {
      Animated.timing(driver_fade, {
        toValue: 1,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(driver_z, {
        toValue: 5,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      login_toggle();
    } else {
      Animated.timing(driver_fade, {
        toValue: 0,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      Animated.timing(driver_z, {
        toValue: -1,
        duration: anim_dur,
        useNativeDriver: false,
      }).start();
      login_toggle();
    }
    driver_open = !driver_open;
  }
  function submit_driv() {
    if(districts.includes(driver.district) && routes.includes(driver.password)) {
      info.driver = true;
      info.open = false;
      info.district = driver.district;
      info.route_id = driver.password;
      info.password = driver.password;
      Animated.timing(login_anim, {
        toValue: -win_height,
        duration: anim_dur*1.25,
        useNativeDriver: false,
      }).start();
    }
  }
  function submit_stud() {
    if (districts.includes(student.district) && routes.includes(student.route_id)) {
      info.driver = false;
      info.open = false;
      info.district = student.district;
      info.route_id = student.route_id;
      Animated.timing(login_anim, {
        toValue: -win_height,
        duration: anim_dur*1.25,
        useNativeDriver: false,
      }).start();
    }
  }

  return (
    <Container style={[styles.login, { top: login_anim }]}>
      <View style={{ flex: 3 }}>
        <Image style={styles.logo} source={require('../assets/logo.png')} />
      </View>
      <View style={styles.login_container}>
      <Login style={[styles.login_pane, { opacity: login_fade, zIndex: 1 }]}>
        <Text style={{ fontSize: 20 }}>I am a...</Text>
        <Pressable style={styles.id_label} onPress={student_toggle}>
          <Text style={styles.id_text}>Student</Text>
        </Pressable>
        <Pressable style={styles.id_label} onPress={driver_toggle}>
          <Text style={styles.id_text}>Driver</Text>
        </Pressable>
      </Login>
      <Student style={[styles.login_pane, { zIndex: student_z, opacity: student_fade }]}>
        <Text style={{ fontSize: 20 }}>District Code</Text>
        <TextInput autoCapitalize='characters' returnKeyType='done' onChangeText={userInput => saveDist(userInput)} style={[styles.id_label, { padding: '5%' }]} />
        <Text style={{ fontSize: 20 }}>Route ID</Text>
        <TextInput maxLength={6} returnKeyType='done' keyboardType='number-pad' onChangeText={userInput => saveID(userInput)} style={[styles.id_label, { padding: '5%' }]} />
        <View style={styles.login_buttons}>
          <Pressable style={styles.login_button} onPress={student_toggle}>
            <Text style={styles.menu_text}>Back</Text>
          </Pressable>
          <Pressable style={styles.login_button} onPress={submit_stud}>
            <Text style={styles.menu_text}>Login</Text>
          </Pressable>
        </View>
      </Student>
      <Driver style={[styles.login_pane, { zIndex: driver_z, opacity: driver_fade }]}>
        <Text style={{ fontSize: 20 }}>District Code</Text>
        <TextInput autoCapitalize='characters' returnKeyType='done' onChangeText={userInput => saveDist(userInput)} style={[styles.id_label, { padding: '5%' }]} />
        <Text style={{ fontSize: 20 }}>Password</Text>
        <TextInput maxLength={6} returnKeyType='done' onChangeText={userInput => savePass(userInput)} style={[styles.id_label, { padding: '5%' }]} />
        <View style={styles.login_buttons}>
          <Pressable style={styles.login_button} onPress={driver_toggle}>
            <Text style={styles.menu_text}>Back</Text>
          </Pressable>
          <Pressable style={styles.login_button} onPress={submit_driv}>
            <Text style={styles.menu_text}>Login</Text>
          </Pressable>
        </View>
      </Driver>
    </View>
      <View style={styles.info_footer}>
        <View style={styles.footer_content}>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => Linking.openURL('www.google.com')}>
            <Text>Support</Text>
          </Pressable>
          <Text>Version 0.1</Text>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  login: {
    position: 'absolute',
    left: 0,
    backgroundColor: '#eccc3b',
    flexDirection: 'column',
    width: win_width,
    height: win_height,
    zIndex: 5,
  },
  logo: {
    marginTop: '20%',
    alignSelf: 'center',
    height: (win_width - 60) * 0.45,
    width: (win_width - 60) * 0.6,
    borderRadius: 0.075 * win_width,
  },
  login_container: {
    flex: 6,
    margin: '10%',
  },
  login_pane: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
  id_label: {
    backgroundColor: '#fff',
    margin: '3.5%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.25,
    flex: 1,
    borderRadius: 0.05 * win_width,
    fontSize: 36,
    textAlign: 'center'
  },
  id_text: {
    fontSize: 36,
    textAlign: 'center',
    margin: '5%'
  },
  menu_text: {
    fontSize: 24,
    textAlign: 'center',
    margin: '5%',
  },
  login_button: {
    backgroundColor: '#fff',
    margin: '5%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.25,
    flex: 1,
    borderRadius: 0.025 * win_width,
  },
  login_buttons: {
    flexDirection: 'row',
  },
  info_footer: {
    paddingLeft: '10%',
    paddingRight: '10%',
    justifyContent: 'flex-end',
    flex: 1,
  },
  footer_content: {
    flexDirection: 'row',
    padding: '7%',
    marginBottom: '5%',
  },
});
