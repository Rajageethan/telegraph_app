import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Audio } from 'expo-av';
import { PanGestureHandler } from 'react-native-gesture-handler';
import colors from '../constants/colors';
import { translateMorse } from './../utilities/translator';


const HomeScreen = ({ navigation }) => {
  const [morseCode, setMorseCode] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [finalMorseCode, setFinalMorseCode] = useState('');
  const pressStartTime = useRef(0);
  const lastInputTime = useRef(null);
  const letterTimeout = useRef(null);
  const wordTimeout = useRef(null);
  const sound = useRef(null);

  const playSound = async (soundFile) => {
    if(sound.current){
      await sound.current.unloadAsync();
    }

    const { sound: newSound } =await Audio.Sound.createAsync(soundFile);
    sound.current = newSound;
    await sound.current.playAsync();
  }

  const handleMorseInput = async(type) => {
    setMorseCode((prevCode) =>  prevCode + type);

    if (type === '.'){
      await playSound(require('./../../assets/audio/dot.mp3'));
    }
    else if (type === '-'){
      await playSound(require('./../../assets/audio/dash.mp3'));
    }

    clearTimeout(letterTimeout.current);
    clearTimeout(wordTimeout.current);

    letterTimeout.current = setTimeout(()=>{
      setMorseCode((prevCode) => prevCode + ' ');
    },600); 

    wordTimeout.current = setTimeout(()=>{
      setMorseCode((prevCode) => prevCode + '/ ');
    },1400);
  };



  const handleGesture = (event) => {
    const { translationX, translationY } =event.nativeEvent;

    if (translationX > 50 || translationX > -50 ) {
      setMorseCode('');
    }
  }

  const handlePressIn = () => {
    pressStartTime.current = new Date().getTime();
  };

  const handlePressOut = async () => {
    const pressEndTime = new Date().getTime();
    const pressDuration = pressEndTime - pressStartTime.current;

    if (pressDuration >= 200) {
      await handleMorseInput('-');
    }
    else {
      await handleMorseInput('.');
    }
  };

  useEffect(() => {
    const translation = translateMorse(morseCode);
    setTranslatedText(translation);
  }, [morseCode]);


  return (

    <PanGestureHandler onGestureEvent={handleGesture}>
      <View style={styles.container}>

          <View style={styles.morse}>
            <Text style={{
              color: colors.primary,
              fontSize: 30,
              fontWeight: "bold",
              padding:10,
              paddingLeft:30
            }}>Morse</Text>

            <Text style={{
              color: colors.primary,
              fontSize: 30,
              fontWeight: "bold",
              padding:10,
              paddingLeft:30}}>{morseCode}</Text>
          </View>

          <View style={styles.english}>
            <Text style={{
              color: colors.primary,
              fontSize: 30,
              fontWeight: "bold",
              padding:10,
              paddingLeft:30
            }}>English</Text>

            <Text style={{
              color: colors.primary,
              fontSize: 30,
              fontWeight: "bold",
              padding:10,
              paddingLeft:30}}>{translatedText }</Text>
          </View>

          <Pressable 
            style={styles.morse_input}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            // onLongPress={() => handlePress('-')} 
          >
            <Text style={{
              color: colors.charcoal_grey,
            }}>Tap = Dot | Hold = Dash</Text>
          </Pressable>


      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  morse_input: {
    backgroundColor:colors.primary,
    height: "30%",
    width: "100%",
    position: 'absolute',
    bottom: 0,
    left: 0,  
    right: 0,
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    justifyContent:"center",
    alignItems:"center"
  },
  morse:{
    backgroundColor: colors.secondary,
    height:200,
    marginTop: 50,
  },
  english:{
    backgroundColor: colors.secondary,
    height:200,
    marginTop: 50,
  }

});

export default HomeScreen;

