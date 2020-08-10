import React from 'react';
import landingImg from '../../assets/images/landing.png'
import { View, Image, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import studyIcon from '../../assets/images/icons/study.png';
import giveClassesIcon from '../../assets/images/icons/give-classes.png';
import heartIcon from '../../assets/images/icons/heart.png';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';

function Landing() {
  const { navigate } = useNavigation();
  function handleNavToGiveClasses(){
    navigate('GiveClasses');
  }
  function handleNavToStudy(){
    navigate('Study');
  }
  return (<View style={styles.container}>
    <Image source={landingImg} style={styles.banner}/>
    <Text style={styles.title}>
      Seja bem-vindo, {'\n'}
      <Text style={styles.titleBold}>O que deseja fazer?</Text>
    </Text>
    <View style={styles.buttonsContainer}> 
      <RectButton onPress={handleNavToStudy} style={[styles.button, styles.buttonPrimary]}>
        <Image source={studyIcon}/>
        <Text style={styles.buttonText}>Estudar</Text>
      </RectButton>
      <RectButton 
        onPress={handleNavToGiveClasses}
        style={[styles.button, styles.buttonSecondary]}
      >
        <Image source={giveClassesIcon}/>
        <Text style={styles.buttonText}>Dar aulas</Text>
      </RectButton>
    </View>
    <Text style= { styles.totalConnections}>
      Total de 258 conexões já realizadas {'  '}
      <Image source={heartIcon}/>
    </Text>
  </View>)
}

export default Landing;