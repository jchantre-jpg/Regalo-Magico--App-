import { Pressable, Text, View } from 'react-native';



type Props = {

  styles: Record<string, object>;

  onExplore: () => void;

};



export function HeroSection({ styles, onExplore }: Props) {

  return (

    <View style={styles.heroSection}>

      <Text style={styles.heroTitle}>Encuentra el regalo perfecto</Text>

      <Text style={styles.heroSubtitle}>

        Selecciona, personaliza y compra por WhatsApp. Sin pasarelas de pago, rapido y seguro.

      </Text>

      <Pressable style={styles.heroButton} onPress={onExplore}>

        <Text style={styles.heroButtonText}>Explorar regalos</Text>

      </Pressable>

    </View>

  );

}

