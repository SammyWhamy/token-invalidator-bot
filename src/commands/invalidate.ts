import {APIApplicationCommandInteractionDataStringOption, ApplicationCommandOptionType} from "discord-api-types/v10";
import {ChatCommand, Embed, MessageResponse} from "dishttp";

export const invalidate = new ChatCommand({
    data: {
        name: "invalidate",
        description: "Invalidate a token",
        options: [{
            type: ApplicationCommandOptionType.String,
            name: 'token',
            description: 'The token to invalidate',
            required: true,
        }, {
            type: ApplicationCommandOptionType.String,
            name: 'link',
            description: 'The link to the token',
            required: false,
        }]
    },
    executor: async (message, env) => {
        const token = (message.data.options!.find(o => o.name === 'token') as APIApplicationCommandInteractionDataStringOption).value;
        const link = (message.data.options!.find(o => o.name === 'link') as APIApplicationCommandInteractionDataStringOption)?.value;

        const response = await fetch(`https://token-invalidator.vercel.app/api/tokens/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bot ${env.API_KEY}`,
                'X-Submitted-by': message.user ? message.user.id : message.member!.user.id
            },
            body: JSON.stringify({
                token,
                link
            }),
        });

        const json = await response.json();

        if(response.status !== 200) {
            const embed = new Embed()
                .setTitle("Error")
                .setColor(0xED4245)
                .setDescription(json.error);

            return new MessageResponse({embeds: [embed]});
        }

        const embed = new Embed()
            .setTitle("Success")
            .setColor(0x57F287)
            .setDescription(`Token invalidated\nView the token [here](https://github.com/SammyWhamy/invalidate-tokens/blob/main/tokens.md)`);

        return new MessageResponse({embeds: [embed]});
    }
})
