
import { useNavigation, useRoute } from '@react-navigation/native'
import { FlatList, Image, TouchableOpacity, View,Text } from 'react-native';
import { useEffect, useState, } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import { gameParams } from '../../@types/@navigation';
import { Entypo } from '@expo/vector-icons'

import logoImg from '../../assets/logo-nlw-esports.png'

import { Background } from '../../components/Background'
import { Heading } from '../../components/Heading';
import { DuoCard, DuoCardProps} from '../../components/DuoCard';

import { styles } from './styles'
import { THEME } from '../../theme';
import { DuoMatch } from '../../components/DuoMatch';





export function Games() {

  const navigation = useNavigation()
  const route = useRoute();
  const game = route.params as gameParams;

  
  function handleGoBack(){
      navigation.goBack()
  }
  
  async function getDiscordUser (adId: string){
    fetch(`http:192.168.0.9:3333/ads/${adId}/discord`)
    .then(response => response.json())
    .then(data =>{
       setDiscordDuoSelected(data.discord)
       return data.discord
      })
  }


  const[duos, setDuos] = useState<DuoCardProps[]>([])
  const[discordDuoSelected, setDiscordDuoSelected] = useState('')


  useEffect(() => {
    fetch(`http:192.168.0.9:3333/games/${game.id}/ads`)
    .then(response => response.json())
    .then(data =>{setDuos(data)})
  },[])


  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}> 
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo
              name="chevron-thin-left"
              color={THEME.COLORS.CAPTION_300}
              size={20}
            />
          </TouchableOpacity>

          <Image
          source={logoImg}
          style={styles.logo}
          />
          <View style={styles.rigth}/>
        </View>

        <Image
          source={{uri: game.bannerUrl}}
          style={styles.bannerGame}
          resizeMode="cover"
          />

        <Heading  
          title={game.title}
          subtitle='Conenecte-se e come??e a jogar!'
        />
        <FlatList
          data={duos}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <DuoCard
             data={item}
             onConnect={()=>{getDiscordUser(item.id)}}
             />
          )}
          horizontal
          style={styles.containerList}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[duos.length > 0 ? styles.contentList: styles.emptyContainer]}
          ListEmptyComponent={() => (
            <Text style={styles.textEmpty}>
              N??o h?? an??ncios publicados ainda...
            </Text>
            )}
        />

        <DuoMatch 
          statusBarTranslucent
          transparent
          visible={discordDuoSelected.length > 0}
          discord={discordDuoSelected}
          onClose={() => setDiscordDuoSelected('')}
        >
        </DuoMatch>    

      </SafeAreaView>
    </Background>
  );
}