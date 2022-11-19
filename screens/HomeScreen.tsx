import {BottomSheetModal} from '@gorhom/bottom-sheet';
import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableNativeFeedback,
  Image,
  StyleSheet,
} from 'react-native';
import Separator from '../components/Separator';
import MovieScreen from './MovieScreen';
import TVScreen from './TVScreen';

const Header = () => {
  return (
    <View style={styles.header}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.headerImage}
      />
    </View>
  );
};

const HomeScreen = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [selectedItem, setSelectedItem] = useState(null);

  const [trendingSeries, setTrendingSeries] = useState({});
  const [trendingMovies, setTrendingMovies] = useState({});

  const trendingSeriesURL =
    'https://api.themoviedb.org/3/trending/tv/week?api_key=4f2917841238275498913fb9c85b266f&language=en-US&page=1';
  const trendingMoviesURL =
    'https://api.themoviedb.org/3/trending/movie/week?api_key=4f2917841238275498913fb9c85b266f&language=en-US&page=1';

  useEffect(() => {
    async function getTrendingSeries() {
      const response = await fetch(trendingSeriesURL);
      const json = await response.json();
      setTrendingSeries(json);
    }

    async function getTrendingMovies() {
      const response = await fetch(trendingMoviesURL);
      const json = await response.json();
      setTrendingMovies(json);
    }

    getTrendingSeries();
    getTrendingMovies();
  }, []);

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  return (
    <View style={styles.main}>
      <View style={[styles.container, {height: 80}]}>
        <Header />
      </View>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.subtitle}>Trending TV Shows</Text>
        <ScrollView horizontal={true} style={styles.horizontalScrollView}>
          {trendingSeries &&
            trendingSeries.results &&
            trendingSeries.results.map((item: any) => {
              return (
                <TouchableNativeFeedback
                  key={item.id}
                  onPress={() => {
                    setSelectedItem(item);
                    bottomSheetRef.current?.present();
                  }}>
                  <View key={item.id} style={styles.poster}>
                    <Image
                      style={styles.posterImage}
                      source={{
                        uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                      }}
                    />
                  </View>
                </TouchableNativeFeedback>
              );
            })}
        </ScrollView>
        <Separator />
        <Text style={styles.subtitle}>Trending Movies</Text>
        <ScrollView horizontal={true} style={styles.horizontalScrollView}>
          {trendingMovies &&
            trendingMovies.results &&
            trendingMovies.results.map((item: any) => {
              return (
                <TouchableNativeFeedback
                  key={item.id}
                  onPress={() => {
                    setSelectedItem(item);
                    bottomSheetRef.current?.present();
                  }}>
                  <View key={item.id} style={styles.poster}>
                    <Image
                      style={styles.posterImage}
                      source={{
                        uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                      }}
                    />
                  </View>
                </TouchableNativeFeedback>
              );
            })}
        </ScrollView>
      </ScrollView>
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
  text: {
    color: 'white',
    fontSize: 16,
  },
  separator: {
    height: 20,
  },
  scrollView: {
    flex: 1,
  },
  horizontalScrollView: {
    backgroundColor: 'black',
    marginVertical: 8,
  },
  main: {
    backgroundColor: 'black',
    flex: 1,
  },
  header: {
    backgroundColor: 'black',
    height: 80,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: 200,
    resizeMode: 'contain',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  posterImage: {
    aspectRatio: 2 / 3,
    height: 256,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  poster: {
    marginRight: 12,
  },
});

export default HomeScreen;
