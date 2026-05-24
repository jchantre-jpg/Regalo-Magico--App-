/**
 * Menú lateral con navegación por secciones y acceso al admin.
 */
import { Modal, Pressable, Text, View } from 'react-native';

import type { MenuAction } from '../../../backend/types/store';
import type { AppStyles } from '../../styles/types';

type Props = {
  styles: AppStyles;
  scale: number;
  /** Padding superior según notch del dispositivo. */
  insetTop: number;
  visible: boolean;
  onClose: () => void;
  onAction: (action: MenuAction) => void;
};

/** Enlaces del menú lateral (acción → etiqueta visible). */
const ITEMS: { action: MenuAction; label: string }[] = [
  { action: 'inicio', label: 'Inicio' },
  { action: 'categorias', label: 'Categorias' },
  { action: 'productos', label: 'Productos' },
  { action: 'como', label: 'Como comprar' },
  { action: 'contacto', label: 'Contacto' },
  { action: 'admin', label: 'Administracion' },
];

/** Menú lateral: cada ítem dispara MenuAction (scroll o admin). */
export function NavMenu({ styles, scale, insetTop, visible, onClose, onAction }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.navMenuOverlay}>
        {/* Área oscura a la izquiercha: toque cierra el menú */}
        <Pressable style={styles.navMenuCloseArea} onPress={onClose} />
        {/* Panel derecho: lista de secciones + admin */}
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
