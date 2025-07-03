import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
// @ts-ignore
import { checkIfHasSMSPermission, requestReadSMSPermission, startReadSMS } from '@maniac-tech/react-native-expo-read-sms';
import * as SecureStore from 'expo-secure-store';

export default   function App() {
   const [hasPermission, setHasPermission] = useState(false);
   const [connect, setConnect] = useState(false)

  useEffect(() => {
    const setupSMSReader = async () => {
      const { hasReadSmsPermission, hasReceiveSmsPermission } = await checkIfHasSMSPermission();

      console.log("Permission check:", hasReadSmsPermission, hasReceiveSmsPermission);

      if (hasReadSmsPermission && hasReceiveSmsPermission) {
        startReadSMS(callbackFn1, callbackFn2);
        setHasPermission(true);
      } else {
        const granted = await requestReadSMSPermission();
        console.log("Permission requested, result:", granted);
      }
    };

    setupSMSReader();
  }, []);

  useEffect(() => {
    const getStatus = async () => {
      const id =  await SecureStore.getItemAsync('id')
      if(id) setConnect(true)
    }

    getStatus()
  })
  

  const callbackFn1 = async (status: string, sms: any, error: any) => {
    if (status === "Start Read SMS successfully") {
      console.log("Started reading SMS...");
    } else if (status === "success") {
      const smsa = sms.slice(1, -1).split(',');
      const contact = smsa[0]
      const content = smsa[1]
      console.log(contact, content);
      const smsobj = {
        contact: contact,
        content: content
      }
      
      const id = await SecureStore.getItemAsync('id')

       const resp = await fetch('http://192.168.1.6:3001/kafka', {
          method:"POST",
          headers: {
          "Content-Type": "application/json",
        },
          body:JSON.stringify({id: id, type: 'sms', msg: smsobj})
        }) 

    } else {
      console.log("Error reading SMS:", error);
    }
  };

  const callbackFn2 = (status: any, sms: any, error: any) => {
    console.log("Callback2 Error:", error);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.whiteText}>{connect === true ? 'Device is connected' : 'Connect by scanning the QR'}</Text>
      {/* <Button title='Click' onPress={} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteText: {
    textDecorationColor: 'white',
    fontSize: 15,
  }
});
