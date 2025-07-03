import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as Device from 'expo-device';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const router = useRouter()
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const handleScan = async (qr : any) => {
    console.log('check;', qr.data);
    
    if(qr.data != ''){
      const resp = await fetch('http://192.168.1.6:3001/publish', {
        method:"POST",
        headers: {
        "Content-Type": "application/json",
      },
        body:JSON.stringify({id: qr.data, type: 'command', msg: 'Hold'})
      }) 

      const res = await resp.text()
      if(res === 'ok') {
        await SecureStore.setItemAsync('id', qr.data)

        const devicedata = {
          name: Device.deviceName,
          model: Device.modelName,
          manufacturer: Device.manufacturer,
          brand:Device.brand,
          os: Device.osName,
          type: Device.deviceType
        }
        console.log(devicedata);
        
        await SecureStore.setItemAsync('device', JSON.stringify(devicedata))

        const resp = await fetch('http://192.168.1.6:3001/publish', {
          method:"POST",
          headers: {
          "Content-Type": "application/json",
        },
          body:JSON.stringify({id: qr.data, type: 'device', msg: devicedata})
        }) 

        router.navigate('/(tabs)')
      }
      
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} onBarcodeScanned={(qr) => handleScan(qr)}  barcodeScannerSettings={{ barcodeTypes: ["qr"], }}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text className='text-2xl text-white'>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});