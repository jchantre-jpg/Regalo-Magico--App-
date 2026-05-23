import { Modal, Pressable, Text, View } from 'react-native';



type Props = {

  styles: Record<string, object>;

  scale: number;

  insetTop: number;

  visible: boolean;

  onClose: () => void;

  onAction: (action: string) => void;

};



const ITEMS: { action: string; label: string }[] = [

  { action: 'inicio', label: 'Inicio' },

  { action: 'categorias', label: 'Categorias' },

  { action: 'productos', label: 'Productos' },

  { action: 'como', label: 'Como comprar' },

  { action: 'contacto', label: 'Contacto' },

  { action: 'admin', label: 'Administracion' },

];



export function NavMenu({ styles, scale, insetTop, visible, onClose, onAction }: Props) {

  return (

    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>

      <View style={styles.navMenuOverlay}>

        <Pressable style={styles.navMenuCloseArea} onPress={onClose} />

        <View style={[styles.menuPanel, { paddingTop: insetTop + Math.round(12 * scale) }]}>

          <Text style={styles.navMenuTitle}>Menu</Text>

          {ITEMS.map((item) => (

            <Pressable

              key={item.action}

              style={styles.navMenuItem}

              onPress={() => onAction(item.action)}

            >

              <Text style={styles.navMenuItemText}>{item.label}</Text>

            </Pressable>

          ))}

        </View>

      </View>

    </Modal>

  );

}

