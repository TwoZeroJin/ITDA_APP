import CommHeader from '@/components/CommHeader';
import { SafeAreaView, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <CommHeader/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container : {
    
  }
});