import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" }); // Adjust region as needed

const longText = `Jane: Thanks again, Nurse Miller.
Nurse Miller:  You're welcome, Jane. Dr. Jones seems happy with your progress.
Jane: That's good, but honestly, I'm feeling so stressed lately.  Work is a nightmare, and even at home... ugh.
Nurse Miller: It sounds like you're carrying a heavy load. Stress can definitely affect your health, so it's good you mentioned it. Have you tried any relaxation techniques?
Jane: Not really. I just keep pushing through, hoping it'll get better.
Nurse Miller:  Pushing through can work sometimes, but it's important to give yourself a break.  There are some great resources available - meditation apps, deep breathing exercises, even joining a support group.  Would you be interested in some information on that?
Jane: You know what, yes, please.  Anything to help this headache go away!
Nurse Miller: Absolutely.  Let me grab a pamphlet for you.  And remember, stress management is a skill, so be patient with yourself.
Jane: Thanks, Nurse Miller.  I appreciate you listening`

const convertNewLineToPeriod = (text) => {
    return text.replace(/\n/g, ' ~ ')
}

console.log(convertNewLineToPeriod(longText));
const shortText = 'hello my friend'

const body = `{\"inputText\":\"Please create a summary of the following conversation: (${convertNewLineToPeriod(longText)})\",\"textGenerationConfig\":{\"maxTokenCount\":512,\"stopSequences\":[],\"temperature\":0.2,\"topP\":0.9}}`
const input = {
    body,
    modelId: "amazon.titan-text-lite-v1",
    contentType: "application/json",
    accept: "application/json",
};

const command = new InvokeModelCommand(input);

try {
    const response = await client.send(command);

    // Handle the response data
    console.log("Response:", response.body); // Output the generated summary
    const statusCode = response.$metadata.httpStatusCode;
    console.log("Status Code:", statusCode);

    const dataAsU8Array = new Uint8Array(response.body)
    const jsonString = Buffer.from(dataAsU8Array).toString('utf8')

    const parsedData = JSON.parse(jsonString)

    console.log(parsedData)
} catch (error) {
    console.error("Error invoking model:", error);
}
