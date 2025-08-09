import CommHeader from '@/components/CommHeader';
import CustomDialog from '@/components/CustomDialog';
import MessageInput from '@/components/inputs/MessageInput';
import { ChatData, CodeInfo } from '@/types';
import { getCategoryList } from '@/utils/commUtil';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function IndexScreen() {
  const chatForm = useForm<ChatData>({
    defaultValues: {
        mem_id    : 1,
        chat_msg  : "",
    }
  });

  const insets = useSafeAreaInsets();
  const [categoryList, setCategoryList] = useState<CodeInfo[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setCategoryList(await getCategoryList());
    }

    fetchData();
  }, [])

  // console.log('categoryList : ', categoryList);

  return (
    <SafeAreaView style={styles.container}>
      <FormProvider {...chatForm}>
      <CommHeader isLogo={false}/>
        <View style={[styles.msgContainer, {marginBottom : insets.bottom}]}>
          <MessageInput/>
        </View>
      </FormProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container : {
    flex : 1
  },
  msgContainer: {
    position            : "absolute",
    bottom              : 0,
    width               : "100%",
    paddingTop          : 12,
    paddingHorizontal   : 10
  }
});