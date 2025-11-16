import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { HouseConfig, RoomConfig, ObjectConfig, RoomConnection } from "../config/HouseConfig";
import { JsonHouseBuilder } from "../config/JsonHouseBuilder";
import { BlockBuffer } from "../io/BlockBuffer";

/**
 * AI-powered house builder that generates houses from natural language prompts
 * Uses LangChain to parse user prompts and generate HouseConfig structures
 */
export class AIHouseBuilder {
  private llm: ChatOpenAI;

  constructor(apiKey?: string, modelName: string = "gpt-4") {
    this.llm = new ChatOpenAI({
      openAIApiKey: apiKey || process.env.OPENAI_API_KEY,
      modelName: modelName,
      temperature: 0.7,
    });
  }

  /**
   * Builds a house from a natural language prompt
   * @param prompt - User's description of the house they want to build
   * @returns BlockBuffer containing the generated house
   */
  async buildFromPrompt(prompt: string): Promise<BlockBuffer> {
    const houseConfig = await this.generateHouseConfig(prompt);
    const builder = new JsonHouseBuilder();
    return builder.build(houseConfig);
  }

  /**
   * Generates a HouseConfig from a natural language prompt using LangChain
   * @param prompt - User's description of the house
   * @returns A complete HouseConfig object
   */
  async generateHouseConfig(prompt: string): Promise<HouseConfig> {
    const systemPrompt = this.buildSystemPrompt();

    const response = await this.llm.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ]);

    // Parse the LLM response as JSON
    const responseText = typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content);

    // Extract JSON from markdown code blocks if present
    const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || responseText.match(/(\{[\s\S]*\})/);
    const jsonText = jsonMatch ? jsonMatch[1] : responseText;

    const houseConfig: HouseConfig = JSON.parse(jsonText);

    // Post-process to add door connections between rooms
    houseConfig.connections = this.inferRoomConnections(houseConfig);

    return houseConfig;
  }

  /**
   * Builds the system prompt for the LLM
   */
  private buildSystemPrompt(): string {
    return `You are an expert Minecraft house architect. Given a user's description, generate a valid HouseConfig JSON.

IMPORTANT RULES:
1. Position coordinates should be reasonable (x, y, z)
2. Rotations must be 0, 90, 180, or 270
3. Room dimensions (width, depth, height) must be at least 3 blocks
4. Use appropriate Minecraft block types (e.g., "OakPlanks", "StoneBricks", "Glass", etc.)
5. Door materials must be valid door types (e.g., "OakDoor", "IronDoor", "BirchDoor")
6. Objects should be placed inside rooms with proper positioning
7. Doors should be placed on walls to connect rooms

Available block types include: OakPlanks, StoneBricks, Cobblestone, Glass, OakDoor, IronDoor, BirchDoor, Chest, Bed, CraftingTable, Furnace, Torch, Lantern, Bookshelf, etc.

Response format (JSON only, no additional text):
{
  "name": "House name",
  "description": "Brief description",
  "rooms": [
    {
      "name": "Room name",
      "position": { "x": 0, "y": 0, "z": 0 },
      "rotation": 0,
      "width": 10,
      "depth": 10,
      "height": 5,
      "floor": { "material": "OakPlanks" },
      "ceiling": { "material": "OakPlanks" },
      "walls": [
        { "side": "front", "material": "StoneBricks" },
        { "side": "back", "material": "StoneBricks" },
        { "side": "left", "material": "StoneBricks" },
        { "side": "right", "material": "StoneBricks" }
      ],
      "windows": [
        { "side": "front", "offsetAlong": 3, "offsetHeight": 2, "width": 2, "height": 2, "material": "Glass" }
      ],
      "doors": [
        { "side": "front", "offsetAlong": 5, "material": "OakDoor" }
      ],
      "objects": [
        { "type": "Bed", "position": { "x": 2, "y": 1, "z": 2 }, "description": "bed" },
        { "type": "Chest", "position": { "x": 8, "y": 1, "z": 2 }, "description": "storage chest" }
      ],
      "roof": { "material": "OakPlanks", "style": "flat" }
    }
  ]
}

Key guidelines:
- For multi-room houses, position rooms adjacent to each other
- Place doors on walls where rooms meet to connect them
- Include furniture/objects based on room purpose (beds in bedrooms, furnaces in kitchens, etc.)
- Use consistent materials for a cohesive design
- Ensure doors connect rooms logically
- Objects should be inside room boundaries

Respond with ONLY the JSON, no explanations or markdown.`;
  }

  /**
   * Infers room connections based on door placements
   * This helps connect rooms that have doors facing each other
   */
  private inferRoomConnections(config: HouseConfig): RoomConnection[] {
    const connections: RoomConnection[] = [];

    for (let i = 0; i < config.rooms.length; i++) {
      for (let j = i + 1; j < config.rooms.length; j++) {
        const room1 = config.rooms[i];
        const room2 = config.rooms[j];

        // Check if rooms are adjacent and have doors that could connect
        if (this.areRoomsAdjacent(room1, room2)) {
          const door1 = room1.doors?.[0];
          const door2 = room2.doors?.[0];

          if (door1 && door2) {
            connections.push({
              fromRoomIndex: i,
              toRoomIndex: j,
              doorMaterial: door1.material,
              description: `Connect ${room1.name || 'Room ' + i} to ${room2.name || 'Room ' + j}`
            });
          }
        }
      }
    }

    return connections;
  }

  /**
   * Checks if two rooms are adjacent (sharing a wall)
   */
  private areRoomsAdjacent(room1: RoomConfig, room2: RoomConfig): boolean {
    const pos1 = room1.position;
    const pos2 = room2.position;

    // Check if rooms are next to each other on any axis
    const xAdjacent = Math.abs(pos1.x - pos2.x) === room1.width || Math.abs(pos1.x - pos2.x) === room2.width;
    const zAdjacent = Math.abs(pos1.z - pos2.z) === room1.depth || Math.abs(pos1.z - pos2.z) === room2.depth;
    const sameY = Math.abs(pos1.y - pos2.y) < 2; // Allow small Y difference

    return sameY && (xAdjacent || zAdjacent);
  }

  /**
   * Validates a generated house configuration
   */
  validateConfig(config: HouseConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.name) {
      errors.push("House must have a name");
    }

    if (!config.rooms || config.rooms.length === 0) {
      errors.push("House must have at least one room");
    }

    config.rooms.forEach((room, index) => {
      if (room.width < 3 || room.depth < 3 || room.height < 3) {
        errors.push(`Room ${index}: Dimensions must be at least 3 blocks`);
      }

      const validRotations = [0, 90, 180, 270];
      if (!validRotations.includes(room.rotation)) {
        errors.push(`Room ${index}: Invalid rotation ${room.rotation}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
