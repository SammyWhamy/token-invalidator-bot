import {APIApplicationCommandInteractionDataStringOption, ApplicationCommandOptionType} from "discord-api-types/v10";
import {ChatCommand, Embed, MessageResponse} from "dishttp";

export const check = new ChatCommand({
    data: {
        name: "check",
        description: "Check if an ID has any registered leaked tokens",
        options: [{
            type: ApplicationCommandOptionType.User,
            name: 'user',
            description: 'The user/id to check leaked tokens for',
            required: true,
        }]
    },
    executor: async (message) => {
        const id = (message.data.options!.find(o => o.name === 'user') as APIApplicationCommandInteractionDataStringOption).value;

        const response = await fetch(`https://token-invalidator.vercel.app/api/tokens/${id}`);

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
                .setTitle("No leaked tokens")
                .setColor(0x57F287)
                .setDescription("This ID has no leaked tokens");

            return new MessageResponse({embeds: [embed]});
        }

        const tokenList = json.map((token: any) => `\`${token.token}\`\nLeaked <t:${Math.floor(new Date(token.createdAt).getTime()/1000)}:R>\nSubmitted by: ${token.submitter}\nFound [here](${token.link})`);
        const embed = new Embed()
            .setTitle(`${json.length} leaked token(s)`)
            .setDescription(tokenList.join("\n\n"))
            .setColor(0x5865F2)
            .setFooter({text: `ID: ${id}`})

        return new MessageResponse({embeds: [embed]});
    }
})
