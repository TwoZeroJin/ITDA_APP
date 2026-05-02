import { COLOR } from "@/constants";
import { useAuth } from "@/hooks/queries/useAuth";
import useGroupListPaging from '@/hooks/queries/useGroup';
import { User } from '@/types';
import { useScrollToTop } from '@react-navigation/native';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { FormProvider, useForm } from "react-hook-form";
import { FlatList, Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";

export default function TestScreen() {
    // Paging Test
    const { data, results, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useGroupListPaging({ page: 1, page_size: 10 });
    const [isRefreshing, setIsRefreshing] = useState(false);
    const ref = useRef<FlatList | null>(null);

    useScrollToTop(ref);

    // 위로 끌어올릴 경우 재조회
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refetch();
        setIsRefreshing(false);
    };

    // 맨 밑에 도달할 경우 다음 페이지 조회
    const handleEndReached = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };
    return (
        <FlatList
            ref={ref}
            data={results}
            renderItem={({ item }) => (
                <View><Text>{JSON.stringify(item.group_name)}</Text></View>
            )}
            keyExtractor={(item) => item.group_id}
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
        backgroundColor : COLOR.COMM_GRAY_6
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