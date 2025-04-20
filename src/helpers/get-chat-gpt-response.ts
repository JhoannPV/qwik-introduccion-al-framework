import { OpenAI, } from "openai";
const client = new OpenAI({
    apiKey: import.meta.env.PUBLIC_OPEN_AI_KEY,
    dangerouslyAllowBrowser: true,
});

export const getFunFactAboutPokemon = async (pokemonName: string): Promise<string> => {
    const response = await client.responses.create({
        model: "gpt-4o-mini",
        input: `Escribe datos interesantes del pokemon ${pokemonName}, por favor dame texto plano sin formato`,
        text: {
            "format": {
                "type": "text"
            }
        },
        temperature: 0.7,
        max_output_tokens: 60,
        top_p: 1,
        store: true,
    });

    return response.output_text || `No tengo nada sobre ${pokemonName}, lo siento`;
}