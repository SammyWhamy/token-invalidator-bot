import {APIApplicationCommandInteractionDataStringOption, ApplicationCommandOptionType} from "discord-api-types/v10";
import {ChatCommand, Embed, MessageResponse} from "dishttp";

export const stats = new ChatCommand({
    data: {
        name: "stats",
        description: "View someones token submitting stats",
        options: [{
            type: ApplicationCommandOptionType.User,
            name: 'user',
            description: 'The user/id to check stats for',
            required: true,
        }]
    },
    executor: async (message) => {
        const id = (message.data.options!.find(o => o.name === 'user') as APIApplicationCommandInteractionDataStringOption).value;

        const response = await fetch(`https://token-invalidator.vercel.app/api/tokens/user/${id}`);

        if(response.status !== 200) {
            const embed = new Embed()
                .setTitle("Error")
                .setColor(0xED4245)
                .setDescription("Something went wrong, please try again later");

            return new MessageResponse({embeds: [embed]});
        }

        const json = await response.json();

        if(json.length === 0) {
            const embed = new Embed()
                .setTitle(`Stats for ${id}`)
                .setColor(0x57F287)
                .setDescription("This user has not submitted any tokens!");

            return new MessageResponse({embeds: [embed]});
        }

        const embed = new Embed()
            .setTitle(`${json.length} submitted token(s)`)
            .setColor(0x5865F2);

        return new MessageResponse({embeds: [embed]});
    }
})
