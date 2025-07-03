## Alpha is an app that syncronizes mobile devices with pc
### it came up as an alternative for Phone Link on Windows systems
### its built using react native and expo
### Connection is facilated via a unique connection id
### Connection status is maintained via a redis pub/sub channel
### SMS are constantly listened and produced to a kafka broker, which is picked by a consumer and distributed to a SSE server via the same connection string
### see complete architecture here : [link](https://excalidraw.com/#json=CF-48Tuv_0Jr5eOB5SVod,U0Ungecz-SpBZCOuTzb_Lg)

## Future Improvements
- the react-native-expo-read-sms library currentl does not supports background actions, so sms are synced as long as the app remains active
- UI can be improved using react-native-paper 

## Credits
### Special thanks to [maniac-tech](https://github.com/maniac-tech) for developing the sms listener library for expo-react-native