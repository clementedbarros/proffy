import React, { useState, useEffect } from  'react';
import { View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { ITeacherDTO } from '../../components/TeacherItem';
import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';

function Favorites(){
  const [favorites, setFavorites] = useState([]);

  function loadFavorites(){
    AsyncStorage.getItem('favorites').then(response => {
      if(response) {
        const teacherFavorites = JSON.parse(response);
        setFavorites(teacherFavorites);
      }
    });
  }
  useFocusEffect(()=>{
    loadFavorites();
  });
  return (
    <View style={ styles.container }>
      <PageHeader title="Meus proffys favoritos"/>
      <ScrollView 
          style={styles.teacherList}
          contentContainerStyle={{paddingHorizontal: 16,
          paddingBottom:16,
        }}
      >
        {favorites.map((teacher: ITeacherDTO)=>{
          return(
            <TeacherItem 
              key={teacher.id} 
              teacher={teacher} 
              favorited
            />
          )
        })}
      </ScrollView>
    </View>
  )
}
export default Favorites;