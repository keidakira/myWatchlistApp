import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Linking,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Separator from '../components/Separator';
import CustomButton from '../components/CustomButton';
import Icon from '../components/Icon';

import CustomText from '../components/CustomText';
import regions from '../regions.json';

const MovieScreen = ({movieId, closeSheet}) => {
  const {data, error, loading} = useMovie(movieId);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  return <Movie movie={data} close={closeSheet} />;
};

// Path: Movie.tsx
const Movie = ({movie, close}) => {
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
  const [watchProviders, setWatchProviders] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('watch');
  const [items, setItems] = useState([
    {label: 'Where to Watch', value: 'watch'},
  ]);

  useEffect(() => {
    const getWatchProviders = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=4f2917841238275498913fb9c85b266f`,
      );
      const data = await response.json();
      setWatchProviders(data.results);
    };

    getWatchProviders();
  }, [movie.id]);

  return (
    <View style={styles.container}>
      <ImageBackground
        style={{width: '100%', height: 256}}
        source={{
          uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}></View>
        <Text
          style={{
            fontSize: 24,
            color: 'white',
            padding: 16,
            position: 'absolute',
            bottom: 0,
            fontWeight: 'bold',
          }}
          numberOfLines={2}>
          {movie.original_title}
        </Text>
        <Icon
          name="close"
          size={24}
          color="white"
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
          onPress={close}
        />
      </ImageBackground>
      <View style={styles.subContainer}>
        <CustomButton title="Watch Trailer" icon="play" onPress={openTrailer} />
        <TouchableHighlight
          onPress={() => {
            setViewOverview(!viewOverview);
          }}>
          <CustomText numberOfLines={viewOverview ? undefined : 4}>
            {movie.overview}
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

const useMovie = movieId => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, [movieId]);

  return {data, error, loading};
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
  return <Text style={{color: 'black'}}>Error...</Text>;
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
});

export default MovieScreen;
