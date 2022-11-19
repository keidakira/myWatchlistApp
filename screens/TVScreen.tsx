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
import DropDownPicker from 'react-native-dropdown-picker';
import {TouchableHighlight} from 'react-native-gesture-handler';
import Icon from '../components/Icon';
import Separator from '../components/Separator';
import CustomButton from '../components/CustomButton';

import CustomText from '../components/CustomText';
import regions from '../regions.json';
import Database from '../utils/Database';
import {TouchableOpacity} from '@gorhom/bottom-sheet';

const isFavorite = async id => {
  const db = new Database();
  let favorites = await db.get('favorites');
  favorites = JSON.parse(favorites) || {};
  console.log(favorites);

  return favorites[id] || false;
};

const addToHearts = async (id, poster) => {
  // Add to hearts
  const database = new Database();
  let favorites = await database.get('favorites');

  favorites = JSON.parse(favorites) || {};
  console.log(id, poster);

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
  const {data, error, loading, isHearted} = useTV(tvId);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  return <TV tv={data} close={closeSheet} isHearted={isHearted} />;
};

// Path: TV.tsx
const TV = ({tv, close, isHearted}) => {
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
  const [watchProviders, setWatchProviders] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('watch');
  const [items, setItems] = useState([
    {label: 'Where to Watch', value: 'watch'},
  ]);
  const [isFavorite, setIsFavorite] = useState(isHearted);

  useEffect(() => {
    const getWatchProviders = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${tv.id}/watch/providers?api_key=4f2917841238275498913fb9c85b266f`,
      );
      const data = await response.json();
      setWatchProviders(data.results);
    };

    getWatchProviders();
  }, [tv.id]);

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
      <View style={styles.subContainer}>
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
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          theme="DARK"
          dropDownDirection="AUTO"
          dropDownContainerStyle={styles.dropdownContainer}
          style={styles.dropdown}
          zIndex={1000}
          disabled={true}
        />
        <Separator />
        {value === 'watch' && (
          <WatchProviders watchProviders={watchProviders} />
        )}
      </View>
    </View>
  );
};

const useTV = tvId => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHearted, setIsHearted] = useState(false);

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

    isFavorite(tvId)
      .then(favorite => setIsHearted(favorite))
      .catch(err => {
        console.log(err);
      });
  }, [tvId]);

  return {data, error, loading, isHearted};
};

// Path: Loading.tsx
const Loading = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="red" />
    </View>
  );
};

// Path: Error.tsx
const Error = () => {
  return <CustomText>Error...</CustomText>;
};

// Path: WatchProviders.tsx
const WatchProviders = ({watchProviders}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('US');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const countries = Object.keys(watchProviders).map(country => {
      return {
        label: regions.filter(r => r.alpha2 === country)[0].name,
        value: country,
      };
    });

    setItems(countries);
  }, [watchProviders]);

  return (
    <>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        theme="DARK"
        dropDownDirection="AUTO"
        dropDownContainerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        zIndex={100}
        searchable={true}
        searchTextInputProps={{placeholder: 'Search...', autoFocus: true}}
      />

      {watchProviders[value] && (
        <View style={styles.watchProviders}>
          {watchProviders[value].flatrate &&
            watchProviders[value].flatrate.map(provider => (
              <View style={styles.providerContainer} key={provider.provider_id}>
                <Image
                  key={provider.provider_id}
                  style={styles.providerImage}
                  source={{
                    uri: `https://image.tmdb.org/t/p/w200${provider.logo_path}`,
                  }}
                />
              </View>
            ))}
          {watchProviders[value].ads &&
            watchProviders[value].ads.map(provider => (
              <View style={styles.providerContainer} key={provider.provider_id}>
                <Image
                  key={provider.provider_id}
                  style={styles.providerImage}
                  source={{
                    uri: `https://image.tmdb.org/t/p/w200${provider.logo_path}`,
                  }}
                />
              </View>
            ))}
        </View>
      )}
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
  watchProviders: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 8,
  },
  providerContainer: {
    padding: 8,
  },
  providerImage: {
    width: 72,
    height: 72,
    borderRadius: 8,
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
});

export default TVScreen;
