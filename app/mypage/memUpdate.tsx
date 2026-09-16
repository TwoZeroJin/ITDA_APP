import CommBottomButton from "@/components/comm/CommBottomButton";
import CommHeader from "@/components/comm/CommHeader";
import CustomDialog from "@/components/modal/CustomDialog";
import BirthInput from "@/components/inputs/BirthInput";
import ChurchSelectBox from "@/components/inputs/ChurchSelectBox";
import ChurchTmNmInput from "@/components/inputs/ChurchTmNmInput";
import GenderInput from "@/components/inputs/GenderInput";
import NameInput from "@/components/inputs/NameInput";
import NickNameInput from "@/components/inputs/NickNameInput";
import ProfileImageInput from "@/components/inputs/ProfileImageInput";
import { useAuth, useFindInfo } from "@/hooks/queries/useAuth";
import { useMemberUpdate } from "@/hooks/queries/useMember";
import { MemberInfo } from "@/types";
import { showToast } from "@/utils/commToast";
import { getMemberInfo, getChurchList, saveMemberInfoForUpdate } from "@/utils/commUtil";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { COMM_STYLES } from "@/constants";
import MemEmailInput from "@/components/inputs/MemEmailInput";
import InterestCategoryInput from "@/components/inputs/InterestCategoryInput";
import { useLoading } from "@/contexts/LoadingContext";
import ChurchNmInput from "@/components/inputs/ChurchNmInput";
import ChurchMnmInput from "@/components/inputs/ChurchMnmInput";
import ChurchAddrInput from "@/components/inputs/ChurchAddrInput";

/**
 * 회원정보 수정
 */
export default function MemberUpdateScreen() {
  const { logout } = useAuth();
  const { setLoading } = useLoading();
  const [memberInfo, setMemberInfo] = useState<MemberInfo>();
  const memberUpdate = useMemberUpdate();
  const { checkDupMutation } = useFindInfo();
  const [isAuthDialogVisible, setIsAuthDialogVisible] = useState(false);

  const updateForm = useForm<MemberInfo>({
    defaultValues: {
      mem_name          : '',
      mem_telno         : '',
      mem_email         : '',
      mem_nick          : '',
      mem_gender        : '',
      mem_birth         : '',
      mem_church_nm     : '',
      mem_church_mnm    : '',
      mem_church_addr   : '',
      mem_church_tm_nm  : '',
      mem_church_id     : 0,
      mem_image_id      : '',
      new_image_name    : '',
    }
  });

  // 중복 체크 함수 (아이디, 이메일, 닉네임)
  const checkDuplicateField = async (key: "login_id" | "mem_email" | "mem_nick", value?: string) => {
    const targetValue = (value ?? "").trim();
    const result = await checkDupMutation.mutateAsync({ [key]: targetValue });
    if (result.ret_code != 200) {
      showToast({ text1: result.ret_msg });
      return false;
    }
    return true;
  };

  // 회원정보 조회 및 없을 경우 로그인 화면으로 이동
  useEffect(() => {
    const fetchData = async () => {
      const memberInfo = await getMemberInfo();

      if (!memberInfo) {
        setIsAuthDialogVisible(true);
        return;
      }
      // 교회명으로 교회 리스트에서 교회 정보 조회하여 mem_church_id 세팅
      const churchList = await getChurchList();
      const selectedChurch = churchList.find((church) => church.church_name === memberInfo.mem_church_nm);

      setMemberInfo(memberInfo);
      // 폼 초기값 세팅
      updateForm.reset({
        mem_name          : memberInfo.mem_name ?? '',
        mem_nick          : memberInfo.mem_nick ?? '',
        mem_gender        : memberInfo.mem_gender ?? '',
        mem_birth         : memberInfo.mem_birth ?? '',
        mem_telno         : memberInfo.mem_telno ?? '',
        mem_email         : memberInfo.mem_email ?? '',
        mem_addr          : memberInfo.mem_addr ?? '',
        mem_interest      : memberInfo.mem_interest ?? '',
        mem_church_nm     : memberInfo.mem_church_nm ?? '',
        mem_church_mnm    : memberInfo.mem_church_mnm ?? '',
        mem_church_addr   : memberInfo.mem_church_addr ?? '',
        mem_church_tm_nm  : memberInfo.mem_church_tm_nm ?? '',
        mem_church_id     : selectedChurch?.church_id ?? 0,
        mem_image_id      : memberInfo.mem_image_id ?? '',
        new_image_name    : memberInfo.new_image_name ?? '',
      });
    };
  
    fetchData();
  }, [updateForm]);

  const onSubmit = async (formValues: MemberInfo) => {
    // 서버를 통한 중복 체크
    if (memberInfo?.mem_name !== formValues.mem_name && !await checkDuplicateField("mem_email", formValues.mem_email)) return;
    if (memberInfo?.mem_nick !== formValues.mem_nick && !await checkDuplicateField("mem_nick", formValues.mem_nick)) return;

    const submitValues = {
      ...formValues,
      ...(formValues.new_image_name === 'DEL' // 기존 이미지 삭제인 경우 서버에 DEL로 전달하여 처리
        ? {
            new_image_name: '',
            mem_image_id: 'DEL',
        }
        : {}),
    };

    memberUpdate.mutate(submitValues, {
      onSuccess: async (result) => {
        showToast({ text1: result.ret_code === 200 ? '회원정보가 수정되었습니다.' : '회원정보 수정에 실패했습니다.' });
        await saveMemberInfoForUpdate(result.data);
        router.back();
      },
      onError: () => {
        showToast({ text1: '회원정보 수정에 실패했습니다.' });
      },
    });
  }

  useEffect(() => {
    setLoading(memberUpdate.isPending);
  }, [memberUpdate.isPending]);

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="회원정보 수정"/>
      <KeyboardAwareScrollView
        style={{ marginBottom: 120 }}
        contentContainerStyle={[
          COMM_STYLES.formContainer
          , {gap: 0}
        ]}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardOpeningTime={0}
        extraScrollHeight={-120}
        enableResetScrollToCoords={false}
      >
        <FormProvider {...updateForm}>
          <View style={{gap: 16, marginBottom: 16}}>
            <ProfileImageInput initialImageUrl={memberInfo?.mem_image_url}/>
            {/* <ChurchSelectBox/> */}
            <NameInput focusField="mem_email"/>
            {/* <MemTelnoInput/> */}
            <MemEmailInput focusField="mem_nick"/>
            <GenderInput/>
            <BirthInput/>
            <NickNameInput/>
            <ChurchNmInput/>
            <ChurchMnmInput/>
            {/* <ChurchTmNmInput/> */}
            <ChurchAddrInput/>
          </View>
          <InterestCategoryInput />
        </FormProvider>
      </KeyboardAwareScrollView>
      <CommBottomButton label="수정하기" onPress={updateForm.handleSubmit(onSubmit)}/>

      <CustomDialog
        visible={isAuthDialogVisible}
        content="로그인이 필요합니다."
        confirmLabel="OK"
        onCancel={() => {}}
        onConfirm={() => {
        setIsAuthDialogVisible(false);
        logout();
        router.replace('/user/login');
        }}
      />
    </View>
  )
}