import { chatInsert } from "@/api/chat";
import { useMutation } from "@tanstack/react-query";

function useChatInsert() {
    return useMutation({
        mutationFn : chatInsert,
        onSuccess: ()=>{}
    });
}

export { useChatInsert };
