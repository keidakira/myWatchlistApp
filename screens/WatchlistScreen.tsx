import {BottomSheetModal} from '@gorhom/bottom-sheet';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableNativeFeedback,
} from 'react-native';
import CustomText from '../components/CustomText';
import Separator from '../components/Separator';
import Config from '../config';
import Database from '../utils/Database';
import MovieScreen from './MovieScreen';
import TVScreen from './TVScreen';

const db = new Database();

const WatchlistScreen = () => {
  const [list, setList] = useState([]);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const getList = async () => {
      const watchlist = await db.get('watchlist');
      let parsedList = JSON.parse(watchlist) || {};
      parsedList = Object.values(parsedList);

      setList(parsedList);
    };

    getList();
  }, [selectedItem]);

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
    setTimeout(() => {
      selectedItem && setSelectedItem(null);
    }, 1000);
  };

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <CustomText style={styles.title}>Your Watchlist</CustomText>
        <Separator />
        {list.length > 0 ? (
          <FlatList
            data={list}
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
                        uri: `${Config.TMDB_IMAGE_URL}/${Config.TMDB_IMAGE_SIZE}/${item.poster}`,
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

export default WatchlistScreen;
