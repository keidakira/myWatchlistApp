import {BottomSheetModal} from '@gorhom/bottom-sheet';
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableNativeFeedback,
  ActivityIndicator,
} from 'react-native';
import CustomText from '../components/CustomText';
import Separator from '../components/Separator';
import MovieScreen from './MovieScreen';
import TVScreen from './TVScreen';

const SearchScreen = () => {
  const searchEndpoint = 'https://fancy-pants-calf.cyclic.app/search?query=';

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getSearchResults() {
      setSearchResults([]);
      setIsLoading(true);
      const response = await fetch(searchEndpoint + searchText);
      const json = await response.json();
      setSearchResults(json.results.filter((item: any) => item.poster_path));
      setIsLoading(false);
    }

    const delayFn = setTimeout(() => {
      console.log('Searching for ' + searchText);
      if (searchText.length > 3) {
        getSearchResults();
      } else {
        setIsLoading(true);
        setSearchResults([]);
      }
    }, 1000);

    return () => clearTimeout(delayFn);
  }, [searchText]);

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  return (
    <View style={styles.main}>
      <View style={[styles.container, {paddingBottom: 72}]}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search your favorite shows or movies"
          placeholderTextColor="rgba(255,255,255,0.5)"
          autoFocus={true}
          onChangeText={text => setSearchText(text)}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <Separator />
        {searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={({item}) => {
              return (
                item.poster_path && (
                  <TouchableNativeFeedback
                    onPress={() => {
                      setSelectedItem(item);
                      bottomSheetRef.current?.present();
                    }}>
                    <Image
                      style={styles.searchResultImage}
                      source={{
                        uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
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
          searchText !== '' &&
          isLoading && (
            <View style={{marginTop: 32}}>
              <ActivityIndicator size="large" color="red" />
            </View>
          )
        )}
        {searchText !== '' && !isLoading && searchResults.length === 0 && (
          <View>
            <CustomText style={{color: 'white'}}>No results found</CustomText>
          </View>
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
  container: {
    padding: 16,
  },
  main: {
    backgroundColor: 'black',
    flex: 1,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    borderRadius: 8,
    padding: 16,
  },
  searchResultImage: {
    aspectRatio: 2 / 3,
    height: 256,
  },
});

export default SearchScreen;
