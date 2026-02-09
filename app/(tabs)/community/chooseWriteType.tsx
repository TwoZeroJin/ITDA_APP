import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLOR } from '@/constants';

type OptionKey = 'feed' | 'review';

// NOTE:
// If you have a shared color file (recommended), replace the next line with:
//
// import { ITDA_COLOR } from '@/constants/colors';
//
// and remove the fallback const below.
const ITDA_COLOR = '#0b74de'; // <- 잇다 아이콘 색상으로 변경하세요

const OPTIONS: { key: OptionKey; title: string; desc: string; icon: React.ReactNode }[] = [
  {
    key: 'feed',
    title: '피드 작성',
    desc: '잇다 멤버들에게 커뮤니티에 공개할 글을 작성해요.',
    icon: <Ionicons name="document-text-outline" size={22} color="#6B6B6B" />,
  },
  {
    key: 'review',
    title: '모임 후기',
    desc: '잇다에서 참여한 모임 후기를 작성해요.',
    icon: <MaterialCommunityIcons name="account-group-outline" size={22} color="#6B6B6B" />,
  },
];

export default function chooseWriteType() {
  const [selected, setSelected] = useState<OptionKey | null>(null);
  const router = useRouter();

  const onNext = () => {
    if (!selected) return;
    // 1. 선택된 옵션이 '피드 작성'('feed')인 경우 이동 로직 추가
    if (selected === 'feed') {
      // 파일 구조가 app/community/writeFeedback.tsx 인 경우 아래와 같이 경로를 지정합니다.
      // 실제 프로젝트의 폴더 경로에 맞춰 수정해 주세요.
      router.navigate('/community/writeFeedback'); 
    } else if (selected === 'review') {
      // 모임 후기 클릭 시 이동할 경로가 있다면 여기에 추가
      router.navigate('/community/chooseMeet'); 
    }    
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.title}>커뮤니티 작성</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardList}>
          {OPTIONS.map(opt => {
            const active = selected === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[styles.card, active && styles.cardActive]}
                onPress={() => setSelected(opt.key)}
                activeOpacity={0.85}
              >
                <View style={styles.cardLeft}>
                  <View style={styles.iconBox}>{opt.icon}</View>
                  <View style={styles.cardText}>
                    <Text style={styles.cardTitle}>{opt.title}</Text>
                    <Text style={styles.cardDesc}>{opt.desc}</Text>
                  </View>
                </View>

                <View style={styles.cardRight}>
                  {active ? (
                    <View style={styles.checkBox}>
                      <Ionicons name="checkmark" size={18} color="#fff" />
                    </View>
                  ) : (
                    <View style={styles.unchecked} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !selected && styles.nextButtonDisabled]}
          onPress={onNext}
          disabled={!selected}
        >
          <Text style={[styles.nextText, !selected && styles.nextTextDisabled]}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#f2f2f2',
  },
  backButton: { width: 40, justifyContent: 'center', alignItems: 'flex-start' },
  title: { fontSize: 16, fontWeight: '600', color: '#222' },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 140 : 120,
  },

  cardList: {},

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardActive: {
    borderColor: COLOR.APP_MAIN,
    shadowColor: COLOR.APP_MAIN,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#222', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#7a7a7a' },

  cardRight: { width: 28, alignItems: 'center', justifyContent: 'center' },
  checkBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLOR.APP_MAIN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unchecked: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 16,
    paddingHorizontal: 20,
  },
  nextButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: COLOR.APP_MAIN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#f2f2f2',
  },
  nextText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  nextTextDisabled: { color: '#999' },
});