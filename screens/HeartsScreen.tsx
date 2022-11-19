import {BottomSheetModal} from '@gorhom/bottom-sheet';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import CustomText from '../components/CustomText';
import Icon from '../components/Icon';
import Separator from '../components/Separator';
import Database from '../utils/Database';
import MovieScreen from './MovieScreen';
import TVScreen from './TVScreen';

const db = new Database();

const HeartsScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const getFavorites = async () => {
      const favorites = await db.get('favorites');
      let parsedFavs = JSON.parse(favorites) || {};
      parsedFavs = Object.values(parsedFavs);

      setFavorites(parsedFavs);
    };

    getFavorites();
  }, [selectedItem]);

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
    setTimeout(() => {
      selectedItem && setSelectedItem(null);
    }, 1000);
  };

  console.log(selectedItem);

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <CustomText style={styles.title}>Favorites</CustomText>
        <Separator />
        {favorites.length > 0 ? (
          <FlatList
            data={favorites}
            renderItem={({item}) => {
              return (
                item.poster && (
                  <TouchableNativeFeedback
                    onPress={() => {
                      setSelectedItem(item);
                      bottomSheetRef.current?.present();
                    }}>
                    <Image
                      style={styles.searchResultImage}
                      source={{
                        uri: `https://image.tmdb.org/t/p/w500/${item.poster}`,
                      }}
                      borderRadius={8}
                    />
                  </TouchableNativeFeedback>
                )
              );
            }}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            ItemSeparatorComponent={() => <Separator />}
          />
        ) : (
          <CustomText>No favorites yet</CustomText>
        )}
      </View>
      <BottomSheetModal
        index={0}
        ref={bottomSheetRef}
        snapPoints={['100%']}
        enablePanDownToClose={true}
        backgroundStyle={{backgroundColor: 'rgb(0,0,0)'}}>
        {selectedItem && selectedItem.media_type === 'movie' && (
          <MovieScreen
            closeSheet={closeBottomSheet}
            movieId={selectedItem.id}
          />
        )}
        {selectedItem && selectedItem.media_type === 'tv' && (
          <TVScreen closeSheet={closeBottomSheet} tvId={selectedItem.id} />
        )}
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'black',
  },
  title: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  searchResultImage: {
    aspectRatio: 2 / 3,
    height: 256,
  },
});

export default HeartsScreen;
