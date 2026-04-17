import React from "react";
import CommHeader from "@/components/CommHeader";
import { useAuth } from "@/hooks/queries/useAuth";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";

/** =========================
 *  팝업(모달) 컴포넌트 - 같은 파일 안에 포함
 *  ========================= */
type ActivityTagModalProps = {
  visible: boolean;
  onClose: () => void;
  onDone?: (selected: string) => void;
};

const OPTIONS = ["등산", "클라이밍", "테니스", "복싱", "서핑", "기타"];

function ActivityTagModal({ visible, onClose, onDone }: ActivityTagModalProps) {
  const [selected, setSelected] = React.useState<string>("기타");

  React.useEffect(() => {
    if (visible) setSelected("기타");
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* 배경 딤 */}
      <Pressable style={modalStyles.backdrop} onPress={onClose} />

      {/* 가운데 팝업 */}
      <View style={modalStyles.centerWrap} pointerEvents="box-none">
        <View style={modalStyles.sheet}>
          <ScrollView
            style={{ maxHeight: 420 }}
            contentContainerStyle={modalStyles.sheetInner}
            showsVerticalScrollIndicator={false}
          >
            {[1, 2, 3].map((i) => (
              <View key={i} style={modalStyles.block}>
                <View style={modalStyles.blockHeader}>
                  <View style={modalStyles.blockAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={modalStyles.blockTitle}>액티비티</Text>
                    <Text style={modalStyles.blockSub}>러닝·등산·클라이밍</Text>
                  </View>
                </View>

                <View style={modalStyles.grid}>
                  {OPTIONS.map((item) => {
                    const active = selected === item;
                    return (
                      <Pressable
                        key={`${i}-${item}`}
                        onPress={() => setSelected(item)}
                        style={[modalStyles.chip, active && modalStyles.chipActive]}
                      >
                        <Text
                          style={[
                            modalStyles.chipText,
                            active && modalStyles.chipTextActive,
                          ]}
                        >
                          {item}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}

            <Pressable
              style={modalStyles.doneBtn}
              onPress={() => {
                onDone?.(selected);
                onClose();
              }}
            >
              <Text style={modalStyles.doneText}>완료</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  centerWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  sheet: {
    width: "100%",
    borderRadius: 18,
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sheetInner: { paddingBottom: 6 },

  block: {
    backgroundColor: "#f4f4f4",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  blockHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  blockAvatar: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: "#e0e0e0",
  },
  blockTitle: { fontSize: 12, fontWeight: "700", color: "#444" },
  blockSub: { fontSize: 10, color: "#8a8a8a", marginTop: 2 },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e4e4e4",
  },
  chipActive: { backgroundColor: "#ff6b6b", borderColor: "#ff6b6b" },
  chipText: { fontSize: 12, color: "#444", fontWeight: "600" },
  chipTextActive: { color: "#fff" },

  doneBtn: {
    marginTop: 8,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#ff8c8c",
    alignItems: "center",
    justifyContent: "center",
  },
  doneText: { color: "#fff", fontWeight: "800", fontSize: 14 },
});

/** =========================
 *  MyPage Screen
 *  ========================= */
function MeetCard({
  status = "모집",
  badge = "D-day 1",
}: {
  status?: "모집" | "모집완료";
  badge?: string;
}) {
  return (
    <View style={styles.card}>
      {/* 이미지 경로 에러나면 여기 Image를 View로 바꿔도 됨 */}
      {/* <Image source={require("../../../assets/thumb.jpg")} style={styles.thumbnail} /> */}
      <View style={styles.thumbnail} />

      <View style={{ flex: 1 }}>
        <View style={styles.cardTopRow}>
          <Text style={styles.dday}>{badge}</Text>
          <View style={[styles.statusPill, status === "모집완료" && styles.statusDone]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>

        <Text style={styles.cardTitle} numberOfLines={1}>
          보드게임 모여라🌈🌈🌈…
        </Text>

        <Text style={styles.meta}>6.28(토) 오후6:00 · 12명 참여</Text>
      </View>
    </View>
  );
}

export default function MyPageScreen() {
  const { logout } = useAuth(); // 필요하면 유지
  const [tagModalOpen, setTagModalOpen] = React.useState(false);

  return (
    <View style={styles.container}>
      <CommHeader isNoti={false} isSetting={true} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* 프로필 */}
        <View style={styles.profileSection}>
          <View style={styles.avatar} />

          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>송소희</Text>
              <Text style={styles.pencil}>✎</Text>
              <Pressable onPress={() => logout()} style={styles.editBtn}>
                <Text style={styles.pencil}>로그아웃</Text>
              </Pressable>
            </View>

            <View style={styles.introRow}>
              <Text style={styles.intro}>안녕하세요 저는 송채윤입니다!</Text>
              <Text style={styles.pencil}>✎</Text>
            </View>

            <View style={styles.teamRow}>
              <View style={styles.primaryChip}>
                <Text style={styles.primaryChipText}>합성교회</Text>
              </View>
              <View style={styles.dangerChip}>
                <Text style={styles.primaryChipText}>푸어팀</Text>
              </View>
              <Text style={styles.pencil}>✎</Text>
            </View>

            {/* 태그 + 연필(누르면 팝업 열림) */}
            <View style={styles.tagRow}>
              {["볼링", "배드민턴", "볼링", "배드민턴", "볼링", "배드민턴", "볼링", "+7"].map(
                (item, index) => (
                  <View key={index} style={styles.tagChip}>
                    <Text style={styles.tagText}>{item}</Text>
                  </View>
                )
              )}

              <Pressable onPress={() => setTagModalOpen(true)} style={styles.editBtn}>
                <Text style={styles.pencil}>✎</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* 참여 모임 */}
        <Text style={styles.sectionTitle}>현재 송채윤님이 참여한 모임이에요.</Text>
        <MeetCard status="모집" />

        {/* 개설 모임 */}
        <Text style={styles.sectionTitle}>현재 송채윤님이 개설한 모임이에요.</Text>
        <MeetCard status="모집완료" />
        <MeetCard status="모집완료" />

        {/* (옵션) 로그아웃 버튼 유지하고 싶으면 */}
        {/* <TouchableOpacity onPress={logout} style={{ marginTop: 20 }}>
          <Text style={{ color: "red" }}>로그아웃</Text>
        </TouchableOpacity> */}
      </ScrollView>

      {/* ✅ 팝업 */}
      <ActivityTagModal
        visible={tagModalOpen}
        onClose={() => setTagModalOpen(false)}
        onDone={(selected) => {
          console.log("선택:", selected);
          // 여기서 selected를 실제 상태에 반영하면 됨
        }}
      />
    </View>
  );
}

/** =========================
 *  Styles
 *  ========================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },

  profileSection: {
    flexDirection: "row",
    marginBottom: 18,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: "#5b5cff",
    marginRight: 16,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
  },
  pencil: {
    color: "#777",
    fontSize: 14,
  },

  introRow: {
    marginTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  intro: {
    fontSize: 13,
    color: "#555",
    flex: 1,
    marginRight: 10,
  },

  teamRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  primaryChip: {
    backgroundColor: "#ff8c8c",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dangerChip: {
    backgroundColor: "#ff5a5f",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  primaryChipText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    alignItems: "center",
    gap: 8,
  },
  tagChip: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: 12,
    color: "#444",
  },
  editBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    marginTop: 14,
    marginBottom: 10,
  },

  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
    backgroundColor: "#fff",
    gap: 10,
  },
  thumbnail: {
    width: 110,
    height: 70,
    borderRadius: 12,
    marginRight: 2,
    backgroundColor: "#eee",
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dday: {
    color: "#ff4b4b",
    fontSize: 12,
    fontWeight: "700",
  },
  statusPill: {
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusDone: {
    backgroundColor: "#31c48d",
  },
  statusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 6,
  },
  meta: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
});