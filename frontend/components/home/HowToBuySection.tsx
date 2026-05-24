import { Text, View } from 'react-native';



type Props = {

  styles: Record<string, object>;

};



export function HowToBuySection({ styles }: Props) {

  return (

    <View style={styles.section}>

      <Text style={styles.sectionTitle}>¿Como comprar?</Text>

      <View style={styles.stepsGrid}>

        <View style={styles.stepCard}>

          <Text style={styles.stepNumber}>1</Text>

          <Text style={styles.stepTitle}>Elige tu regalo</Text>

          <Text style={styles.stepText}>Explora el catalogo y agrega productos al carrito.</Text>

        </View>

        <View style={styles.stepCard}>

          <Text style={styles.stepNumber}>2</Text>

          <Text style={styles.stepTitle}>Revisa tu pedido</Text>

          <Text style={styles.stepText}>Valida cantidades y total antes de enviar.</Text>

        </View>

        <View style={styles.stepCard}>

          <Text style={styles.stepNumber}>3</Text>

          <Text style={styles.stepTitle}>Confirma por WhatsApp</Text>

          <Text style={styles.stepText}>Envia el pedido y coordinamos entrega.</Text>

        </View>

      </View>

    </View>

  );

}

