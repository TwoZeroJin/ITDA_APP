import { COLOR, COMM_STYLES } from "@/constants";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CommHeader from "@/components/comm/CommHeader";
import CommBottomButton from "@/components/comm/CommBottomButton";
import { GroupInfo, CodeInfo } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import ImageCarousel from "@/components/comm/ImageCarousel";
import CommLabel from "@/components/comm/CommLabel";
import CustomDialog from "@/components/modal/CustomDialog";
import { parseImageList, getCategoryList } from "@/utils/commUtil";
import { useGroupInsert, useGroupUpdate } from "@/hooks/queries/useGroup";

/**
 * 클럽 생성 - 최종 미리보기 및 생성 화면
 */
export default function GroupCreatePreViewScreen() {
  const prevGroupInfo = useLocalSearchParams() as Partial<GroupInfo> as GroupInfo;
  const imageList = parseImageList(prevGroupInfo.img_list_json);
  const groupInsert = useGroupInsert();
  const groupUpdate = useGroupUpdate();
  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [categoryList, setCategoryList] = useState<CodeInfo[]>([]);

  useEffect(() => {
    getCategoryList().then(setCategoryList);
  }, []);

  const getCategoryValue = (code_id: string) => {
    const found = categoryList.find(item => item.code_id === code_id);
    return found?.code_value ?? code_id;
  };

  const handleMutationSuccess = () => {
    router.navigate({
      pathname: '/groups/createComplete',
      params: { 
        group_id: prevGroupInfo.group_id || '',
      },
    });
  };
  const handleMutationError = (error: unknown) => {
    setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    setIsErrorDialogVisible(true);
  };

  const handleCreateGroup = () => {
    const formValues = {
      ...prevGroupInfo,
      img_list: imageList,
    };
    
    if (prevGroupInfo.group_id) {
      // group_id가 존재하면 업데이트, 없으면 새로 생성
      groupUpdate.mutate(formValues, {
        onSuccess: handleMutationSuccess,
        onError: handleMutationError,
      });
    } else {
      groupInsert.mutate(formValues, {
        onSuccess: handleMutationSuccess,
        onError: handleMutationError,
      });
    }
  }

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="미리 보기"/>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* 이미지 캐러슬 */}
        <View>
          <ImageCarousel
            images={imageList.map((file) => file.file_path)}
            height={280}
            // onPressImage={(i) => console.log("pressed image", i)} // 추후 이미지 수정 기능 추가 시 활용
          />
        </View>

        {/* 클럽 정보 */}
        <View style={styles.commContainer}>
          {/* 클럽 라벨 */}
          <View style={styles.labelContainer}>
              <CommLabel variant="club" />
              <CommLabel variant="category" category={prevGroupInfo.group_subj} />
          </View>

          {/* 클럽 제목 */}
          <Text style={styles.commContainerTitle}>{prevGroupInfo.group_name}</Text>

          {/* 클럽 장소, 날짜, 시간 */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.contentInfoText}>{getCategoryValue(prevGroupInfo.group_subj)}</Text>
          </View>
          {/* 설명 */}
          <Text style={styles.contentDesc}>{prevGroupInfo.group_desc}</Text>
        </View>
        {/* 추후 작업 */}
        {/* 모임장 및 참여 멤버 */}
        {/* 클럽 상세 소개 */}
        {/* 장소 주소 및 지도?? */}
        {/* 댓글 ?? */}
        {/* 후기 */}

      </ScrollView>

      <CommBottomButton label={`클럽 ${prevGroupInfo.group_id ? '수정' : '열기'}`} onPress={handleCreateGroup}/>

      <CustomDialog
        visible={isErrorDialogVisible}
        title="생성 실패"
        content={`클럽을 생성하지 못했어요. 잠시 후 다시 시도해 주세요. \n${errorMessage}`}
        cancelLabel="닫기"
        confirmLabel="다시 시도"
        onCancel={() => setIsErrorDialogVisible(false)}
        onConfirm={() => {
          setIsErrorDialogVisible(false);
          handleCreateGroup();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  commContainerTitle: {
    fontSize          : 20,
    fontWeight        : 'bold', 
    marginBottom      : 8,
  },
  commContainer: {
    marginHorizontal  : 16,
    marginBottom      : 30,
    gap               : 16,
  },
  labelContainer: {
    flexDirection     : 'row',
    gap               : 6,
    marginTop         : 12,
    marginBottom      : 4,
  },
  contentInfoText: {
    fontSize          : 16,
    marginStart       : -8,
    color             : COLOR.TEXT_DEFAULT,
  },
  contentDesc: {
    fontSize          : 16,
    color             : COLOR.TEXT_DEFAULT,
  },
});