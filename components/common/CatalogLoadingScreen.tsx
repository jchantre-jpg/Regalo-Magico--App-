import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function CatalogLoadingScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1816' }}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <StatusBar style="light" />
      <ActivityIndicator size="large" color="#f4d8a3" />
      <Text style={{ color: '#f5f0e8', marginTop: 16, fontSize: 16 }}>Cargando catalogo...</Text>
    </SafeAreaView>
  );
}
