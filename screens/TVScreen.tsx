import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  FlatList,
  ScrollView,
  TouchableHighlight,
} from 'react-native-gesture-handler';
import Icon from '../components/Icon';
import Separator from '../components/Separator';
import CustomButton from '../components/CustomButton';

import CustomText from '../components/CustomText';
import regions from '../regions.json';
import Database from '../utils/Database';
import {TouchableOpacity} from '@gorhom/bottom-sheet';
import FAB from '../components/FAB';
import Config from 'react-native-config';

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
    media_type: 'tv',
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

const TVScreen = ({tvId, closeSheet}) => {
  const {data, error, loading, isHearted, episodes, countries} = useTV(tvId);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <TV
      tv={data}
      close={closeSheet}
      isHearted={isHearted}
      episodes={episodes}
      countries={countries}
    />
  );
};

// Path: TV.tsx
const TV = ({tv, close, isHearted, episodes: eps, countries}) => {
  const tvClip = tv.videos.results.filter(
    v => v.type === 'Trailer' || v.type === 'Teaser',
  )[0]?.key;
  const openTrailer = () => {
    // Open trailer
    Linking.openURL('https://www.youtube.com/watch?v=' + tvClip).catch(err =>
      console.error("Couldn't load page", err),
    );
  };

  // States
  const [viewOverview, setViewOverview] = useState(false);
  const [isFavorite, setIsFavorite] = useState(isHearted);
  const [currentMenu, setCurrentMenu] = useState(0);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [showSeasonPicker, setShowSeasonPicker] = useState(false);
  const [currCountry, setCurrCountry] = useState({});
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [episodes, setEpisodes] = useState(eps);
  const [sort, setSort] = useState(0);

  // Get episodes if seasons change
  useEffect(() => {
    const getEpisodes = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${tv.id}/season/${currentSeason}?api_key=${Config.API_KEY}`,
      );
      const data = await response.json();
      setEpisodes(data.episodes);
    };

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

    getEpisodes();
    getStreamingForCountry();
  }, [currentSeason, tv.id]);

  return (
    <View style={styles.container}>
      <ImageBackground
        style={{width: '100%', height: 256}}
        source={{
          uri: `https://image.tmdb.org/t/p/w500${tv.backdrop_path}`,
        }}>
        <View style={styles.imageBackdrop} />
        <Text style={styles.tvTitle} numberOfLines={2}>
          {tv.name}
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
                removeFromHearts(tv.id);
                setIsFavorite(false);
              } else {
                addToHearts(tv.id, tv.poster_path);
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
            {tv.overview}
          </CustomText>
        </TouchableHighlight>
        <Separator />
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => {
              setCurrentMenu(0);
            }}
            style={currentMenu === 0 ? styles.activeMenuItem : styles.menuItem}>
            <Icon
              name="play"
              size={24}
              color="white"
              style={{marginBottom: 8}}
            />
            <CustomText>Episodes</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setCurrentMenu(2);
            }}
            style={currentMenu === 2 ? styles.activeMenuItem : styles.menuItem}>
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

        {/** Episodes */}
        {episodes && currentMenu === 0 && (
          <View style={{marginVertical: 24}}>
            <TouchableOpacity
              onPress={() => {
                setShowSeasonPicker(true);
              }}>
              <View style={styles.seasonButton}>
                <CustomText style={{color: 'white'}}>
                  {'Season ' + currentSeason}
                </CustomText>
                <Icon
                  name="chevron-down"
                  size={12}
                  color="white"
                  style={{marginLeft: 8}}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
        {episodes &&
          currentMenu === 0 &&
          episodes.map(ep => {
            if (ep.still_path === null) {
              return null;
            }

            return (
              <View key={ep.id}>
                <View style={styles.row}>
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w500${ep.still_path}`,
                    }}
                    style={styles.episodeImage}
                  />
                  <View style={styles.episode}>
                    <CustomText style={styles.episodeTitle} numberOfLines={1}>
                      {ep.episode_number + '. ' + ep.name}
                    </CustomText>
                    <CustomText
                      numberOfLines={3}
                      style={styles.episodeOverview}>
                      {ep.overview.replace(/(\r \n|\n|\r)/gm, ' ')}
                    </CustomText>
                  </View>
                </View>
                <Separator />
              </View>
            );
          })}

        {/** Stream options */}
        {currentMenu === 2 && (
          <View style={{marginVertical: 24}}>
            <TouchableOpacity
              onPress={() => {
                setShowCountryPicker(true);
              }}>
              <View style={styles.seasonButton}>
                <CustomText style={{color: 'white'}}>
                  {currCountry.name}
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
              {currCountry.flatrate && (
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
              {currCountry.buy && (
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
                  </ScrollView>
                  <Separator />
                </View>
              )}
            </View>
          </View>
        )}

        <Separator />
      </ScrollView>
      {/** Season Picker */}
      {showSeasonPicker && (
        <SeasonPicker
          curr={currentSeason}
          seasons={tv.number_of_seasons}
          setSeason={setCurrentSeason}
          setPicker={setShowSeasonPicker}
        />
      )}

      {/** Country Picker */}
      {currentMenu === 2 && showCountryPicker && (
        <CountryPicker
          streamingCountries={countries}
          currCountry={currCountry}
          setCountry={setCurrCountry}
          setPicker={setShowCountryPicker}
        />
      )}

      {currentMenu === 0 && (
        <FAB
          icon={
            sort === 0 ? 'sort-numeric-ascending' : 'sort-numeric-descending'
          }
          onPress={() => {
            if (sort === 1) {
              setSort(0);
              setEpisodes(
                episodes.sort((a, b) => {
                  return a.episode_number - b.episode_number;
                }),
              );
            } else {
              setSort(1);
              setEpisodes(
                episodes.sort((a, b) => {
                  return b.episode_number - a.episode_number;
                }),
              );
            }
          }}
        />
      )}
    </View>
  );
};

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

  const [activeCountry, setActiveCountry] = useState(currCountry);

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

const SeasonPicker = ({seasons, curr, setSeason, setPicker}) => {
  const [currentSeason, setCurrentSeason] = useState(curr);

  return (
    <>
      <View style={styles.seasonPicker}>
        <FlatList
          data={Array.from(Array(seasons).keys())}
          keyExtractor={item => item.toString()}
          style={{marginBottom: 80, marginTop: 40}}
          contentContainerStyle={{
            flex: seasons <= 10 ? 1 : 0,
            justifyContent: 'center',
          }}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setCurrentSeason(item + 1);
                }}
                key={item}
                style={styles.season}>
                <CustomText
                  style={
                    currentSeason === item + 1
                      ? styles.seasonPickerTextActive
                      : styles.seasonPickerText
                  }>
                  {'Season ' + (item + 1)}
                </CustomText>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <TouchableOpacity
        style={styles.closePickerIcon}
        onPress={() => {
          setSeason(currentSeason);
          setPicker(false);
        }}>
        <Icon name="close" size={24} color="black" />
      </TouchableOpacity>
    </>
  );
};

const useTV = tvId => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHearted, setIsHearted] = useState(false);
  const [episodes, setEpisodes] = useState(null);
  const [countries, setCountries] = useState({});

  useEffect(() => {
    setLoading(true);
    fetch(`https://fancy-pants-calf.cyclic.app/tv/${tvId}`)
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
      `https://api.themoviedb.org/3/tv/${tvId}/season/1?api_key=${Config.API_KEY}`,
    )
      .then(response => response.json())
      .then(data => {
        setEpisodes(data.episodes);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });

    fetch(
      `https://api.themoviedb.org/3/tv/${tvId}/watch/providers?api_key=${Config.API_KEY}`,
    )
      .then(response => response.json())
      .then(data => {
        setCountries(data.results);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });

    isFavorite(tvId)
      .then(favorite => setIsHearted(favorite))
      .catch(err => {
        console.log(err);
      });
  }, [tvId]);

  return {data, error, loading, isHearted, episodes, countries};
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
  return <CustomText>Error...</CustomText>;
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
  tvTitle: {
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
  episodeImage: {
    width: 120,
    aspectRatio: 16 / 9,
    borderRadius: 8,
  },
  episode: {
    flex: 1,
    marginLeft: 12,
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  episodeOverview: {
    fontSize: 10,
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

export default TVScreen;
