import { h } from "@stencil/core";

export const bubbleContentRenderers: Record<string, (props: Record<string, any>) => any> = {
    markdown: (props: Record<string, any>) => {
        return <zane-chat-renderer-markdown {...props}></zane-chat-renderer-markdown>;
    },
};

export type RendererType = keyof typeof bubbleContentRenderers;
