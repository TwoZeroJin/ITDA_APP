import { COLOR } from "@/constants";
import { useAuth } from "@/hooks/queries/useAuth";
import useGroupListPaging from '@/hooks/queries/useGroup';
import { User } from '@/types';
import { useScrollToTop } from '@react-navigation/native';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { FormProvider, useForm } from "react-hook-form";
import { FlatList, Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TestScreen() {
    // Paging Test
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useGroupListPaging({ page: 1, page_size: 10 });
    const [isRefreshing, setIsRefreshing] = useState(false);
    const ref = useRef<FlatList | null>(null);
    useScrollToTop(ref);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refetch();
        setIsRefreshing(false);
    };

    const handleEndReached = () => {
        if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
        }
    };
    return (
        <FlatList
            ref={ref}
            data={data?.pages.flat()}
            renderItem={({ item }) => <View><Text>{item.name}</Text></View>}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ paddingBottom: 100 }}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            ListEmptyComponent={
                <View>
                    <Text>No Data</Text>
                </View>
            }
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex                : 1,
        marginHorizontal    : 25,
    },
    imageContainer: {
        justifyContent  : "center",
        alignItems      : "center",
        marginTop       : 50,
        marginBottom    : 30
    },
    inputContainer: {
        gap             : 20,
        marginBottom    : 50
    },
    buttonContainer: {
        gap             : 10,
        marginBottom    : 16
    },
    findUserContainer: {
        alignItems      : "center",
        marginBottom    : 40
    },
    findIdText: {
        fontSize    : 14,
        color       : COLOR.TEXT_GRAY
    },
    line: {
        height          : 1,
        flex            : 2,
        backgroundColor : COLOR.BTN_BORDER
    },
    snsLoginTextContainer: {
        flexDirection   : "row",
        alignItems      : "center",
        marginBottom    : 5
    },
    snsLoginText: {
        fontSize            : 12,
        fontWeight          : 500,
        lineHeight          : 30,
        marginHorizontal    : 12
    },
    snsLoginBtnContainer: {
        gap : 10
    }
})