import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Separator from '../components/Separator';
import CustomButton from '../components/CustomButton';
import Icon from '../components/Icon';
import regions from '../regions.json';

import CustomText from '../components/CustomText';
import Database from '../utils/Database';
import {TouchableOpacity} from '@gorhom/bottom-sheet';
import Config from 'react-native-config';
import {ScrollView} from 'react-native-gesture-handler';

const isFavorite = async id => {
  const db = new Database();
  let favorites = await db.get('favorites');
  favorites = JSON.parse(favorites) || {};

  return favorites[id] || false;
};

const addToHearts = async (id, poster) => {
  // Add to hearts
  const database = new Database();
  let favorites = await database.get('favorites');

  favorites = JSON.parse(favorites) || {};

  favorites[id] = {
    id: id,
    poster: poster,
    media_type: 'movie',
  };

  const response = await database.set('favorites', JSON.stringify(favorites));
};

const removeFromHearts = async id => {
  // Remove from hearts
  const database = new Database();
  let favorites = await database.get('favorites');
  favorites = JSON.parse(favorites);
  delete favorites[id];
  database.set('favorites', JSON.stringify(favorites));
};

const MovieScreen = ({movieId, closeSheet}) => {
  const {data, error, loading, isHearted, countries} = useMovie(movieId);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <Movie
      movie={data}
      close={closeSheet}
      isHearted={isHearted}
      countries={countries}
    />
  );
};

// Path: Movie.tsx
const Movie = ({movie, close, isHearted, countries}) => {
  const movieClip = movie.videos.results.filter(
    v => v.type === 'Trailer' || v.type === 'Teaser',
  )[0]?.key;
  const openTrailer = () => {
    // Open trailer
    Linking.openURL('https://www.youtube.com/watch?v=' + movieClip).catch(err =>
      console.error("Couldn't load page", err),
    );
  };

  // States
  const [viewOverview, setViewOverview] = useState(false);
  const [isFavorite, setIsFavorite] = useState(isHearted);
  const [currentMenu, setCurrentMenu] = useState(0);
  const [currCountry, setCurrCountry] = useState({});
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  // Get countries when country is changed
  useEffect(() => {
    const getStreamingForCountry = async () => {
      let streamingCountries = [];
      for (let country in countries) {
        streamingCountries.push({
          id: country,
          ...countries[country],
          name: regions.filter(r => r.alpha2 === country)[0].name.split(',')[0],
        });
      }

      streamingCountries.push({
        id: 'all',
        name: '',
      });

      setCurrCountry(streamingCountries.filter(c => c.id === 'US')[0]);
    };

    getStreamingForCountry();
  }, [countries]);

  return (
    <View style={styles.container}>
      <ImageBackground
        style={{width: '100%', height: 256}}
        source={{
          uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
        }}>
        <View style={styles.imageBackdrop} />
        <Text style={styles.movieTitle} numberOfLines={2}>
          {movie.title}
        </Text>
        <Icon
          name="close"
          size={24}
          color="white"
          style={styles.closeIcon}
          onPress={close}
        />
      </ImageBackground>
      <ScrollView style={styles.subContainer}>
        <View style={styles.row}>
          <CustomButton
            title="Watch Trailer"
            icon="play"
            onPress={openTrailer}
            style={{flex: 7.5 / 8}}
          />
          <TouchableOpacity
            onPress={() => {
              if (isFavorite) {
                removeFromHearts(movie.id);
                setIsFavorite(false);
              } else {
                addToHearts(movie.id, movie.poster_path);
                setIsFavorite(true);
              }
            }}>
            <View style={styles.favoriteIcon}>
              <Icon
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={32}
                color="white"
              />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableHighlight
          onPress={() => {
            setViewOverview(!viewOverview);
          }}>
          <CustomText
            numberOfLines={viewOverview ? undefined : 4}
            style={{textAlign: 'justify'}}>
            {movie.overview}
          </CustomText>
        </TouchableHighlight>
        <Separator />
        <View style={[styles.row, {justifyContent: 'flex-start'}]}>
          <TouchableOpacity
            onPress={() => {
              setCurrentMenu(0);
            }}
            style={currentMenu === 0 ? styles.activeMenuItem : styles.menuItem}>
            <Icon
              name="earth"
              size={24}
              color="white"
              style={{marginBottom: 8}}
            />
            <CustomText>Stream</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setCurrentMenu(1);
            }}
            style={currentMenu === 1 ? styles.activeMenuItem : styles.menuItem}>
            <Icon
              name="people"
              size={24}
              color="white"
              style={{marginBottom: 8}}
            />
            <CustomText>Cast</CustomText>
          </TouchableOpacity>
        </View>
        {/** Stream options */}
        {currentMenu === 0 && (
          <View style={{marginVertical: 24}}>
            <TouchableOpacity
              onPress={() => {
                setShowCountryPicker(true);
              }}>
              <View style={styles.seasonButton}>
                <CustomText style={{color: 'white'}}>
                  {currCountry?.name || 'Select a country'}
                </CustomText>
                <Icon
                  name="chevron-down"
                  size={12}
                  color="white"
                  style={{marginLeft: 8}}
                />
              </View>
            </TouchableOpacity>
            <View>
              {currCountry && currCountry.flatrate && (
                <View>
                  <CustomText style={styles.streamTitle}>
                    Subscription
                  </CustomText>
                  <ScrollView horizontal={true}>
                    {currCountry.flatrate &&
                      currCountry.flatrate.map(stream => {
                        return (
                          <Image
                            key={stream.provider_id}
                            source={{
                              uri: `https://image.tmdb.org/t/p/w200/${stream.logo_path}`,
                            }}
                            style={styles.streamImage}
                          />
                        );
                      })}
                  </ScrollView>
                  <Separator />
                </View>
              )}
              {currCountry && (currCountry.buy || currCountry.rent) && (
                <View>
                  <CustomText style={styles.streamTitle}>
                    Buy or Rent
                  </CustomText>
                  <ScrollView horizontal={true}>
                    {currCountry.buy &&
                      currCountry.buy.map(stream => {
                        return (
                          <Image
                            key={stream.provider_id}
                            source={{
                              uri: `https://image.tmdb.org/t/p/w200/${stream.logo_path}`,
                            }}
                            style={styles.streamImage}
                          />
                        );
                      })}
                    {currCountry.buy === undefined &&
                      currCountry.rent &&
                      currCountry.rent.map(stream => {
                        return (
                          <Image
                            key={stream.provider_id}
                            source={{
                              uri: `https://image.tmdb.org/t/p/w200/${stream.logo_path}`,
                            }}
                            style={styles.streamImage}
                          />
                        );
                      })}
                  </ScrollView>
                  <Separator />
                </View>
              )}
            </View>
          </View>
        )}

        <Separator />
      </ScrollView>
      {/** Country Picker */}
      {currentMenu === 0 && showCountryPicker && (
        <CountryPicker
          streamingCountries={countries}
          currCountry={currCountry}
          setCountry={setCurrCountry}
          setPicker={setShowCountryPicker}
        />
      )}
    </View>
  );
};

const useMovie = movieId => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHearted, setIsHearted] = useState(false);
  const [countries, setCountries] = useState({});

  useEffect(() => {
    setLoading(true);
    fetch(`https://fancy-pants-calf.cyclic.app/movie/${movieId}`)
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });

    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${Config.API_KEY}`,
    )
      .then(response => response.json())
      .then(data => {
        setCountries(data.results);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });

    isFavorite(movieId)
      .then(favorite => setIsHearted(favorite))
      .catch(err => {
        console.log(err);
      });
  }, [movieId]);

  return {data, error, loading, isHearted, countries};
};

// Path: Loading.tsx
const Loading = () => {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="red" />
    </View>
  );
};

// Path: Error.tsx
const Error = () => {
  return <Text style={{color: 'black'}}>Error...</Text>;
};

// CountryPicker.tsx
const CountryPicker = ({
  streamingCountries,
  currCountry,
  setCountry,
  setPicker,
}) => {
  let countries = [];
  for (let country in streamingCountries) {
    countries.push({
      id: country,
      ...streamingCountries[country],
      name: regions.filter(r => r.alpha2 === country)[0].name.split(',')[0],
    });
  }

  countries.push({
    id: 'all',
    name: '',
  });

  const [activeCountry, setActiveCountry] = useState(currCountry || 'all');

  return (
    <>
      <View style={styles.seasonPicker}>
        <FlatList
          data={countries}
          keyExtractor={item => item.id}
          style={{marginBottom: 80, paddingTop: 40}}
          contentContainerStyle={{
            justifyContent: 'center',
          }}
          renderItem={({item, index}) => {
            return (
              <Pressable
                key={index}
                style={styles.season}
                onPress={() => {
                  setActiveCountry(item);
                }}>
                <CustomText
                  style={
                    item.id === activeCountry.id
                      ? styles.seasonPickerTextActive
                      : styles.seasonPickerText
                  }>
                  {item.name}
                </CustomText>
              </Pressable>
            );
          }}
        />
      </View>
      <TouchableOpacity
        style={styles.closePickerIcon}
        onPress={() => {
          setPicker(false);
          setCountry(activeCountry);
        }}>
        <Icon name="close" size={24} color="black" />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  imageBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  movieTitle: {
    fontSize: 24,
    color: 'white',
    padding: 16,
    position: 'absolute',
    bottom: 0,
    fontWeight: 'bold',
  },
  closeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    marginTop: 16,
  },
  subContainer: {
    padding: 16,
  },
  dropdownContainer: {
    backgroundColor: 'black',
    borderColor: 'white',
  },
  dropdown: {
    backgroundColor: 'black',
    borderColor: 'white',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  favoriteIcon: {
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    marginVertical: 6,
    padding: 16,
  },
  activeMenuItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    marginVertical: 6,
    flex: 1 / 3,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    borderRadius: 8,
    marginVertical: 6,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1 / 3,
  },
  seasonButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 16,
  },
  seasonPicker: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 16,
    zIndex: 9999,
  },
  season: {
    padding: 16,
  },
  seasonPickerText: {
    fontSize: 24,
    color: 'gray',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  seasonPickerTextActive: {
    fontSize: 28,
    color: 'white',
    fontWeight: '800',
    textAlign: 'center',
  },
  closePickerIcon: {
    position: 'absolute',
    bottom: 32,
    left: '50%',
    transform: [{translateX: -30}],
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    padding: 16,
    borderRadius: 32,
    zIndex: 9999,
  },
  streamImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  streamTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingVertical: 8,
  },
});

export default MovieScreen;
