import {ChatCommand, Embed, MessageResponse} from "dishttp";

export const ping = new ChatCommand({
    data: {
        name: "ping",
        description: "Ping the bot",
    },
    executor: async () => {
        const embed = new Embed()
            .setTitle("Pong!")
            .setDescription("View our [website](https://invalidate.vercel.app) too!")
            .setColor(0x5865F2)

        return new MessageResponse({embeds: [embed]});
    }
})
