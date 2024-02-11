// Import the Deno module for filesystem operations
import { GTAGContainer } from "./classes/container.ts";

// Define the path to your JSON file
const filePath = "web_data.json";

// Use async/await to read the JSON file
async function main() {
  try {
    const webData = (
      await import(`./${filePath}`, {
        assert: { type: "json" },
      })
    ).default;
    console.log(webData.resource?.version);
    const container = await createContainer(webData);
    console.log(container);
  } catch (error) {
    console.error("Error reading JSON:", error);
  }
}

async function createContainer(data: any) {
  console.log(data);

  let container = new GTAGContainer();
  let ctx = {
    container: container,
    macros: data?.resource?.macros || [],
  };
  container.parseMacros(ctx);

  await new Promise(() => {});

  return container;
}

// Call the main function to start the script
main();
